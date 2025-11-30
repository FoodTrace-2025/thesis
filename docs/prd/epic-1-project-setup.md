### Epic 1: Project Setup & Foundation

**Priority:** 🔴 Must Have
**Estimated Time:** 6-8 hours
**Assigned:** All team members
**Timeline:** Week 1-2
**Dependencies:** None (foundation epic)

#### Epic Description

Establish development environment, tooling, and foundational infrastructure for the FoodTrace project. This includes **user prerequisites** (external service account creation), repository setup, development tools configuration, blockchain tooling, database initialization, and deployment scaffolding.

#### Business Value

- **Foundation for Development:** Without proper setup, Week 3+ development will be blocked
- **Team Onboarding:** Ensures all 3 members can contribute from Day 1
- **Quality Gates:** CI/CD, linting, testing infrastructure prevents bugs
- **Documentation:** README, contribution guidelines establish standards

#### User Stories (High-Level)

**User Prerequisites (Manual Tasks - Complete First):**

- As a team, we want to **create Supabase account** so we have database hosting and obtain DATABASE_URL
- As a team, we want to **create Alchemy account** so we have reliable Ethereum RPC access
- As a team, we want to **create Etherscan account** so we can verify deployed smart contracts
- As a team, we want to **obtain Sepolia testnet ETH from faucets** so we can deploy contracts
- As a team, we want to **generate wallet encryption key** so we can secure custodial wallets
- As a team, we want to **configure .env.local file** so all credentials are stored securely

**Developer Setup (Automated Tasks - After Prerequisites):**

- As a developer, I want to **clone the repository and run `npm install`** so I can start development
- As a developer, I want to **compile and test smart contracts locally** so I can develop offline
- As a developer, I want to **configure local Hardhat network** so I can test offline when RPC providers are down
- As a developer, I want to **run the Next.js dev server** so I can see changes live
- As a developer, I want to **connect to Supabase** so I can test database operations
- As a team, we want to **deploy "Hello World"** to testnet so we verify deployment works

#### Acceptance Criteria (Epic Level)

**User Prerequisites (Before Development Starts):**

- ✅ Supabase account created, DATABASE_URL obtained and shared with team
- ✅ Alchemy account created, SEPOLIA_RPC_URL obtained and shared with team
- ✅ Etherscan account created, ETHERSCAN_API_KEY obtained and shared with team
- ✅ Sepolia testnet ETH obtained from faucets (minimum 0.5 ETH in team wallet)
- ✅ WALLET_ENCRYPTION_KEY generated securely (via `openssl rand -hex 32`)
- ✅ All credentials stored securely (1Password, Bitwarden, or similar)
- ✅ `.env.local` file created with all required environment variables

**Development Environment Setup:**

- ✅ GitHub organization created (FoodTrace-2025)
- ✅ Repository initialized with Next.js 14.2.15 + TypeScript
- ✅ Hardhat configured for Solidity ^0.8.20
- ✅ Local Hardhat network configured for offline development
- ✅ Supabase connection working (via Prisma client)
- ✅ Prisma ORM configured and migrations ready
- ✅ ESLint + Prettier configured with project rules
- ✅ `.gitignore` comprehensive (secrets, node_modules, build artifacts)
- ✅ `.env.example` template created with all required keys (no actual values)
- ✅ `.nvmrc` file created specifying Node.js 18+ version
- ✅ Simple "Hello World" contract deployed to Sepolia testnet
- ✅ Contract verified on Etherscan (source code published)
- ✅ All 3 team members can run `npm run dev` successfully

#### Technical Approach

**Repository Structure:**

```
thesis/
├── .bmad-core/          # BMAD methodology configuration
├── .github/workflows/   # CI/CD (optional)
├── contracts/           # Solidity smart contracts
├── test/                # Smart contract tests
├── src/                 # Next.js application
│   ├── app/             # App router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities, Web3 hooks
│   └── styles/          # CSS/Tailwind
├── public/              # Static assets
├── docs/                # Documentation
├── hardhat.config.ts    # Hardhat configuration
├── prisma/              # Database schema
└── package.json         # Dependencies
```

