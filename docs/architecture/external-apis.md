# External APIs & Integrations

**Purpose:** Document external service integrations (Supabase, Ethereum RPC, Etherscan, email).

---

## Supabase Integration

**Service:** Supabase (PostgreSQL + Storage)
**URL:** `https://supabase.co`

### Database Connection

**Protocol:** PostgreSQL wire protocol (port 5432 via pgBouncer port 6543)
**Connection String:** `postgres://user:pass@db.supabase.co:6543/postgres?pgbouncer=true`

**Configuration:**
```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, // Supabase connection string
    },
  },
});
```

**Performance:**
- Connection pooling via pgBouncer (78× faster acquisition: 234ms → 3ms)
- 60 concurrent connections (free tier limit)
- Transaction mode pooling

### Storage API

**Purpose:** Product images and QR code storage

**Bucket Configuration:**
- **Bucket Name:** `foodtrace-products`
- **Public Access:** Enabled for product images
- **Max File Size:** 5MB
- **Allowed Types:** `image/jpeg`, `image/png`, `image/webp`

**Upload Example:**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function uploadProductImage(file: File, productId: string): Promise<string> {
  const fileName = `${productId}-${Date.now()}.${file.type.split('/')[1]}`;

  const { data, error } = await supabase.storage
    .from('foodtrace-products')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from('foodtrace-products')
    .getPublicUrl(fileName);

  return publicUrl.publicUrl;
}
```

---

## Ethereum RPC Providers

### Alchemy (Primary)

**Service:** Alchemy Sepolia RPC
**URL:** `https://eth-sepolia.g.alchemy.com/v2/[API_KEY]`
**Free Tier:** 300 requests/second

**Configuration:**
```typescript
// lib/ethereum.ts
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.ALCHEMY_RPC_URL),
});
```

**Features:**
- Real-time transaction monitoring
- Enhanced API methods (alchemy_getTokenBalances)
- 99.9% uptime SLA
- Automatic request retries

### Infura (Fallback #1)

**Service:** Infura Sepolia RPC
**URL:** `https://sepolia.infura.io/v3/[PROJECT_ID]`
**Free Tier:** 100,000 requests/day

**Fallback Strategy (Updated Session 34 - viem):**
```typescript
import { createPublicClient, http, fallback } from 'viem';
import { sepolia } from 'viem/chains';

// Viem supports built-in fallback transport
export const publicClient = createPublicClient({
  chain: sepolia,
  transport: fallback([
    http(process.env.ALCHEMY_RPC_URL),           // Primary
    http(process.env.INFURA_RPC_URL),            // Fallback #1
    http('https://rpc.sepolia.org'),             // Fallback #2
  ]),
});

// Usage example
export async function getBlockNumber() {
  return await publicClient.getBlockNumber();
}
```

### Public Sepolia RPC (Fallback #2)

**Service:** Public Sepolia testnet
**URL:** `https://rpc.sepolia.org`
**Free Tier:** Unlimited (rate-limited by network)

**Note:** Unreliable, use only as last resort (2.4s average latency vs 876ms for Alchemy)

---

## Etherscan API

**Service:** Etherscan Sepolia Block Explorer
**URL:** `https://api-sepolia.etherscan.io`

### Contract Verification

**Purpose:** Verify smart contract source code on Etherscan

**Command:**
```bash
npx hardhat verify --network sepolia 0x8a791620dd6260079bf849dc5567adc3f2fdc318
```

**API Key:** Stored in `ETHERSCAN_API_KEY` environment variable

### Transaction Lookup

**Purpose:** Allow consumers to independently verify blockchain data

**Frontend Link:**
```typescript
// components/consumer/BlockchainVerifyButton.tsx
const etherscanUrl = `https://sepolia.etherscan.io/tx/${transactionHash}`;

<Button as="a" href={etherscanUrl} target="_blank">
  Verify on Blockchain
</Button>
```

**Use Case:** Consumers click button → Opens Etherscan → See raw blockchain data (trustless verification)

---

## Email Service (SendGrid - Optional)

**Service:** SendGrid Email API
**URL:** `https://api.sendgrid.com/v3/mail/send`
**Free Tier:** 100 emails/day

**Configuration:**
```typescript
// lib/email.ts
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendTemperatureAlert(product: Product, temp: number) {
  const msg = {
    to: product.company.email,
    from: 'noreply@foodtrace.com',
    subject: '🚨 CRITICAL Temperature Alert',
    html: `
      <h2>Temperature Alert</h2>
      <p>Product <strong>${product.name}</strong> exceeded safe temperature.</p>
      <p>Current temperature: <strong>${temp}°C</strong> (Safe limit: 8°C)</p>
      <p><a href="https://foodtrace.onrender.com/producer/product/${product.id}">View Product</a></p>
    `,
  };

  await sgMail.send(msg);
}
```

**Triggered Events:**
1. **Product Transfer:** Notify new owner when product transferred
2. **Sensor Alert:** Notify product owner when WARNING or CRITICAL temperature
3. **Company Approval:** Notify company admin when approved

**Status:** "Should Have" - implement if time permits after core features

---

## External API Summary

| Service | Purpose | Free Tier | Latency | Fallback |
|---------|---------|-----------|---------|----------|
| **Supabase Database** | PostgreSQL hosting | 500MB storage, 2GB bandwidth | 3ms (pgBouncer) | Daily backups |
| **Supabase Storage** | Image/QR storage | 1GB storage, 2GB bandwidth | 50-200ms | Local filesystem |
| **Alchemy RPC** | Ethereum Sepolia queries | 300 req/s | 876ms | Infura, Public RPC |
| **Infura RPC** | Fallback RPC | 100k req/day | 1,123ms | Public RPC |
| **Etherscan** | Block explorer | Unlimited (web) | N/A (user browses) | None needed |
| **SendGrid Email** | Notifications | 100 emails/day | 200-500ms | Console logging |

---

## Error Handling for External APIs

**Retry Strategy (Exponential Backoff):**
```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  throw new Error('Max retries exceeded');
}

// Usage
const product = await retryWithBackoff(() =>
  publicClient.readContract({
    address: PRODUCT_REGISTRY_ADDRESS,
    abi: ProductRegistryABI,
    functionName: 'getProduct',
    args: [productId],
  })
);
```

**Timeout Handling:**
```typescript
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  );
  return Promise.race([promise, timeout]);
}

// Usage: Max 5 seconds for blockchain query
const product = await withTimeout(
  publicClient.readContract({ ... }),
  5000
);
```

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
