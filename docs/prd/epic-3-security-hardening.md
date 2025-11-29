### Epic 3: Security Hardening

**Priority:** 🔴 Must Have (Tier 1) + 🟡 Should Have (Tier 2)
**Estimated Time:** 4.5 hours (Tier 1) + 9 hours (Tier 2) + 3 hours (Tier 3) = 16.5 hours total
**Assigned:** TaiSheng (Lead, 10-13 hours), Sam (Support, 2-3 hours), YiLing (Process, 0 hours)
**Timeline:** Week 3-4 (parallel with Epic 4 Component Library)
**Dependencies:** Epic 1 (Project Setup), Story 2.1 (Company/User Prisma models)

**Note:** This epic was created in Session 4 based on architecture risk assessment. See full specification earlier in this document (Epic 3: Security Hardening section with 3 tiers).

#### Epic Description

Implement production-grade security controls to protect custodial wallets, prevent cross-tenant data leaks, and establish security best practices. Addresses three critical concerns: custodial wallet security, multi-tenant data isolation, and development process security.

#### Business Value

- **Wallet Protection:** Prevents $10,000+ losses from private key exposure (real-world Hardhat deploy key leaks)
- **Compliance Ready:** Multi-tenant isolation meets GDPR data separation requirements
- **Trust Building:** Professional security posture increases company adoption confidence
- **Risk Mitigation:** Catches vulnerabilities before production deployment

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This epic depends on Epic 1 WALLET_ENCRYPTION_KEY and Story 2.1 (Prisma Company/User models). Verify .env.local contains:

```bash
WALLET_ENCRYPTION_KEY="[64-char hex from Epic 1]"
```

**Team Decision Required (30 minutes together - BEFORE starting Epic 3):**

- ✅ Establish pair programming schedule for security-critical code:
  - **Tier 1 wallet encryption** (4.5h) - TaiSheng + Sam pair session
  - **Tier 2 tenant middleware** (3h) - TaiSheng + Sam pair session
  - Schedule specific dates/times for both sessions
- ✅ Decide Tier 2 vs Tier 3 cutoff (9h vs 3h optional features)
  - If running ahead of schedule: Implement Tier 2 (audit logging, RLS)
  - If behind schedule: Skip Tier 2, document in risks
- ✅ Assign Epic 4 Component Library early start to YiLing (parallel work during Epic 3)
  - YiLing begins Epic 4 while TaiSheng/Sam work on Epic 3
  - Reduces critical path by 1 week

**Developer Setup (After Prerequisites):**

- No additional external accounts needed (uses Epic 1 credentials)
- Node.js crypto library (built-in, no npm install required)

#### Three-Tier Approach

**Tier 1: MUST HAVE (4.5 hours - CRITICAL):**

- Node.js crypto library (built-in AES-256-GCM) for wallet private key encryption
- Environment variable security (.env.local in .gitignore, never commit secrets)
- Prisma tenant client (createTenantClient factory with automatic companyId filtering)
- Wallet encryption/decryption utility functions with error handling
- Unit tests for encryption functions (>90% coverage)

**Tier 2: SHOULD HAVE (9 hours - High Value):**

- Supabase Row Level Security (RLS) policies for Company/User/Product tables
- Audit logging for all wallet operations (encrypt, decrypt, create, transfer)
- Cross-tenant integration tests (Company A cannot access Company B data)
- Input validation library (Zod or Yup) for API endpoints
- SQL injection prevention audit (Prisma ORM safety verification)

**Tier 3: NICE TO HAVE (3 hours - Optional):**

- Key rotation strategy documentation (WALLET_ENCRYPTION_KEY rotation process)
- Advanced RLS policies (user-level row access control)
- Security code review checklist (docs/security-checklist.md)
- Penetration testing guide for thesis appendix

#### Acceptance Criteria (Epic Level)

**Tier 1 Acceptance Criteria (MUST HAVE - 4.5 hours):**

- ✅ Wallet encryption utility implemented using Node.js crypto (AES-256-GCM algorithm)
- ✅ Wallet decryption utility implemented with error handling (returns null on failure, logs error)
- ✅ WALLET_ENCRYPTION_KEY loaded from environment variables (process.env.WALLET_ENCRYPTION_KEY)
- ✅ Encryption functions generate unique IV (initialization vector) for each encryption
- ✅ Unit tests for encryption/decryption achieve >90% code coverage
- ✅ Unit test: Encrypt → Decrypt returns original private key
- ✅ Unit test: Decryption with wrong key returns error
- ✅ Unit test: Encryption uses different IV each time (same input → different ciphertext)
- ✅ .env.local in .gitignore (verified no secrets committed to git history)
- ✅ Prisma tenant client implemented (createTenantClient factory with $extends)
- ✅ Tenant isolation test: Company A user query only returns Company A data

**Tier 2 Acceptance Criteria (SHOULD HAVE - 9 hours):**

