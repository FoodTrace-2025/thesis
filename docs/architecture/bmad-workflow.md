# BMAD Workflow - FoodTrace Thesis Project

**Last Updated:** 2025-10-24
**Purpose:** Complete BMAD (Breakthrough Method of Agile AI-driven Development) workflow guide

This document provides comprehensive instructions for following the BMAD methodology throughout the FoodTrace thesis project development.

---

## 📖 What is BMAD?

**BMAD** = Breakthrough Method of Agile AI-driven Development

A structured methodology for building software using AI agents that specializes in:

- Document-driven development (brief → PRD → architecture → stories)
- Specialized AI agents for different roles (PM, Architect, SM, Dev, QA)
- Iterative story-by-story development
- Quality-first approach with built-in QA gates

**Project Type:** Greenfield Full-Stack Application (Blockchain + Web)

---

## 🎯 BMAD Phases Overview

```
Phase 1: Planning (Weeks 1-2)
├── Analyst creates brief.md ✅ (Done Session 1)
├── PM creates prd.md (Week 2)
├── Architect creates architecture.md (Week 2)
└── PO validates alignment

Phase 2: Sharding (Week 2)
├── PO shards prd.md → docs/prd/epic-*.md
└── PO shards architecture.md → docs/architecture/*.md

Phase 3: Development (Weeks 3-10)
└── Loop: SM → Dev → QA (one story at a time)
    ├── SM creates story from epic
    ├── Dev implements + tests
    └── QA reviews + refactors
```

---

## 🔵 Phase 1: Planning (Weeks 1-2)

### 1.1 Analyst Agent (✅ Complete)

**Location:** Web UI (Claude.ai)
**Command:** `/analyst`
**Output:** `docs/brief.md`

**What it creates:**

- Problem statement
- Solution overview
- 4-role supply chain architecture
- Feature requirements
- Tech stack decisions
- Team workload breakdown

**Status:** ✅ Completed in Session 1 (2025-10-17)

- Created brief.md (1,522 lines)
- Updated to v1.1 in Session 2 (12-week timeline correction)

---

### 1.2 PM Agent (⏳ Week 2 - To Be Done)

**Location:** Web UI (Claude.ai) - cost-effective for large documents
**Command:** `/pm create-doc prd`
**Input:** Reads `docs/brief.md` automatically
**Output:** `docs/prd.md` (Product Requirements Document)

**What it creates:**

- Product vision and goals
- **Epics** - Major feature groups (Epic 1-9)
- **User stories** - Detailed requirements per epic
- Acceptance criteria
- Priority rankings
- Success metrics

**Why Web UI?**

- PRD typically 2,000-5,000 lines
- Web UI handles large document generation better
- More cost-effective than IDE for creation
- Can iterate on whole document easily

**How to run:**

```
1. Open Claude.ai (Web UI)
2. Type: /pm create-doc prd
3. AI reads docs/brief.md automatically
4. AI generates complete PRD
5. Review and refine with PM agent
6. Copy final prd.md to local docs/ folder
```

**Expected PRD Structure:**

```markdown
# Product Requirements Document

## 1. Product Vision

## 2. Target Users (4 roles)

## 3. Epic 1: Product Registration

- Story 1.1: Producer registers product
- Story 1.2: Generate unique product ID
- Story 1.3: QR code generation

## 4. Epic 2: Supply Chain Tracking

- Story 2.1: Distributor adds trace record
- Story 2.2: Retailer adds trace record

## 5. Epic 3: IoT Simulator

...

## 9. Epic 9: Deployment
```

---

### 1.3 Architect Agent (⏳ Week 2 - To Be Done)

**Location:** Web UI (Claude.ai)
**Command:** `/architect create-doc architecture`
**Input:** Reads `docs/prd.md` (created by PM)
**Output:** `docs/architecture.md` (Technical Architecture Document)

**What it creates:**

- System architecture diagram
- **Tech stack details** (Next.js, Solidity, Supabase)
- **Coding standards** (TypeScript, ESLint, Prettier)
- **Source tree** - Folder structure
- Database schema
- API design
- Security considerations
- Deployment strategy

**How to run:**

```
1. Ensure prd.md exists in docs/
2. Open Claude.ai (Web UI)
3. Type: /architect create-doc architecture
4. AI reads docs/prd.md automatically
5. AI generates architecture.md
6. Review technical decisions
7. Copy final architecture.md to local docs/ folder
```

