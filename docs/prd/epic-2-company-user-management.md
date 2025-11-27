### Epic 2: Company & User Management

**Priority:** 🔴 Must Have
**Estimated Time:** 8-10 hours
**Assigned:** TaiSheng (Lead), YiLing (Support)
**Timeline:** Week 3
**Dependencies:** Epic 1 (Project Setup), Epic 3 Tier 1 (Wallet Encryption Working)

#### Epic Description

Implement multi-tenant company registration and user management system. **Simplified POC Flow (Session 31):** Platform admins (developers) manually create companies and approve them. Approved companies get custodial Ethereum wallets automatically generated. Platform admins create the first COMPANY_ADMIN user, who can then create employee accounts.

**Note:** Self-registration was removed for POC simplicity. Companies are onboarded via B2B agreements, then PLATFORM_ADMIN sets them up manually.

#### Business Value

- **Multi-Tenant Foundation:** Enables multiple companies to use platform (realistic enterprise model)
- **Controlled Onboarding:** B2B enterprise model - companies onboarded via agreements, not self-registration
- **Audit Trail:** Know which user (within company) performed which action (database tracks userId, blockchain tracks company)
- **Scalability:** Architecture supports 10, 100, 1000+ companies

#### User Stories (High-Level) - Updated Session 31

- As a **platform admin**, I want to **create company records** so I can onboard new B2B partners
- As a **platform admin**, I want to **approve companies** so they get blockchain wallets automatically
- As a **platform admin**, I want to **create the first COMPANY_ADMIN user** for approved companies
- As a **company admin**, I want to **create user accounts for employees** with initial passwords
- As a **company admin**, I want to **restrict users to company email domain** so only real employees get access

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This epic depends on Epic 1 WALLET_ENCRYPTION_KEY being generated. Verify .env.local contains:

```bash
WALLET_ENCRYPTION_KEY="[64-char hex from Epic 1]"
```

**Team Decision Required (15 minutes together):**

- ✅ Choose email notification service (optional for Epic 2, required later for Epic 6):
  - **Option A (Recommended):** Supabase Email - No external account, 3 emails/hour free tier
  - **Option B:** SendGrid - 100 emails/day free, requires account at sendgrid.com
  - **Option C:** Console logging only - No emails (acceptable for Epic 2 MVP)
- ✅ If choosing SendGrid: Create account, verify sender email, obtain API key, add to .env.local

**Developer Setup (After Prerequisites):**

- No additional external accounts needed
- Epic 3 Tier 1 wallet encryption must be working before Epic 2 wallet generation

#### Acceptance Criteria (Epic Level) - Updated Session 31

**Company Management (PLATFORM_ADMIN):**

- ✅ PLATFORM_ADMIN can create company records via admin UI (name, email, domain, type)
- ✅ New companies created with status: PENDING (no wallet yet)
- ✅ Platform admin portal shows all companies in list view (with status filter)
- ✅ Platform admin dashboard has "Approve Company" button
- ✅ Admin can reject companies with rejection reason
- ✅ Approved companies automatically get encrypted Ethereum wallet generated server-side
- ✅ Wallet generation uses Epic 3 Tier 1 encryption (AES-256-GCM with WALLET_ENCRYPTION_KEY)

**User Management:**

- ✅ PLATFORM_ADMIN can create first COMPANY_ADMIN user for approved companies
- ✅ COMPANY_ADMIN can create employee user accounts with initial passwords
- ✅ Email domain validation enforced: email.endsWith(`@${company.domain}`)
- ✅ Users login with email + password (NextAuth.js authentication)
- ✅ Role-based access control using Prisma enums (PLATFORM_ADMIN, COMPANY_ADMIN, PRODUCER, DISTRIBUTOR, RETAILER)

**Error Handling & Security:**

- ✅ Wallet decryption failure returns 500 error with audit log entry
- ✅ Audit log shows which user performed actions (tracks companyId + userId for all operations)
- ✅ Email domain validation fails gracefully with clear error message