- ⏸️ Supabase RLS policies enabled on Company, User, Product tables - **DEFERRED** (requires non-superuser DB role)
- ⏸️ RLS policy test: Direct SQL query respects company isolation - **DEFERRED**
- ✅ Audit log model added to Prisma schema (action, userId, companyId, timestamp, details)
- ✅ Audit logging implemented for wallet operations (CREATE_WALLET, ENCRYPT_KEY, DECRYPT_KEY, TRANSFER_PRODUCT)
- ✅ Input validation library integrated (Zod) with schema validation on all API endpoints
- ✅ Cross-tenant integration test suite (3+ test cases verifying data isolation)
- ✅ SQL injection audit complete (Prisma ORM verified, no raw SQL queries)

**Tier 3 Acceptance Criteria (NICE TO HAVE - 3 hours):**

- ⚪ Key rotation documentation written (docs/security/key-rotation.md)
- ⚪ Security code review checklist created (docs/security/code-review-checklist.md)
- ⚪ Advanced RLS policies implemented (user-level row access control)
- ⚪ Penetration testing guide drafted for thesis appendix

#### Technical Approach

**Tier 1: Wallet Encryption (Node.js crypto - AES-256-GCM):**

```typescript
// src/lib/crypto/wallet-encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export function encryptWalletKey(privateKey: string, encryptionKey: string): string {
  // Generate random IV for each encryption
  const iv = crypto.randomBytes(IV_LENGTH);

  // Create cipher with encryption key
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(encryptionKey, 'hex'),
    iv
  );

  // Encrypt private key
  let encrypted = cipher.update(privateKey, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Get authentication tag
  const authTag = cipher.getAuthTag();

  // Return: IV + authTag + ciphertext (all hex-encoded)
  return iv.toString('hex') + authTag.toString('hex') + encrypted;
}

export function decryptWalletKey(encryptedData: string, encryptionKey: string): string | null {
  try {
    // Extract IV, authTag, ciphertext
    const iv = Buffer.from(encryptedData.slice(0, IV_LENGTH * 2), 'hex');
    const authTag = Buffer.from(encryptedData.slice(IV_LENGTH * 2, (IV_LENGTH + AUTH_TAG_LENGTH) * 2), 'hex');
    const encrypted = encryptedData.slice((IV_LENGTH + AUTH_TAG_LENGTH) * 2);

    // Create decipher
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(encryptionKey, 'hex'),
      iv
    );
    decipher.setAuthTag(authTag);

    // Decrypt
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  } catch (error) {
    console.error('Wallet decryption failed:', error);
    return null; // Return null on failure
  }
}
```

**Tier 1: Prisma Tenant Client (Prisma 7 - Client Extensions):**

