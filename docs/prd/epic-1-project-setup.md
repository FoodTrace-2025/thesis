### Epic 1: Project Setup & Foundation

**Priority:** 🔴 Must Have
**Estimated Time:** 4-6 hours
**Assigned:** All team members
**Timeline:** Week 1-2
**Dependencies:** None (foundation epic)

#### Epic Description

Establish development environment, tooling, and foundational infrastructure for the FoodTrace project. This includes repository setup, development tools configuration, blockchain tooling, database initialization, and deployment scaffolding.

#### Business Value

- **Foundation for Development:** Without proper setup, Week 3+ development will be blocked
- **Team Onboarding:** Ensures all 3 members can contribute from Day 1
- **Quality Gates:** CI/CD, linting, testing infrastructure prevents bugs
- **Documentation:** README, contribution guidelines establish standards

#### User Stories (High-Level)

- As a developer, I want to **clone the repository and run `npm install`** so I can start development
- As a developer, I want to **compile and test smart contracts locally** so I can develop offline
- As a developer, I want to **run the Next.js dev server** so I can see changes live
- As a developer, I want to **connect to Supabase** so I can test database operations
- As a team, we want to **deploy "Hello World"** to testnet so we verify deployment works

#### Acceptance Criteria (Epic Level)

- ✅ GitHub organization created (FoodTrace-2025)
- ✅ Repository initialized with Next.js 14.2.15 + TypeScript
- ✅ Hardhat configured for Solidity ^0.8.20
- ✅ Supabase project created, connection working
- ✅ Prisma ORM configured
- ✅ ESLint + Prettier configured
- ✅ `.gitignore` comprehensive (secrets, build artifacts)
- ✅ `.env.example` template created
- ✅ Simple "Hello World" contract deployed to Sepolia
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

#### Dependencies

**Blocks:** All other epics (foundation must be complete first)

#### Team Assignment

**Sam (2 hours):**

- Setup Hardhat project
- Configure OpenZeppelin contracts
- Deploy "Hello World" to Sepolia
- Document wallet creation process

**TaiSheng (2 hours):**

- Setup Next.js project structure
- Configure Prisma + Supabase
- Create initial database schema
- Setup API route scaffolding

**YiLing (1 hour):**

- Setup Chakra UI
- Create basic page templates
- Configure responsive layout system

**All Together (1 hour):**

- Review setup checklist
- Ensure everyone can run project locally
- Document common issues

#### Risks & Mitigations

| Risk                                     | Mitigation                                        |
| ---------------------------------------- | ------------------------------------------------- |
| Team members use different Node versions | Use `.nvmrc` file (Node 18+)                      |
| Supabase connection fails                | Use connection pooling, test with `prisma studio` |
| Hardhat compilation errors               | Pin Solidity version, use OpenZeppelin 5.0+       |
| Git merge conflicts                      | Establish branching strategy early                |
