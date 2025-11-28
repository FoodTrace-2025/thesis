# Backend Architecture (API Routes & Server Logic)

**Purpose:** Define backend structure, API routes, server-side logic, and request/response patterns.

---

## Backend Technology

**Runtime:** Node.js 18.x LTS
**Framework:** Next.js API Routes (Pages Router)
**Authentication:** NextAuth.js v4 with JWT sessions
**Database ORM:** Prisma Client v7 (with PostgreSQL adapter)
**Blockchain Client:** Viem (server-side wallet client)

---

## Prisma 7 Configuration (Breaking Change)

**Important:** Prisma 7 introduced a breaking change requiring driver adapters for client instantiation. The project uses the PostgreSQL adapter pattern.

**Required Packages:**
```bash
npm install @prisma/adapter-pg pg @types/pg
```

**Client Configuration:**
```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// Create PostgreSQL connection pool (singleton)
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Reuse pool across hot reloads
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

// Create Prisma client with PostgreSQL adapter (required for Prisma 7)
const adapter = new PrismaPg(pool);
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
```

**Seed Script Pattern (Prisma 7):**
```typescript
// prisma/seed.ts
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

config({ path: '.env.local' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ... seed logic ...

// Cleanup: disconnect both prisma and pool
await prisma.$disconnect();
await pool.end();
```

**Prisma Config (prisma.config.ts):**
```typescript
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
```

**Reference:** [Prisma 7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7)

---

## API Route Structure

**Base Path:** `/api/*`

**Routing Pattern:** File-based routing (Next.js Pages Router)
```
pages/api/
├── products/
│   ├── register.ts          → POST /api/products/register
│   ├── [id].ts              → GET /api/products/:id
│   └── [id]/
│       └── transfer.ts      → POST /api/products/:id/transfer
├── trace/
│   ├── add.ts               → POST /api/trace/add
│   └── history/
│       └── [productId].ts   → GET /api/trace/history/:productId
├── iot/
│   ├── simulate.ts          → POST /api/iot/simulate
│   └── scenarios.ts         → GET /api/iot/scenarios
├── qrcode/
│   └── generate.ts          → POST /api/qrcode/generate
└── auth/
    └── [...nextauth].ts     → POST /api/auth/* (NextAuth.js)
```

---

## API Route Implementation Pattern

**Standard Handler Structure:**

```typescript
// pages/api/products/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { registerProductOnBlockchain } from '@/lib/blockchain';

// 1. Input validation schema (Zod)
const registerSchema = z.object({
  name: z.string().min(3).max(100),
  origin: z.string().min(2).max(50),
  harvestDate: z.date().max(new Date()),
  image: z.instanceof(File).optional(),
});

// 2. Handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 3. Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 4. Authentication check
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 5. Authorization check (role-based)
  if (session.user.role !== 'PRODUCER') {
    return res.status(403).json({ error: 'Forbidden: Only producers can register products' });
  }

  // 6. Input validation
  try {
    const data = registerSchema.parse(req.body);

    // 7. Business logic
    logger.info({ productName: data.name }, 'Product registration started');

    // Upload image to Supabase Storage
    const imageUrl = data.image ? await uploadImage(data.image) : null;

    // Register on blockchain
    const { txHash, productId } = await registerProductOnBlockchain(data, session.user.companyId);

    // Save to database
    const product = await prisma.product.create({
      data: {
        blockchainId: productId,
        name: data.name,
        origin: data.origin,
        harvestDate: data.harvestDate,
        imageUrl,
        transactionHash: txHash,
        companyId: session.user.companyId,
      },
    });

    // Generate QR code
    const qrCode = await generateQRCode(product.id);

    // 8. Success response
    logger.info({ productId: product.id, txHash }, 'Product registered successfully');
    return res.status(200).json({
      success: true,
      productId: product.id,
      blockchainId: productId,
      transactionHash: txHash,
      qrCodeUrl: qrCode.url,
    });

  } catch (error) {
    // 9. Error handling
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }

    logger.error({ error: error.message, stack: error.stack }, 'Product registration failed');
    return res.status(500).json({ error: 'Registration failed' });
  }
}
```

---

## Core API Endpoints

### Product API (`/api/products/*`)

**POST /api/products/register**
- **Purpose:** Register product on blockchain + database
- **Auth:** Required (PRODUCER role)
- **Flow:**
  1. Validate session (NextAuth.js)
  2. Validate input (Zod schema)
  3. Upload image to Supabase Storage
  4. Decrypt company custodial wallet
  5. Sign blockchain transaction (ProductRegistry.registerProduct)
  6. Wait for block confirmation (~12-15s)
  7. Save metadata to PostgreSQL (Prisma)
  8. Generate QR code
  9. Return `{ productId, transactionHash, qrCodeUrl }`

**GET /api/products/:id**
- **Purpose:** Fetch product details (database + blockchain)
- **Auth:** Optional (public for consumers)
- **Flow:**
  1. Query database for metadata (Prisma)
  2. Query blockchain for immutable data (Viem publicClient)
  3. Merge data, return JSON
  4. Cache for 5 minutes (Redis optional, Week 7)

