# Architecture Documentation Index

**Version:** 1.0 (BMAD-Named Files)
**Last Updated:** 2025-11-20
**Structure:** Development-Focused (Named Files)

---

## 📖 About This Architecture

The FoodTrace architecture is organized into **14 focused, lean files** optimized for BMAD agent consumption during story creation and development. Each file is 6-12 KB and covers a single topic.

**Monolithic Source:** [../architecture.md](../architecture.md) - Complete 143 KB architecture document (human reference)

---

## 🔧 Core Architecture Files

**Loaded by Dev Agent for ALL Stories:**

- **[tech-stack.md](tech-stack.md)** (6.6 KB) - Technology choices, versions, frameworks
  - Next.js 14.2.15, Solidity ^0.8.20, Hardhat, Supabase, Prisma, Wagmi v2
- **[coding-standards.md](coding-standards.md)** (9.6 KB) - Coding conventions, linting rules, ADR decisions
  - ESLint config, TypeScript strict mode, Solidity style guide
- **[source-tree.md](source-tree.md)** (11 KB) - Folder structure, file organization
  - Monorepo layout, component organization, test location
- **[testing-strategy.md](testing-strategy.md)** (11 KB) - Test types, coverage targets, quality gates
  - Test Pyramid, >70% coverage, Hardhat testing, React Testing Library

---

## 🗄️ Backend Architecture Files

**Loaded by SM Agent for Backend/Full-Stack Stories:**

- **[data-models.md](data-models.md)** (9.4 KB) - Prisma models, entity definitions, ERD
  - Company, User, Product, TraceRecord, SensorReading models
- **[database-schema.md](database-schema.md)** (11 KB) - DB tables, indexes, constraints
  - PostgreSQL schema, composite indexes, Row Level Security
- **[backend-architecture.md](backend-architecture.md)** (11 KB) - API Routes, server-side logic
  - Next.js API Routes structure, authentication, blockchain integration
- **[rest-api-spec.md](rest-api-spec.md)** (8.9 KB) - REST endpoints, request/response formats
  - POST /api/products, GET /api/trace, authentication headers
- **[external-apis.md](external-apis.md)** (7.1 KB) - Third-party integrations
  - Supabase, Alchemy RPC, Etherscan, SendGrid email

---

## 🎨 Frontend Architecture Files

**Loaded by SM Agent for Frontend/Full-Stack Stories:**

- **[frontend-architecture.md](frontend-architecture.md)** (9.4 KB) - React structure, routing, state
  - Next.js Pages Router, Wagmi hooks, RainbowKit wallet UI
- **[components.md](components.md)** (11 KB) - UI components, Chakra UI patterns
  - Button, Input, Form, Timeline, QR Scanner components
- **[core-workflows.md](core-workflows.md)** (11 KB) - User flows, transaction workflows
  - Product registration, consumer query, IoT simulator workflows

---

## 🚀 Deployment & Operations Files

**Additional Architecture Documentation:**

- **[deployment-architecture.md](deployment-architecture.md)** (10 KB) - Render.com, CI/CD, environments
  - Deployment process, rollback procedures, environment variables
- **[security-performance.md](security-performance.md)** (12 KB) - Security + performance
  - Wallet encryption (AES-256-GCM), performance benchmarks, monitoring

---

## 📂 File Organization

```
docs/architecture/
├── tech-stack.md                      (6.6 KB) ← Dev always loads
├── coding-standards.md                (9.6 KB) ← Dev always loads
├── source-tree.md                    (11 KB)  ← Dev always loads
├── testing-strategy.md               (11 KB)
├── data-models.md                    (9.4 KB) ← Backend stories
├── database-schema.md                (11 KB)  ← Backend stories
├── backend-architecture.md           (11 KB)  ← Backend stories
├── rest-api-spec.md                  (8.9 KB) ← Backend stories
├── external-apis.md                  (7.1 KB) ← Backend stories
├── frontend-architecture.md          (9.4 KB) ← Frontend stories
├── components.md                     (11 KB)  ← Frontend stories
├── core-workflows.md                 (11 KB)  ← Frontend stories
├── deployment-architecture.md        (10 KB)
├── security-performance.md           (12 KB)
└── index.md                          (this file)
```

**Total:** 14 BMAD-named files (~138 KB) vs 1 monolithic file (143 KB)

**Token Efficiency:** SM agent loads 6-8 files (~60 KB) per story instead of entire 143 KB architecture

---

## 🔄 BMAD Workflow Integration

### Story Creation (SM Agent)
1. Loads ONE epic from `docs/prd/epic-{n}*.md`
2. Loads SELECTIVE architecture files based on story type:
   - **Backend story:** tech-stack, coding-standards, data-models, database-schema, backend-architecture, api-spec
   - **Frontend story:** tech-stack, coding-standards, frontend-architecture, components, core-workflows
   - **Full-stack story:** All of the above
3. Creates story file in `docs/stories/` with Dev Notes referencing these files

### Development (Dev Agent)
1. Loads 3 always-files: tech-stack.md, coding-standards.md, source-tree.md
2. Loads story file (contains all architecture details from SM)
3. **Does NOT** load epic or architecture files (info already in story)

---

## 📋 Quick Reference

| Story Type | Architecture Files Loaded by SM Agent |
|------------|--------------------------------------|
| **Backend/API** | tech-stack, coding-standards, testing-strategy, data-models, database-schema, backend-architecture, api-spec, external-apis |
| **Frontend/UI** | tech-stack, coding-standards, testing-strategy, frontend-architecture, components, core-workflows |
| **Full-Stack** | All of the above (8-10 files) |

**Dev Agent Always Loads (3 files):**
- tech-stack.md
- coding-standards.md
- source-tree.md

---

**Navigation:**
- [Complete Architecture (Monolithic)](../architecture.md) - 143 KB human reference
- [PRD (Monolithic)](../prd.md) - 50 KB product requirements
- [Epic Files](../prd/) - 13 epic files numbered 1-13
- [BMAD User Guide](../../.bmad-core/user-guide.md) - Methodology reference