**Expected Architecture Structure:**

```markdown
# Technical Architecture Document

## 1. System Overview

## 2. Tech Stack

- Frontend: Next.js 15 + TypeScript
- Smart Contracts: Solidity ^0.8.20 + Hardhat
- Database: Supabase (PostgreSQL + Prisma)

## 3. Coding Standards

- TypeScript strict mode
- ESLint configuration
- Git commit conventions

## 4. Source Tree

- contracts/ - Solidity files
- src/ - Next.js app
- test/ - Contract tests

## 5. Database Schema (Prisma)

## 6. API Design (Next.js routes)

## 7. Security (OpenZeppelin, FERPA compliance)

## 8. Deployment (Vercel + Sepolia testnet)
```

---

### 1.4 PO Agent Validation (Week 2 - After PM & Architect)

**Location:** Web UI (Claude.ai)
**Command:** `/po` (run master checklist)
**Purpose:** Validate alignment between brief, PRD, and architecture

**What it checks:**

- PRD matches brief.md scope
- Architecture supports PRD requirements
- No contradictions between documents
- All features have technical implementation plan
- Tech stack choices justified

**Validation Score:** Target >90%

**If issues found:**

- PM agent refines PRD
- Architect agent adjusts architecture
- Re-run PO validation until >90%

---

## 🟢 Phase 2: Sharding (Week 2)

### 2.1 Why Sharding?

**Problem:** PRD and Architecture documents are 2,000-5,000 lines each
**Solution:** Break into smaller, focused files for development

**Benefits:**

- AI agents load only relevant context
- Developers work on one epic at a time
- Parallel development possible (different team members, different epics)
- Cleaner git history (epic-specific commits)

---

### 2.2 PO Shards PRD

**Location:** Claude Code (IDE) - file operations required
**Command:** `@po shard docs/prd.md`

**What it creates:**

```
docs/prd/
├── epic-1-product-registration.md
├── epic-2-supply-chain-tracking.md
├── epic-3-iot-simulator.md
├── epic-4-consumer-query.md
├── epic-5-multi-party-verification.md
├── epic-6-qr-functionality.md
├── epic-7-data-visualization.md
├── epic-8-multi-language.md
└── epic-9-deployment.md
```

Each epic file contains:

- Epic description
- User stories (Story 1.1, 1.2, 1.3...)
- Acceptance criteria
- Dependencies on other epics
- Estimated complexity

---

### 2.3 PO Shards Architecture

**Location:** Claude Code (IDE)
**Command:** `@po shard docs/architecture.md`

**What it creates:**

```
docs/architecture/
├── tech-stack.md           # Technology choices
├── coding-standards.md     # Code style, linting, formatting
├── source-tree.md          # Project folder structure
├── database-schema.md      # Prisma models
├── api-design.md           # Next.js API routes
└── deployment-strategy.md  # Vercel + Sepolia setup
```

Each architecture file contains:

- Specific technical decisions
- Implementation guidelines
- Code examples
- Configuration details

---

## 🟣 Phase 3: Development (Weeks 3-10)

### 3.1 SM → Dev → QA Cycle (Core Loop)

**CRITICAL RULE:** Work on ONE story at a time, sequentially

**Workflow:**

```
1. SM creates story
   ↓
2. Dev implements story
   ↓
3. QA reviews story
   ↓
4. If approved → Mark DONE, move to next story
   If issues → Dev fixes, back to QA review
```

---

### 3.2 Story Manager (SM) Agent

**Location:** Claude Code (IDE) - NEW CHAT
**Command:** `@sm *create`

**What it does:**

1. Reads sharded PRD epic (e.g., `docs/prd/epic-1-product-registration.md`)
2. Creates detailed implementation story in `docs/stories/`
3. Includes:
   - Feature description
   - Technical approach
   - File changes needed
   - Test requirements
   - Acceptance criteria

**Output:** `docs/stories/epic-1.story-1.1-product-registration.md`

**Story Status:** Draft → Approved (SM marks as Approved when ready)

**Example Story Structure:**