**Key Configuration Files:**

- `hardhat.config.ts` - Sepolia network, Etherscan verification
- `tsconfig.json` - TypeScript strict mode
- `.eslintrc.js` - Linting rules (no raw SQL, no MetaMask prompts in business UIs)
- `next.config.js` - Webpack config for Wagmi
- `prisma/schema.prisma` - Database models
- `.env.local` - Environment variables (secrets, never commit to Git)
- `.env.example` - Template showing required variables (safe to commit)

**Required Environment Variables (.env.local):**

```bash
# Database (Supabase)
DATABASE_URL="postgresql://user:pass@db.supabase.co:6543/postgres?pgbouncer=true"

# Blockchain RPC (Alchemy Sepolia)
SEPOLIA_RPC_URL="https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY"

# Contract Verification (Etherscan)
ETHERSCAN_API_KEY="YOUR_ETHERSCAN_API_KEY"

# Wallet Encryption (Generated)
WALLET_ENCRYPTION_KEY="YOUR_64_CHAR_HEX_KEY"

# NextAuth.js (Auto-generated)
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000"
```

#### Dependencies

**Blocks:** All other epics (foundation must be complete first)

#### Team Assignment

**All Team Members Together (1 hour - User Prerequisites):**

- Create Supabase account at supabase.com
- Create Alchemy account at alchemy.com (Sepolia app)
- Create Etherscan account at etherscan.io (get API key)
- Obtain Sepolia testnet ETH from faucets (alchemy-faucet.io, sepoliafaucet.com)
- Generate WALLET_ENCRYPTION_KEY using `openssl rand -hex 32`
- Store all credentials in team password manager (1Password/Bitwarden)
- Create `.env.local` file with all environment variables
- Share credentials securely with all team members

**Sam (2-3 hours):**

- Setup Hardhat project structure
- Configure OpenZeppelin contracts dependency
- Configure local Hardhat network for offline development
- Deploy "Hello World" contract to Sepolia testnet
- Verify contract on Etherscan using ETHERSCAN_API_KEY
- Document wallet creation and deployment process

**TaiSheng (2-3 hours):**

- Setup Next.js project structure (Pages Router)
- Configure Prisma + Supabase connection
- Test database connection with `npx prisma studio`
- Create initial database schema file
- Setup API route scaffolding (/api/health)
- Configure NextAuth.js basics

**YiLing (1-2 hours):**

- Setup Chakra UI v2 with Next.js
- Create basic page templates (layout components)
- Configure responsive layout system
- Test styling on mobile/desktop

**All Together (1 hour - Final Verification):**

- Review setup checklist (all acceptance criteria)
- Ensure everyone can run `npm run dev` successfully
- Verify Hardhat compilation works (`npx hardhat compile`)
- Test Supabase connection on all machines
- Document common issues and solutions
- Commit initial setup to Git

#### Risks & Mitigations

| Risk                                     | Mitigation                                                    |
| ---------------------------------------- | ------------------------------------------------------------- |
| Team members use different Node versions | Use `.nvmrc` file (Node 18+)                                  |
| External service signups fail            | Complete user prerequisites together as team (pair session)   |
| Sepolia faucet ETH unavailable           | Try multiple faucets (Alchemy, Infura, QuickNode, Sepolia.dev) |
| WALLET_ENCRYPTION_KEY lost               | Store in team password manager with backup copy               |
| Alchemy/Infura RPC down                  | Configure fallback RPC providers + local Hardhat network      |
| Supabase connection fails                | Use connection pooling, test with `prisma studio`             |
| Hardhat compilation errors               | Pin Solidity version, use OpenZeppelin 5.0+                   |
| Git merge conflicts                      | Establish branching strategy early                            |