#### Technical Approach

**Database Schema (Prisma) - Updated with Enums (Session 31):**

```prisma
enum CompanyStatus {
  PENDING    // Awaiting approval
  APPROVED   // Approved, wallet generated
  REJECTED   // Rejected by admin
}

enum CompanyType {
  PRODUCER     // Farms, manufacturers
  DISTRIBUTOR  // Logistics, warehouses
  RETAILER     // Stores, markets
}

enum UserRole {
  PLATFORM_ADMIN  // Developers - manage platform
  COMPANY_ADMIN   // Company owner - manage company users
  PRODUCER        // Farm worker - register products
  DISTRIBUTOR     // Driver/warehouse - transport products
  RETAILER        // Store clerk - sell products
}

model Company {
  id                  String        @id @default(cuid())
  name                String
  email               String        @unique
  domain              String        // "hirsimakifarm.fi"
  status              CompanyStatus @default(PENDING)
  type                CompanyType

  encryptedPrivateKey String?       // One wallet per company (AES-256-GCM encrypted)
  walletAddress       String?       // Ethereum address (0x...)

  createdAt           DateTime      @default(now())
  approvedAt          DateTime?
  users               User[]
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String   // bcrypt hash
  role         UserRole
  companyId    String?  // Nullable for PLATFORM_ADMIN
  company      Company? @relation(fields: [companyId], references: [id])
}
```

**API Endpoints (Simplified for POC):**

- `POST /api/admin/companies` - PLATFORM_ADMIN creates company (Auth: Story 2.5)
- `GET /api/admin/companies` - List all companies with status filter (Auth: Story 2.5)
- `POST /api/admin/companies/:id/approve` - Approve company, generates wallet (Auth: Story 2.5)
- `POST /api/admin/companies/:id/reject` - Reject company with reason (Auth: Story 2.5)
- `POST /api/admin/users` - PLATFORM_ADMIN creates COMPANY_ADMIN (Auth: Story 2.5)
- `POST /api/companies/users` - COMPANY_ADMIN creates employees (Auth: Story 2.5)
- `POST /api/auth/login` - Email/password authentication

**Note:** Admin endpoints created without auth in Story 2.2-2.4. Auth added systematically in Story 2.5.

**Wallet Generation Flow:**

```typescript
// src/lib/wallet.ts (uses Epic 3 Tier 1 encryption)
import crypto from 'crypto';
import { ethers } from 'ethers';

async function approveCompany(companyId: string) {
  // Generate new Ethereum wallet
  const wallet = ethers.Wallet.createRandom();

  // Encrypt private key using Epic 3 Tier 1 encryption
  const encryptedKey = encryptWalletKey(wallet.privateKey, process.env.WALLET_ENCRYPTION_KEY);

  // Store in database
  await db.company.update({
    where: { id: companyId },
    data: {
      status: "APPROVED",
      encryptedPrivateKey: encryptedKey,
      walletAddress: wallet.address,
      approvedAt: new Date(),
    },
  });

  // Audit log entry
  await db.auditLog.create({
    data: {
      action: "COMPANY_APPROVED",
      companyId: companyId,
      userId: adminUserId,
      details: { walletAddress: wallet.address },
    },
  });
}
```

**Email Domain Validation:**

```typescript
// src/lib/validation.ts
export function validateEmailDomain(email: string, companyDomain: string): boolean {
  return email.endsWith(`@${companyDomain}`);
}

// Usage in API route:
if (!validateEmailDomain(userEmail, company.domain)) {
  throw new Error(`Email must be from domain: ${company.domain}`);
}
```

**Company Email Validation (Story 2.2):**

```typescript
// Company contact email MUST match company domain
// If domain is "farm.fi", company email must be "something@farm.fi"
// This is validated in the createCompanySchema Zod refinement
if (!companyEmail.endsWith(`@${companyDomain}`)) {
  throw new Error('Company email must match company domain');
}
```

**Technical Dependencies:**