```markdown
# Story 1.1: Producer Product Registration

**Epic:** 1 (Product Registration)
**Status:** Draft → Approved
**Assigned:** Sam (Blockchain Lead)
**Estimated:** 4 hours

## Feature Description

Producer registers new product on blockchain with metadata.

## Technical Approach

- Smart contract: `ProductRegistry.sol`
- Function: `registerProduct(string name, string origin, uint256 harvestDate)`
- Access control: Only Producer role
- Event: `ProductRegistered(uint256 productId, address producer)`

## Files to Create/Modify

- contracts/ProductRegistry.sol (create)
- test/ProductRegistry.test.ts (create)

## Test Requirements

- ✅ Producer can register product
- ✅ Non-producer cannot register (access control)
- ✅ Product ID increments correctly
- ✅ Event emitted with correct data

## Acceptance Criteria

- [ ] Smart contract deployed to local Hardhat network
- [ ] All tests passing (>70% coverage)
- [ ] Function documented with NatSpec comments
```

---

### 3.3 Developer (Dev) Agent

**Location:** Claude Code (IDE) - NEW CHAT (important!)
**Command:** `@dev`

**What it does:**

1. Reads approved story (e.g., `docs/stories/epic-1.story-1.1-product-registration.md`)
2. Implements the feature:
   - Creates/modifies code files
   - Writes unit tests
   - Writes integration tests
   - Adds documentation
3. Updates story status: Approved → InProgress → Review

**Example Dev Session:**

```
USER: @dev
AI: I'll implement Story 1.1: Producer Product Registration.

[AI creates contracts/ProductRegistry.sol]
[AI creates test/ProductRegistry.test.ts]
[AI runs npx hardhat test]

✅ All tests passing (8/8)
✅ Coverage: 85% (exceeds 70% target)
✅ Story status: Review (ready for QA)
```

**Dev Responsibilities:**

- Write production-quality code
- Follow coding standards (docs/architecture/coding-standards.md)
- Achieve >70% test coverage
- Document public functions
- No shortcuts (quality over speed)

---

### 3.4 QA Agent

**Location:** Claude Code (IDE) - NEW CHAT (important!)
**Command:** `@qa *review {story}`

**What it does:**

1. Reads story in Review status
2. Reviews code for:
   - **Code quality** (clean, readable, maintainable)
   - **Test coverage** (>70%)
   - **Security** (no vulnerabilities)
   - **Performance** (gas optimization for contracts)
   - **Standards compliance** (follows coding-standards.md)
3. Creates QA gate: `docs/qa/gates/epic-1.story-1.1-product-registration.yml`
4. Updates story status:
   - If approved: Review → Done ✅
   - If issues: Review → InProgress (Dev fixes, then back to QA)

**Example QA Session:**

```
USER: @qa *review epic-1.story-1.1
AI: Reviewing Story 1.1: Producer Product Registration...

✅ Code Quality: Clean, well-structured
✅ Test Coverage: 85% (exceeds 70% target)
✅ Security: AccessControl properly implemented
✅ Gas Optimization: 65k gas (under 100k target)
⚠️  Issue: Missing NatSpec on internal function
❌ Blocker: Event not tested in unit tests

[AI creates docs/qa/gates/epic-1.story-1.1-product-registration.yml]
Status: InProgress (2 issues to fix)
```

**QA Gate Structure:**

```yaml
story: epic-1.story-1.1-product-registration
status: InProgress
blockers:
  - Event not tested in unit tests
warnings:
  - Missing NatSpec on internal function
passed_checks:
  - code_quality
  - test_coverage
  - security
  - gas_optimization
next_action: Dev fixes blockers, resubmit for QA review
```

---

### 3.5 Important Workflow Rules

**🔴 ALWAYS use NEW CLEAN CHAT when switching agents:**

