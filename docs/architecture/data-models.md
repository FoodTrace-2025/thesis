# Data Models (Prisma Schema)

**Purpose:** Define entity models, relationships, and Prisma ORM schema.

---

## Prisma Schema Overview

**File:** `prisma/schema.prisma`

**Key Models:**
- `Company`: Multi-tenant company entity (one wallet per company)
- `User`: Individual user accounts within companies
- `Product`: Product metadata (links to blockchain via blockchainId)
- `TraceRecord`: Supply chain event log
- `SensorReading`: IoT sensor data (simulated or real)
- `QRCode`: Generated QR code metadata

---

## Entity Relationship Diagram

```mermaid
erDiagram
    Company ||--o{ User : "employs"
    Company ||--o{ Product : "owns"
    User ||--o{ TraceRecord : "creates"
    Product ||--o{ TraceRecord : "has_history"
    Product ||--o{ SensorReading : "has_readings"
    Product ||--o{ QRCode : "has_qrcode"

    Company {
        string id PK
        string name
        string email UK
        CompanyStatus status
        CompanyType type
        string encryptedPrivateKey
        string walletAddress
        datetime createdAt
        datetime updatedAt
    }

    User {
        string id PK
        string email UK
        string password
        string name
        UserRole role
        string companyId FK
        datetime createdAt
    }

    Product {
        string id PK
        int blockchainId UK
        string name
        string origin
        datetime harvestDate
        string imageUrl
        string description
        string transactionHash UK
        string companyId FK
        datetime createdAt
    }

    TraceRecord {
        string id PK
        string productId FK
        string action
        string location
        string notes
        string actorUserId FK
        string txHash UK
        datetime createdAt
    }

    SensorReading {
        string id PK
        string productId FK
        float temperature
        float humidity
        string location
        AlertLevel alertLevel
        boolean isSimulated
        string txHash
        datetime createdAt
    }

    QRCode {
        string id PK
        string productId FK UK
        string qrCodeUrl
        string downloadUrl
        datetime generatedAt
    }
```

---

## Model Definitions

### Company Model

**Purpose:** Multi-tenant isolation unit, owns custodial Ethereum wallet

```prisma
model Company {
  id                   String        @id @default(uuid())
  name                 String
  email                String        @unique
  status               CompanyStatus @default(PENDING)
  type                 CompanyType
  encryptedPrivateKey  String        // AES-256-GCM encrypted
  walletAddress        String        @unique
  createdAt            DateTime      @default(now())
  updatedAt            DateTime      @updatedAt

  users                User[]
  products             Product[]
}

enum CompanyStatus {
  PENDING    // Applied, awaiting approval
  APPROVED   // Active, can register products
  REJECTED   // Denied access
}

enum CompanyType {
  PRODUCER
  DISTRIBUTOR
  RETAILER
}
```

**Key Fields:**
- `encryptedPrivateKey`: Custodial wallet private key (AES-256 encrypted)
- `walletAddress`: Ethereum address (0x...)
- `status`: Approval workflow (PENDING → APPROVED/REJECTED)

---

### User Model

**Purpose:** Individual user account within a company

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String   // bcrypt hashed
  name          String
  role          UserRole
  companyId     String
  company       Company  @relation(fields: [companyId], references: [id])
  createdAt     DateTime @default(now())

  traceRecords  TraceRecord[]
}

