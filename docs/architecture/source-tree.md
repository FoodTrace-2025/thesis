# Source Tree

**Purpose:** Define folder structure, file organization, and monorepo layout for FoodTrace.

---

## Repository Layout

```
foodtrace/
├── .github/                    # GitHub workflows (CI/CD)
│   └── workflows/
│       ├── test.yml            # Run tests on PR
│       └── deploy.yml          # Deploy to Render on merge
├── .husky/                     # Git hooks (pre-commit checks)
├── contracts/                  # Smart contracts (Solidity)
│   ├── ProductRegistry.sol
│   ├── TraceRecords.sol
│   ├── SensorData.sol
│   └── Verification.sol
├── scripts/                    # Deployment scripts (Hardhat)
│   ├── deploy.ts               # Deploy contracts to Sepolia
│   └── verify.ts               # Verify on Etherscan
├── test/                       # Smart contract tests
│   ├── ProductRegistry.test.ts
│   ├── TraceRecords.test.ts
│   └── integration/
│       └── fullWorkflow.test.ts
├── src/                        # Next.js application source
│   ├── pages/                  # Pages Router (routes)
│   │   ├── api/                # Backend API routes
│   │   │   ├── products/
│   │   │   │   ├── register.ts
│   │   │   │   ├── [id].ts
│   │   │   │   └── transfer.ts
│   │   │   ├── trace/
│   │   │   │   ├── add.ts
│   │   │   │   └── history/[productId].ts
│   │   │   ├── iot/
│   │   │   │   ├── simulate.ts
│   │   │   │   └── scenarios.ts
│   │   │   ├── qrcode/
│   │   │   │   └── generate.ts
│   │   │   └── auth/
│   │   │       └── [...nextauth].ts
│   │   ├── producer/
│   │   │   ├── dashboard.tsx
│   │   │   ├── register.tsx
│   │   │   └── product/[id].tsx
│   │   ├── distributor/
│   │   │   ├── dashboard.tsx
│   │   │   ├── receive.tsx
│   │   │   └── product/[id].tsx
│   │   ├── retailer/
│   │   │   ├── dashboard.tsx
│   │   │   └── product/[id].tsx
│   │   ├── consumer/
│   │   │   ├── scan.tsx
│   │   │   └── product/[id].tsx
│   │   ├── admin/
│   │   │   └── iot-simulator.tsx
│   │   ├── _app.tsx            # App wrapper (Chakra provider, auth)
│   │   └── index.tsx           # Homepage
│   ├── components/             # React components
│   │   ├── shared/             # Shared components (Layout, Button, Modal)
│   │   │   ├── Layout.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   ├── producer/           # Producer-specific components
│   │   │   ├── ProductRegistrationForm.tsx
│   │   │   ├── QRCodeDisplay.tsx
│   │   │   └── ProductTable.tsx
│   │   ├── distributor/        # Distributor-specific components
│   │   │   ├── QRScanner.tsx
│   │   │   ├── TraceRecordForm.tsx
│   │   │   └── ProductTimeline.tsx
│   │   ├── consumer/           # Consumer-specific components
│   │   │   ├── ConsumerProductView.tsx
│   │   │   ├── TemperatureChart.tsx
│   │   │   └── BlockchainVerifyButton.tsx
│   │   └── admin/              # Admin-specific components
│   │       ├── ScenarioButtons.tsx
│   │       └── SensorDataPreview.tsx
│   ├── lib/                    # Utility libraries
│   │   ├── prisma.ts           # Prisma client instance
│   │   ├── ethereum.ts         # Viem client configuration
│   │   ├── logger.ts           # Pino logger instance
│   │   ├── config.ts           # Environment variable validation
│   │   ├── walletManager.ts    # Custodial wallet encryption/decryption
│   │   └── qrcode.ts           # QR generation utilities
│   ├── types/                  # TypeScript type definitions
│   │   ├── product.ts
│   │   ├── trace.ts
│   │   ├── sensor.ts
│   │   └── user.ts
│   └── styles/                 # Global styles
│       └── globals.css
├── prisma/                     # Database schema & migrations
│   ├── schema.prisma           # Prisma data model
│   └── migrations/             # Database migration history
│       └── 20250115_init/
│           └── migration.sql
├── public/                     # Static assets
│   ├── images/
│   ├── icons/
│   └── qr-codes/               # Generated QR codes (temporary)
├── docs/                       # Documentation
│   ├── prd.md                  # Product Requirements Document
│   ├── architecture/           # Architecture documents (this file)
│   └── thesis/                 # Thesis chapter templates
├── .env.example                # Environment variable template
├── .env.local                  # Developer secrets (gitignored)
├── .gitignore
├── hardhat.config.ts           # Hardhat configuration
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── package-lock.json           # Lockfile
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project overview
```

---

## Frontend Structure (Next.js Pages)

**Page Routes:**