> **Note (Session 37):** Updated from deprecated `$use` middleware API (removed in Prisma 7) to `$extends` Client Extensions approach. See [Prisma 7 Upgrade Guide](https://www.prisma.io/docs/orm/more/upgrade-guides/upgrading-versions/upgrading-to-prisma-7).

```typescript
// src/lib/prisma/tenant-client.ts
import { prisma } from '@/lib/prisma';

/**
 * Creates a tenant-scoped Prisma client that automatically filters
 * queries by companyId. Use this for company-scoped operations.
 *
 * PLATFORM_ADMIN should use the base `prisma` client for cross-tenant access.
 *
 * @param companyId - The company ID to scope all queries to
 * @returns Extended Prisma client with automatic companyId filtering
 */
export function createTenantClient(companyId: string) {
  return prisma.$extends({
    query: {
      user: {
        async findMany({ args, query }) {
          args.where = { ...args.where, companyId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, companyId };
          return query(args);
        },
        async findUnique({ args, query }) {
          // findUnique doesn't support compound where, so we use findFirst
          return query(args);
        },
        async update({ args, query }) {
          args.where = { ...args.where, companyId } as typeof args.where;
          return query(args);
        },
        async delete({ args, query }) {
          args.where = { ...args.where, companyId } as typeof args.where;
          return query(args);
        },
      },
      auditLog: {
        async findMany({ args, query }) {
          args.where = { ...args.where, companyId };
          return query(args);
        },
        async findFirst({ args, query }) {
          args.where = { ...args.where, companyId };
          return query(args);
        },
      },
      // Future models (Epic 5+): product, traceRecord, sensorReading
    },
  });
}

// Type for the extended client
export type TenantPrismaClient = ReturnType<typeof createTenantClient>;
```

**Usage Pattern:**
```typescript
// In API route or service function
import { createTenantClient } from '@/lib/prisma/tenant-client';

// Get companyId from authenticated session
const tenantPrisma = createTenantClient(session.user.companyId);

// All queries automatically filtered by companyId
const users = await tenantPrisma.user.findMany(); // Only returns company's users
const logs = await tenantPrisma.auditLog.findMany(); // Only returns company's logs
```

**Tier 2: Supabase RLS Policy Example:**

```sql
-- Enable RLS on Company table
ALTER TABLE "Company" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own company
CREATE POLICY company_isolation ON "Company"
  FOR ALL
  USING (id = current_setting('app.current_company_id')::text);

-- Policy: Users can only see products from their company
CREATE POLICY product_isolation ON "Product"
  FOR ALL
  USING ("companyId" = current_setting('app.current_company_id')::text);
```

**Tier 2: Audit Log Model:**

```prisma
model AuditLog {
  id        String   @id @default(cuid())
  action    String   // "CREATE_WALLET", "ENCRYPT_KEY", "DECRYPT_KEY", "TRANSFER_PRODUCT"
  userId    String
  companyId String
  details   Json?    // { walletAddress, productId, etc. }
  timestamp DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  company   Company  @relation(fields: [companyId], references: [id])

  @@index([companyId, timestamp])
  @@index([userId, timestamp])
}
```

**Technical Dependencies:**

- **Node.js crypto** (built-in) - AES-256-GCM encryption
- **Zod** (npm install zod) - Input validation schemas (Tier 2)
- **@prisma/client v7** - Client Extensions ($extends) for tenant isolation
- **@prisma/adapter-pg** - Required for Prisma 7 PostgreSQL adapter pattern

#### Dependencies

**Requires:** Epic 1 (WALLET_ENCRYPTION_KEY), Story 2.1 (Company/User Prisma models for tenant middleware)
**Blocks:** Epic 5 (Product Registration - wallet encryption must work before product blockchain transactions)
**Parallel:** Epic 4 (Component Library - YiLing starts Epic 4 while TaiSheng/Sam work on Epic 3)

#### Team Assignment

**TaiSheng (10-13 hours - Security Lead):**

**Tier 1 Implementation (4.5 hours - PAIR with Sam):**
- Wallet encryption utility (2 hours)
  - Implement encryptWalletKey() using Node.js crypto AES-256-GCM
  - Implement decryptWalletKey() with error handling
  - Generate unique IV for each encryption operation
- Unit tests for encryption functions (1.5 hours)
  - Test encrypt → decrypt roundtrip
  - Test decryption with wrong key (should return null)
  - Test IV uniqueness (same input → different ciphertext)
  - Achieve >90% code coverage
- Prisma tenant client (1 hour)
  - Implement createTenantClient() factory using $extends
  - Test tenant isolation with Company A/B data

**Tier 2 Implementation (9 hours - Optional, if time permits):**
- Supabase RLS policies (3 hours - PAIR with Sam)
  - Enable RLS on Company, User, Product tables
  - Create company_isolation and product_isolation policies
  - Test RLS with direct SQL queries
- Audit logging implementation (3 hours)
  - Add AuditLog model to Prisma schema
  - Implement audit logging for wallet operations
  - Create audit log query API endpoint
- Input validation + integration tests (3 hours)
  - Install and configure Zod validation library
  - Add schema validation to all API endpoints
  - Write 3+ cross-tenant integration tests
  - Audit Prisma usage for SQL injection safety

**Sam (2-3 hours - Security Review & Support):**

**Tier 1 Support (2 hours - PAIR with TaiSheng):**
- Pair programming session for wallet encryption (1.5 hours)
  - Review AES-256-GCM implementation
  - Verify IV generation randomness
  - Test error handling edge cases
- Security code review (0.5 hours)
  - Review all encryption/decryption code
  - Verify no secrets in git history
  - Check .env.local in .gitignore

**Tier 2 Support (1 hour - Optional):**
- Pair programming session for RLS policies (1 hour)
  - Review SQL policy syntax
  - Test RLS policy enforcement
  - Verify tenant isolation with direct database queries

**YiLing (0 hours - Parallel Epic 4):**
- Begins Epic 4 (Component Library) during Epic 3 implementation
- No Epic 3 assignment (reduces critical path by 1 week)

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Wallet decryption fails in production | Comprehensive error handling, return null on failure, audit log entry, unit tests for error scenarios |
| WALLET_ENCRYPTION_KEY leaked to git | .gitignore verification, pre-commit hook to block .env files, team training on secret management |
| Cross-tenant data leak | Prisma Client Extensions + Supabase RLS (defense in depth), integration tests verify isolation |
| Encryption performance bottleneck | Node.js crypto is native (fast), async operations prevent blocking, benchmark tests verify <100ms encryption time |
| Team unfamiliar with crypto library | Pair programming required (TaiSheng + Sam), use well-documented Node.js crypto (not third-party library) |
| Tier 2 not completed (time constraints) | Tier 1 is sufficient for MVP security, Tier 2 can be added post-deployment if needed |
| Sam unavailable for pair session | TaiSheng proceeds solo with extra code review, documentation of security decisions for later audit |
| Epic 4 starts too late (YiLing blocked) | Epic 3 and Epic 4 run in parallel (explicitly allowed in dependencies), YiLing begins Epic 4 immediately |