enum UserRole {
  PLATFORM_ADMIN    // FoodTrace operator
  COMPANY_ADMIN     // Company administrator
  PRODUCER          // Farm manager
  DISTRIBUTOR       // Distribution inspector
  RETAILER          // Retail clerk
}
```

**Key Fields:**
- `role`: Role-based access control (RBAC)
- `companyId`: Foreign key to Company (multi-tenant isolation)
- `password`: bcrypt hash (cost factor 12)

---

### Product Model

**Purpose:** Central entity linking on-chain and off-chain data

```prisma
model Product {
  id                String         @id @default(uuid())
  blockchainId      Int            @unique  // Matches smart contract Product ID
  name              String
  origin            String
  harvestDate       DateTime
  imageUrl          String?
  description       String?
  transactionHash   String         @unique  // Blockchain registration tx
  companyId         String
  company           Company        @relation(fields: [companyId], references: [id])
  createdAt         DateTime       @default(now())

  traceRecords      TraceRecord[]
  sensorReadings    SensorReading[]
  qrCode            QRCode?

  @@index([companyId, blockchainId])  // Composite index for fast lookups
  @@index([blockchainId])              // Consumer QR queries
}
```

**Key Fields:**
- `blockchainId`: Links to smart contract Product ID (uint256)
- `transactionHash`: Ethereum registration transaction hash
- `companyId`: Multi-tenant isolation (company-scoped queries)

---

### TraceRecord Model

**Purpose:** Supply chain event log (who, what, where, when)

```prisma
model TraceRecord {
  id          String   @id @default(uuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  action      String   // "RECEIVED" | "QUALITY_CHECK" | "SHIPPED" | "STOCKED" | "SOLD"
  location    String
  notes       String?
  actorUserId String
  actor       User     @relation(fields: [actorUserId], references: [id])
  txHash      String?  @unique  // Blockchain transaction hash (optional)
  createdAt   DateTime @default(now())

  @@index([productId, createdAt])  // Timeline queries
}
```

**Key Fields:**
- `action`: Supply chain event type (enum-like string)
- `actorUserId`: Audit trail (which user performed action)
- `txHash`: Links to blockchain trace transaction

---

### SensorReading Model

**Purpose:** IoT sensor data (temperature, humidity, GPS)

```prisma
model SensorReading {
  id          String     @id @default(uuid())
  productId   String
  product     Product    @relation(fields: [productId], references: [id], onDelete: Cascade)
  temperature Float      // Celsius (stored as float, not int × 100)
  humidity    Float      // Percentage (0-100)
  location    String     // GPS coordinates or text
  alertLevel  AlertLevel
  isSimulated Boolean    @default(false)  // Transparency flag
  txHash      String?    // Blockchain tx (only for CRITICAL alerts)
  createdAt   DateTime   @default(now())

  @@index([productId, createdAt])         // Chart queries (temperature over time)
  @@index([alertLevel, createdAt])        // Alert dashboard
}

enum AlertLevel {
  NORMAL     // <8°C
  WARNING    // 8-10°C
  CRITICAL   // >10°C
}
```

**Key Fields:**
- `isSimulated`: Transparency (true for IoT simulator, false for real sensors)
- `alertLevel`: Computed from temperature threshold
- `txHash`: Only CRITICAL alerts stored on-chain

---

### QRCode Model

**Purpose:** Generated QR code metadata

```prisma
model QRCode {
  id          String   @id @default(uuid())
  productId   String   @unique  // One-to-one with Product
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  qrCodeUrl   String   // Supabase Storage PNG file URL
  downloadUrl String   // Pre-signed download link
  generatedAt DateTime @default(now())
}
```

**Key Fields:**
- `productId`: One-to-one relationship (unique constraint)
- `qrCodeUrl`: Supabase Storage public URL
- `downloadUrl`: Temporary pre-signed download link

---

## Data Integrity Constraints

**Unique Constraints:**
```sql
-- Ensure blockchain ID is unique (cannot register same product twice)
ALTER TABLE products ADD CONSTRAINT unique_blockchain_id UNIQUE (blockchainId);

-- Ensure transaction hash is unique (prevent duplicate sync)
ALTER TABLE products ADD CONSTRAINT unique_tx_hash UNIQUE (transactionHash);

-- Ensure QR code is one-to-one with product
ALTER TABLE qr_codes ADD CONSTRAINT unique_product_qr UNIQUE (productId);
```

**Foreign Key Cascades:**
```sql
-- Delete trace records when product deleted
ALTER TABLE trace_records ADD CONSTRAINT fk_product
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE;

-- Delete sensor readings when product deleted
ALTER TABLE sensor_readings ADD CONSTRAINT fk_product
  FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE;
```

---

## Prisma Client Usage

**Type-Safe Queries:**
```typescript
// Fetch product with relations
const product = await prisma.product.findUnique({
  where: { id: productId },
  include: {
    company: true,
    traceRecords: {
      orderBy: { createdAt: 'asc' },
      include: { actor: true },
    },
    sensorReadings: {
      where: { alertLevel: { in: ['WARNING', 'CRITICAL'] } },
      orderBy: { createdAt: 'desc' },
    },
    qrCode: true,
  },
});

// Create product with transaction
await prisma.$transaction(async (tx) => {
  const product = await tx.product.create({
    data: {
      blockchainId: 123,
      name: 'Organic Milk',
      origin: 'Oulu',
      harvestDate: new Date('2025-11-15'),
      transactionHash: '0x...',
      companyId: 'uuid-company-1',
    },
  });

  await tx.qrCode.create({
    data: {
      productId: product.id,
      qrCodeUrl: 'https://storage.supabase.co/qr-123.png',
      downloadUrl: 'https://storage.supabase.co/download/qr-123.png',
    },
  });
});
```

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