| Path | File | Purpose |
|------|------|---------|
| `/` | `pages/index.tsx` | Homepage (public landing page) |
| `/producer/dashboard` | `pages/producer/dashboard.tsx` | Producer product list |
| `/producer/register` | `pages/producer/register.tsx` | Product registration form |
| `/producer/product/[id]` | `pages/producer/product/[id].tsx` | Product details, QR download |
| `/distributor/dashboard` | `pages/distributor/dashboard.tsx` | Received products |
| `/distributor/receive` | `pages/distributor/receive.tsx` | QR scanner to receive products |
| `/consumer/product/[id]` | `pages/consumer/product/[id].tsx` | Consumer query (wallet-free) |
| `/admin/iot-simulator` | `pages/admin/iot-simulator.tsx` | IoT data generation |

**Component Organization:**

- **Shared Components:** Reusable across all portals (`Layout`, `LoadingSpinner`, `Modal`)
- **Role-Specific Components:** Used only in specific portal (`ProductRegistrationForm` for producers)
- **Co-location:** Keep component tests next to component files (`ProductCard.tsx` + `ProductCard.test.tsx`)

---

## Backend Structure (API Routes)

**RESTful Endpoint Patterns:**

| Endpoint | Method | Purpose | File |
|----------|--------|---------|------|
| `/api/products/register` | POST | Register product | `pages/api/products/register.ts` |
| `/api/products/:id` | GET | Fetch product details | `pages/api/products/[id].ts` |
| `/api/products/:id/transfer` | POST | Transfer ownership | `pages/api/products/[id]/transfer.ts` |
| `/api/trace/add` | POST | Add trace record | `pages/api/trace/add.ts` |
| `/api/trace/history/:productId` | GET | Fetch trace history | `pages/api/trace/history/[productId].ts` |
| `/api/iot/simulate` | POST | Generate sensor data | `pages/api/iot/simulate.ts` |
| `/api/qrcode/generate` | POST | Generate QR code | `pages/api/qrcode/generate.ts` |

**API Route Structure:**
```typescript
// pages/api/products/register.ts
// 1. Imports
// 2. Input validation schema (Zod)
// 3. Handler function
//    - Method validation
//    - Authentication check
//    - Authorization check (role-based)
//    - Business logic
//    - Response (success/error)
```

---

## Smart Contract Structure

**Contract Files:**

| File | Purpose | Dependencies |
|------|---------|-------------|
| `ProductRegistry.sol` | Product registration, ownership transfers | OpenZeppelin AccessControl |
| `TraceRecords.sol` | Supply chain trace events | ProductRegistry (interface) |
| `SensorData.sol` | IoT sensor data recording | ProductRegistry (interface) |
| `Verification.sol` | Certification verification (optional) | AccessControl |

**Contract Organization:**
- One contract per file (except interfaces)
- Shared interfaces in `contracts/interfaces/`
- OpenZeppelin imports via npm (not copied locally)

---

## Database Structure (Prisma)

**Schema File:** `prisma/schema.prisma`

**Model Definitions:**
- `Company`: Multi-tenant company entity
- `User`: User accounts within companies
- `Product`: Product metadata (links to blockchain)
- `TraceRecord`: Supply chain events
- `SensorReading`: IoT sensor logs
- `QRCode`: Generated QR code metadata

**Migrations:** Stored in `prisma/migrations/`
- Named with timestamp: `20250115_123456_add_alerts_table/`
- Applied sequentially during deployment

---

## Configuration Files

**Environment Variables:**
- `.env.example`: Template (committed to Git)
- `.env.local`: Developer secrets (gitignored)
- `.env.test`: Test environment (CI/CD)

**Build Configuration:**
- `next.config.js`: Next.js settings (security headers, images)
- `hardhat.config.ts`: Solidity compiler, network configs
- `tsconfig.json`: TypeScript compiler options (strict mode)

**Package Management:**
- `package.json`: Dependencies, scripts
- `package-lock.json`: Exact versions (committed)

---

## Testing Structure

**Unit Tests:** Co-located with source files
```
src/components/ProductCard.tsx
src/components/ProductCard.test.tsx  # ← Test next to source
```

**Integration Tests:** Separate directory
```
test/integration/
├── productRegistration.test.ts
├── blockchainSync.test.ts
└── walletManagement.test.ts
```

**E2E Tests:** Separate directory
```
test/e2e/
├── producerWorkflow.test.ts
├── consumerQuery.test.ts
└── iotSimulator.test.ts
```

---

## Monorepo Benefits

**Single Codebase:**
- Shared types between frontend/backend (no duplication)
- Single `npm install` command
- Unified deployment (frontend + backend + contracts)

**Developer Experience:**
- One repository to clone
- Single CI/CD pipeline
- Simplified dependency management

**Trade-offs:**
- Larger repository size (acceptable for POC)
- Cannot deploy frontend/backend independently (acceptable for monolith architecture)

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
