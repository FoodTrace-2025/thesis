### Epic 2: Company & User Management

**Priority:** 🔴 Must Have
**Estimated Time:** 8-10 hours
**Assigned:** TaiSheng (Lead)
**Timeline:** Week 3
**Dependencies:** Epic 1 (Project Setup)

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
- As a **platform admin**, I want to **approve companies** so they get blockchain wallets automatically
- As a **company admin**, I want to **create user accounts for employees** so my team can use the system
- As a **company admin**, I want to **restrict users to company email domain** so only real employees get access

#### Acceptance Criteria (Epic Level)

- ✅ Company registration form (name, email, domain, type: Producer/Distributor/Retailer)
- ✅ Platform admin portal shows pending company applications
- ✅ Admin can approve/reject companies with notes
- ✅ Approved companies automatically get encrypted Ethereum wallet generated
- ✅ Company admin can create users (email must match company domain)
- ✅ Users login with email + password (NextAuth.js)
- ✅ Role-based access control (PLATFORM_ADMIN, COMPANY_ADMIN, PRODUCER, DISTRIBUTOR, RETAILER)
- ✅ Audit log shows which user performed actions

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
async function approveCompany(companyId) {
  const wallet = ethers.Wallet.createRandom();
  const encryptedKey = encrypt(wallet.privateKey, process.env.ENCRYPTION_KEY);

  await db.company.update({
    where: { id: companyId },
    data: {
      status: "APPROVED",
      encryptedPrivateKey: encryptedKey,
      walletAddress: wallet.address,
    },
  });
}
```

#### Dependencies

**Requires:** Epic 1 (Supabase + Prisma setup)
**Blocks:** Epic 5 (Product Registration - need company wallets)

#### Team Assignment

**TaiSheng (6-8 hours):**

- Company registration form + API (2 hours)
- Admin approval workflow (2 hours)
- Wallet generation on approval (2 hours)
- User creation by company admin (2 hours)
- Email domain validation (1 hour)

#### Risks & Mitigations

| Risk                                        | Mitigation                                 |
| ------------------------------------------- | ------------------------------------------ |
| Fake company registrations                  | Manual admin approval required             |
| User creates account with non-company email | Email domain validation enforced           |
| Wallet generation fails                     | Retry logic, fallback to manual generation |