**POST /api/products/:id/transfer**
- **Purpose:** Transfer product ownership
- **Auth:** Required (current owner's company)
- **Flow:**
  1. Validate current owner is msg.sender company
  2. Call ProductRegistry.transferOwnership()
  3. Update database owner
  4. Send email notification to new owner

---

### Trace API (`/api/trace/*`)

**POST /api/trace/add**
- **Purpose:** Add trace record to blockchain + database
- **Auth:** Required (DISTRIBUTOR or RETAILER role)
- **Flow:**
  1. Validate session, check role
  2. Validate product exists
  3. Decrypt custodial wallet
  4. Call TraceRecords.addTraceRecord()
  5. Save detailed notes to database
  6. Return confirmation

**GET /api/trace/history/:productId**
- **Purpose:** Fetch complete trace history
- **Auth:** Optional (public for consumers)
- **Flow:**
  1. Query blockchain for on-chain records (Viem)
  2. Query database for detailed notes
  3. Merge data, sort by timestamp
  4. Return array of trace events

---

### IoT API (`/api/iot/*`)

**POST /api/iot/simulate**
- **Purpose:** Generate and record simulated sensor data
- **Auth:** Required (ADMIN role)
- **Flow:**
  1. Validate admin role
  2. Generate scenario data (Normal/Warning/Critical)
  3. Call SensorData.addSensorData()
  4. Check alert level returned from smart contract
  5. If WARNING or CRITICAL, send email notification
  6. Save detailed log to database (with `isSimulated: true` flag)
  7. Return sensor reading

**GET /api/iot/scenarios**
- **Purpose:** Return preset scenario configurations
- **Auth:** Required (ADMIN role)
- **Response:**
```json
{
  "normal": { "temperature": 3.2, "humidity": 72 },
  "warning": { "temperature": 9.1, "humidity": 78 },
  "critical": { "temperature": 11.5, "humidity": 85 }
}
```

---

### QR Code API (`/api/qrcode/*`)

**POST /api/qrcode/generate**
- **Purpose:** Generate QR code for product
- **Auth:** Required (PRODUCER role)
- **Flow:**
  1. Generate URL: `https://foodtrace.com/consumer/product/{productId}`
  2. Use react-qr-code to generate SVG
  3. Convert to PNG (node-canvas or sharp)
  4. Upload to Supabase Storage
  5. Return public URL

---

## Server-Side Blockchain Integration

**Wallet Management (Updated Session 34 - viem + Story 3.1 encryption):**

```typescript
// lib/wallet.ts - Uses viem (native to Wagmi/RainbowKit ecosystem)
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { encryptWalletKey, decryptWalletKey, getEncryptionKey } from '@/lib/crypto';

// Generate new wallet for company approval
export function generateCompanyWallet() {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);
  const encryptionKey = getEncryptionKey();
  const encryptedPrivateKey = encryptWalletKey(privateKey, encryptionKey);

  return {
    walletAddress: account.address,
    encryptedPrivateKey,
  };
}

// Decrypt wallet for signing transactions
export function getCompanyWalletClient(encryptedPrivateKey: string) {
  const encryptionKey = getEncryptionKey();
  const privateKey = decryptWalletKey(encryptedPrivateKey, encryptionKey);

  if (!privateKey) {
    throw new Error('Failed to decrypt wallet');
  }

  const account = privateKeyToAccount(privateKey as `0x${string}`);

  return createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });
}
```

**Blockchain Transaction Submission:**

```typescript
// lib/blockchain.ts
import { createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export async function registerProductOnBlockchain(data: ProductData, companyId: string) {
  // 1. Get company wallet
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  const privateKey = await decryptWallet(company.encryptedPrivateKey);

  // 2. Create wallet client
  const walletClient = createWalletClient({
    account: privateKeyToAccount(privateKey),
    chain: sepolia,
    transport: http(process.env.ALCHEMY_RPC_URL),
  });

  // 3. Submit transaction
  const txHash = await walletClient.writeContract({
    address: PRODUCT_REGISTRY_ADDRESS,
    abi: ProductRegistryABI,
    functionName: 'registerProduct',
    args: [data.name, data.origin, Math.floor(data.harvestDate.getTime() / 1000)],
  });

  // 4. Wait for confirmation
  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

  // 5. Extract product ID from event
  const productId = receipt.logs[0].topics[1]; // ProductRegistered event

  return { txHash, productId };
}
```

---

## Authentication & Session Management

**NextAuth.js Configuration:**

```typescript
// pages/api/auth/[...nextauth].ts
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { company: true }
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        if (user.company?.status !== 'APPROVED') {
          throw new Error('Company not approved');
        }

        return { id: user.id, email: user.email, companyId: user.companyId };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60,  // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.companyId = user.companyId;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.companyId = token.companyId;
      session.user.role = token.role;
      return session;
    }
  }
};
```

---

## Error Response Format

**Consistent Error Structure:**

```typescript
// Success response
{
  success: true,
  data: { ... }
}

// Error response
{
  error: "User-friendly message",
  code: "VALIDATION_ERROR",  // Optional error code
  details: { field: "harvestDate", issue: "Future date not allowed" }  // Optional details
}
```

**HTTP Status Codes:**
- `200 OK`: Successful operation
- `201 Created`: Resource created
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

**Last Updated:** 2025-11-28 (Session 35 - Added Prisma 7 adapter documentation)