- **NextAuth.js v4** - Email/password authentication, JWT session management
- **crypto** (Node.js built-in) - Wallet encryption/decryption (or use Epic 3 library)
- **email-validator** package - Enhanced email validation (npm install email-validator)
- **ethers.js** - Ethereum wallet generation (Wallet.createRandom())

#### Dependencies

**Requires:**
- Epic 1 (Supabase + Prisma setup complete)
- Epic 3 Tier 1 (Wallet encryption/decryption working - encryptWalletKey() function available)

**Blocks:** Epic 5 (Product Registration - need company wallets to register products)

#### Team Assignment

**TaiSheng (6-7 hours - Backend Lead):**

- Company registration form + API (2 hours)
  - POST /api/companies/apply endpoint
  - Prisma Company model CRUD operations
- Admin approval workflow backend (2 hours)
  - GET /api/admin/companies/pending endpoint
  - POST /api/admin/companies/:id/approve endpoint
  - POST /api/admin/companies/:id/reject endpoint
- Wallet generation on approval (integrates Epic 3 Tier 1 encryption) (1.5 hours)
  - Call encryptWalletKey() from Epic 3
  - Store encrypted key in database
  - Audit log implementation
- User creation by company admin (1.5 hours)
  - POST /api/companies/users endpoint
  - Email domain validation logic
  - Role assignment (COMPANY_ADMIN, PRODUCER, etc.)

**YiLing (2 hours - Frontend Support):**

- Platform admin approval UI (2 hours)
  - Admin dashboard page (list pending companies)
  - "Approve" and "Reject" buttons with confirmation modals
  - Rejection reason text input
  - Display rejection reason to rejected companies

#### Risks & Mitigations

| Risk                                        | Mitigation                                                     |
| ------------------------------------------- | -------------------------------------------------------------- |
| User creates account with non-company email | Email domain validation enforced: email.endsWith(domain)       |
| Wallet generation fails                     | Retry logic with exponential backoff, audit log failure entry  |
| WALLET_ENCRYPTION_KEY not in .env.local     | Epic 1 prerequisite check, fail fast with clear error message  |
| Epic 3 Tier 1 not complete                  | Block Epic 2 start until Epic 3 Tier 1 encryption working     |
| Company wallets need Sepolia ETH            | Get from faucet after wallet generation                        |

#### Simplified User Flow (Session 31)

**Phase 1: Setup (PLATFORM_ADMIN - developers)**
```
1. PLATFORM_ADMIN creates Company record:
   - Name: "Hirsimaki Farm Ltd"
   - Email: contact@hirsimakifarm.fi
   - Domain: hirsimakifarm.fi
   - Type: PRODUCER
   → Saved with status: PENDING (no wallet yet)

2. PLATFORM_ADMIN approves Company:
   → System generates wallet via ethers.Wallet.createRandom()
   → Private key encrypted with WALLET_ENCRYPTION_KEY
   → Status: APPROVED, wallet fields populated

3. PLATFORM_ADMIN creates first user:
   - Email: admin@hirsimakifarm.fi
   - Role: COMPANY_ADMIN
   - Password: (set by PLATFORM_ADMIN)

4. Get Sepolia ETH from faucet for company wallet
```

**Phase 2: Company Setup (COMPANY_ADMIN)**
```
1. Login with admin@hirsimakifarm.fi

2. Create employee accounts:
   - worker1@hirsimakifarm.fi (role: PRODUCER)
   - worker2@hirsimakifarm.fi (role: PRODUCER)
   - Set initial passwords for each
```

**Phase 3: Operations (Employees)**
```
1. PRODUCER logs in → registers products, records harvests
2. DISTRIBUTOR logs in → receives products, records shipments
3. RETAILER logs in → receives products, marks sold, generates QR
```

**Wallet Architecture:**
- **Deployer Wallet** (PRIVATE_KEY in .env) - Deploy smart contracts only
- **Company Wallets** - Auto-generated per company for blockchain transactions
- **WALLET_ENCRYPTION_KEY** - Encrypts company wallet private keys in database
