### Epic 2: Company & User Management

**Priority:** 🔴 Must Have
**Estimated Time:** 8-10 hours
**Assigned:** TaiSheng (Lead), YiLing (Support)
**Timeline:** Week 3
**Dependencies:** Epic 1 (Project Setup), Epic 3 Tier 1 (Wallet Encryption Working)

#### Epic Description

Implement multi-tenant company registration and user management system. Platform admins can approve/reject company applications. Approved companies get custodial Ethereum wallets automatically generated. Company admins can create user accounts for employees (producers, distributors, retailers).

#### Business Value

- **Multi-Tenant Foundation:** Enables multiple companies to use platform (realistic enterprise model)
- **Onboarding Workflow:** Invitation-only prevents spam, manual approval ensures quality
- **Audit Trail:** Know which user (within company) performed which action
- **Scalability:** Architecture supports 10, 100, 1000+ companies

#### User Stories (High-Level)

- As a **company representative**, I want to **apply to join FoodTrace** so I can use blockchain traceability
- As a **platform admin**, I want to **review company applications** so I can prevent fraud
- As a **platform admin**, I want to **approve companies via dashboard button** so they get blockchain wallets automatically
- As a **company admin**, I want to **create user accounts for employees** so my team can use the system
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

#### Acceptance Criteria (Epic Level)

**Company Registration & Approval:**

- ✅ Company registration form (name, email, domain, type: Producer/Distributor/Retailer)
- ✅ Platform admin portal shows pending company applications in list view
- ✅ Platform admin dashboard has "Approve Company" button (calls /api/admin/companies/:id/approve)
- ✅ Admin can reject companies with notes, rejection reason displayed to applicant
- ✅ Rejected companies can view rejection reason and reapply with corrections
- ✅ Approved companies automatically get encrypted Ethereum wallet generated server-side
- ✅ Wallet generation uses Epic 3 Tier 1 encryption (AES-256-GCM with WALLET_ENCRYPTION_KEY)

**User Management:**

- ✅ Company admin can create user accounts for employees
- ✅ Email domain validation enforced: email.endsWith(`@${company.domain}`)
- ✅ Users login with email + password (NextAuth.js authentication)
- ✅ Role-based access control implemented (PLATFORM_ADMIN, COMPANY_ADMIN, PRODUCER, DISTRIBUTOR, RETAILER)

**Error Handling & Security:**

- ✅ Wallet decryption failure returns 500 error with audit log entry
- ✅ Audit log shows which user performed actions (tracks companyId + userId for all operations)
- ✅ Email domain validation fails gracefully with clear error message

#### Technical Approach

**Database Schema (Prisma):**

```prisma
model Company {
  id                  String   @id @default(cuid())
  name                String
  email               String   @unique
  domain              String   // "hirsimakifarm.fi"
  status              String   // "PENDING" | "APPROVED" | "REJECTED"
  type                String   // "PRODUCER" | "DISTRIBUTOR" | "RETAILER"

  encryptedPrivateKey String?  // One wallet per company
  walletAddress       String?  // Ethereum address

  createdAt           DateTime @default(now())
  approvedAt          DateTime?
  users               User[]
}

model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         String   // "COMPANY_ADMIN" | "PRODUCER" | etc.
  companyId    String?
  company      Company? @relation(fields: [companyId], references: [id])
}
```

**API Endpoints:**

- `POST /api/companies/apply` - Company registration
- `GET /api/admin/companies/pending` - List pending applications
- `POST /api/admin/companies/:id/approve` - Approve company (generates wallet)
- `POST /api/companies/users` - Company admin creates user
- `POST /api/auth/login` - Email/password authentication

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
| Fake company registrations                  | Manual admin approval required, verify company details offline |
| User creates account with non-company email | Email domain validation enforced: email.endsWith(domain)       |
| Wallet generation fails                     | Retry logic with exponential backoff, audit log failure entry  |
| WALLET_ENCRYPTION_KEY not in .env.local     | Epic 1 prerequisite check, fail fast with clear error message  |
| Epic 3 Tier 1 not complete                  | Block Epic 2 start until Epic 3 Tier 1 encryption working     |
| Admin approves malicious company            | Manual verification process, ability to revoke approval later  |