- SM creates story → NEW CHAT
- Dev implements → NEW CHAT (don't continue SM chat!)
- QA reviews → NEW CHAT (don't continue Dev chat!)

**Why?**

- Prevents context contamination
- Each agent focuses on its role
- Cleaner session history
- Better AI performance

**🔴 ONE story at a time:**

- Never work on Story 1.2 while Story 1.1 is in progress
- Complete SM → Dev → QA cycle before moving to next story
- Exception: Different team members can work on different epics in parallel

**🔴 Story status must be tracked:**

- Draft (SM created, not ready)
- Approved (SM approved, ready for Dev)
- InProgress (Dev implementing)
- Review (Dev done, awaiting QA)
- Done (QA approved, complete) ✅

---

## 📊 BMAD Workflow Tracking

### Epic Progress Example

| Epic                          | Stories   | Status                    | Assigned | Week |
| ----------------------------- | --------- | ------------------------- | -------- | ---- |
| Epic 1: Product Registration  | 5 stories | 🟢 In Progress (3/5 done) | Sam      | 3-4  |
| Epic 2: Supply Chain Tracking | 4 stories | ⏳ Pending                | TaiSheng | 4-5  |
| Epic 3: IoT Simulator         | 3 stories | ⏳ Pending                | Sam      | 5    |

### Story Progress Example

| Story                     | Status     | Owner | Started    | Completed  | Duration              |
| ------------------------- | ---------- | ----- | ---------- | ---------- | --------------------- |
| 1.1: Product Registration | ✅ Done    | Sam   | Week 3 Mon | Week 3 Tue | 6 hours               |
| 1.2: Unique Product ID    | ✅ Done    | Sam   | Week 3 Wed | Week 3 Thu | 4 hours               |
| 1.3: QR Code Generation   | 🟡 Review  | Sam   | Week 3 Fri | -          | 5 hours (in progress) |
| 1.4: Metadata Upload      | ⏳ Pending | Sam   | -          | -          | -                     |

---

## 🎯 BMAD Best Practices

### For Project Success

1. **Don't skip planning phase** - Solid brief/PRD/architecture = easier development
2. **Trust the process** - SM → Dev → QA cycle prevents bugs from accumulating
3. **Use specialized agents** - Don't ask Dev agent to do QA, each has specific role
4. **Keep stories small** - Target 4-8 hours per story max
5. **Test-first mindset** - Dev writes tests before marking story "Review"
6. **Document decisions** - Update session notes when making architecture changes

### Common Mistakes to Avoid

❌ **Skipping PO validation** - Leads to misaligned PRD/Architecture
❌ **Working on multiple stories simultaneously** - Causes context confusion
❌ **Using same chat for SM → Dev → QA** - Pollutes agent context
❌ **Marking story "Done" without QA review** - Bypasses quality gate
❌ **Creating PRD in IDE instead of Web UI** - Slower, more expensive
❌ **Sharding before PRD/Architecture complete** - Incomplete shards

---

## 📁 BMAD File Structure (Final State)

```
thesis/
├── .bmad-core/              # BMAD agent definitions (pre-configured)
├── docs/
│   ├── brief.md             # ✅ Analyst output (Session 1)
│   ├── prd.md               # ⏳ PM output (Week 2)
│   ├── architecture.md      # ⏳ Architect output (Week 2)
│   ├── prd/                 # PO sharded epics
│   │   ├── epic-1-product-registration.md
│   │   ├── epic-2-supply-chain-tracking.md
│   │   └── ...
│   ├── architecture/        # PO sharded architecture
│   │   ├── tech-stack.md
│   │   ├── coding-standards.md
│   │   └── ...
│   ├── stories/             # SM created stories
│   │   ├── epic-1.story-1.1-product-registration.md
│   │   ├── epic-1.story-1.2-unique-id.md
│   │   └── ...
│   └── qa/                  # QA gates and assessments
│       ├── gates/
│       │   └── epic-1.story-1.1-product-registration.yml
│       └── assessments/
│           └── epic-1.story-1.1-risk-20251115.md
├── contracts/               # Solidity smart contracts (Dev output)
├── src/                     # Next.js app (Dev output)
├── test/                    # Tests (Dev output)
└── README.md
```

---

## 🔗 Related Documentation

- **BMAD User Guide:** `.bmad-core/user-guide.md` (detailed methodology reference)
- **Development Guide:** `@docs/development-guide.md` (commands, troubleshooting)
- **Learning Resources:** `@docs/learning-resources.md` (tutorials, docs)
- **Coding Standards:** `@docs/architecture/coding-standards.md` (after Architect creates it)

---

**Document Maintained By:** Sam Chou
**Last Review:** 2025-10-24
**Next Review:** After PRD/Architecture creation (Week 2)

---

**BMAD Methodology Credits:** Breakthrough Method of Agile AI-driven Development
**Discord Community:** https://discord.gg/gk8jAdXWmj
