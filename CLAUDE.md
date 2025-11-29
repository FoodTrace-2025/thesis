---
doc-id: thesis-project-context
title: FoodTrace Thesis Project Context
purpose: AI agent entry point and navigation hub
auto-generated: false
last-updated: 2025-11-29
session: 39
---

# FoodTrace Thesis - Project Context

## 📚 Documentation Navigation

**For AI Agents:** This file is your entry point. Use the links below to navigate to detailed documentation.

### Core BMAD Documents (Completed & Sharded)

- **Product Requirements** → docs/prd.md (v1.3 - **SHARDED** into docs/prd/*.md - 13 epic files numbered 1-13)
- **Architecture Specification** → docs/architecture.md (v1.0 - **SHARDED** into docs/architecture/*.md - 14 BMAD-named files)

### Thesis Materials (Templates for Development Phase)

**IMPORTANT:** Chapter files are **TEMPLATES/SCAFFOLDING** created in advance. Actual thesis content will be written **DURING development** (Weeks 3-12) as features are implemented.

- **Chapter Templates** → docs/thesis/chapters/\*.md (8 chapters, reference structure only)
- **OAMK Requirements** → docs/thesis/requirements/\*.md (structure, writing standards)
  - These provide the outline/structure for the final thesis
  - Content will be filled incrementally during development
  - Updated alongside code implementation to reflect actual work

### Session History

- **Session Archive** → .claude/sessions/session-history.md (Sessions 29-38 archive, last 10 kept)

### Archived Documents (2025-11-13 - Planning Phase)

Planning documents created during Sessions 1-7 but never used for development. Archived because thesis went directly from planning to writing without executing BMAD development workflow.

- **Archive Index** → docs/archive/planning-phase/README.md (Full list of archived docs)
- Includes: brief.md, team-workload.md, action-plan.md, technical-constraints.md, change-management.md, development-guide.md, learning-resources.md, session notes

### BMAD Methodology Reference

- **BMAD User Guide** → .bmad-core/user-guide.md (Official methodology guide, Phase 1-3 workflow, SM→Dev→QA cycle)
- **Tech Stack** → See Tech Stack section below

---

## Project Overview

**Company:** Bachelor's Thesis (OAMK University of Applied Sciences)
**Project:** FoodTrace - Blockchain food supply chain traceability system (POC)
**Goal:** Transparent tracking Producer → Distributor → Retailer → Consumer using Ethereum + Next.js

**Key Innovation:** IoT sensor simulation + QR code tracking + wallet-free consumer query

---

## Current Session Status

- **Last Updated**: 2025-11-29 (Session 39)
- **Project Status**: Week 3 - Epic 1 ✅, Epic 2 ✅, Epic 3 Tier 1 ✅ (Stories 3.1-3.2)
- **Project Completion**: ~22% (see breakdown below)
  - Planning Phase: 100% (Brief, PRD, Architecture)
  - Implementation: 19% (2/13 epics + Epic 3 Tier 1 complete)
  - Thesis Writing: 0% (templates only, content written during development)
- **Active Stage**: Epic 4 (Component Library)
- **Next Priority**: Story 4.1 approval and implementation (YiLing)
- **Recent Changes**: Session 38 archived, Epic 4/5 workflow analyzed
- **Blockers**: None
- **Ready for**: Approve Story 4.1 draft → Dev implementation

### Current Session Achievements (Session 39 - 2025-11-29)

✅ **Session 38 Archived**: Story 3.3 deferral and Epic 3 Tier 1 completion documented
✅ **Workflow Analysis**: Evaluated Epic 4/5 parallel work strategy - Sam can start Epic 5 contracts while YiLing does Epic 4
✅ **Story Pipeline Reviewed**: Story 4.1 exists in Draft status, ready for approval

### Development Approach

**Thesis Writing Strategy:**

- **NOW (Week 0-2)**: Create chapter templates/structure for reference
- **DURING (Weeks 3-12)**: Write actual content as features are implemented
  - Week 3-4: Smart contracts → Write Section 2.3 + Update Chapter 4 (Smart Contracts)
  - Week 5-7: Backend/Frontend/IoT → Write Section 2.4 + Update Chapter 5 (System Implementation)
  - Week 8-9: Testing → Update Chapter 6 (Results & Testing)
  - Week 10-12: Final writing → Complete all chapters with real data
- **RESULT**: Thesis reflects actual work done, not hypothetical plans

---

## Tech Stack

**Frontend:** Next.js 14.2.15 (React 18, Pages Router) + TypeScript 5.8+ + Chakra UI v2
**Smart Contracts:** Solidity ^0.8.20 + Hardhat + OpenZeppelin + Chai/Mocha (>70% coverage)
**Backend:** Next.js Monolith (API Routes) + Node.js 18.x LTS + Supabase (PostgreSQL + pgBouncer) + Prisma ORM
**Hosting:** Render (Node.js Server) + Sepolia Testnet (Ethereum)
**Web3:** Wagmi v2 + Viem + RainbowKit
**QR Codes:** react-qr-code + html5-qrcode

---

## Timeline Overview (12 Weeks)

| Week      | Dates           | Phase            | Deliverables                              |
| --------- | --------------- | ---------------- | ----------------------------------------- |
| **0**     | Oct 24-30       | Pre-Kickoff      | Documentation ready ✅                    |
| **1**     | Oct 31 - Nov 7  | Setup & Learning | Environments, Solidity basics, GitHub org |
| **2**     | Nov 8-14        | Planning         | **PRD + Architecture (CRITICAL)**         |
| **3-4**   | Nov 15-28       | Smart Contracts  | Core contracts, tests, Sepolia deployment |
| **5-7**   | Nov 29 - Dec 19 | Frontend         | 4-role UIs, Web3 integration              |
| **8**     | Dec 20-26       | Testing          | E2E tests, bug fixes, deployment          |
| **9**     | Dec 27 - Jan 2  | Polish           | Demo video, documentation                 |
| **10-12** | Jan 3-23, 2026  | Thesis Writing   | 60+ pages, poster, submission             |

**Key Milestones:** Week 2 (PRD+Arch), Week 4 (Contracts deployed), Week 9 (Complete POC), Week 12 (Thesis submission)

---

## Key Technical Decisions

1. **4-Role Supply Chain** (vs 5) - Producer → Distributor → Retailer → Consumer (no Processor)

   - Simplifies POC by 20-25%, still demonstrates complete traceability

2. **Next.js Monolith** (vs separate backend) - Frontend + Backend in single project

   - Simpler deployment, no CORS issues, saves hosting costs

3. **IoT Simulator** (vs real hardware) - Software simulation (Normal/Warning/Critical)

   - Academic validity, saves €150-200, faster testing, reliable demos

4. **Supabase** (vs vanilla PostgreSQL) - Built-in pgBouncer connection pooling

   - Critical for database connections (prevents connection exhaustion)

5. **Ethereum Sepolia** (vs Hyperledger Fabric) - Public testnet, €0 cost

   - Better for learning, transparency focus, academic 50/50 split validates choice
   - Thesis Chapter 3.3: Compare both, recommend Hyperledger for production B2B

6. **Hardhat** (vs Foundry) - JavaScript-based framework
   - Matches team skills, Cyfrin Updraft uses Hardhat, better beginner docs

---

## Development Workflow (Session 29)

**Full details:** `docs/workflow-decisions.md`

**Summary:**
1. SM creates small stories (2-4 hour scope) from epics
2. Human approves → Dev implements with tests alongside → Human verifies
3. QA review for contracts/security stories only (~40% of stories)
4. Git commit after each completed story
5. Smart contracts: Write tests alongside code (not strict TDD)

**Key decisions:**
- Stories sized XS/S only (split if >4 hours)
- No strict TDD - tests written alongside implementation
- QA focus: Security, smart contracts, complex integrations (~40%)

---

## Quick Reference - Active File Paths

**IMPORTANT:** Use Read tool with these exact paths during sessions.

```
# Navigation & Context
/home/kala/Documents/GitHub/thesis/CLAUDE.md                         (✅ THIS FILE)
/home/kala/Documents/GitHub/thesis/README.md                         (✅ Project overview)

# Active Planning Documents (SHARDED)
/home/kala/Documents/GitHub/thesis/docs/prd.md                       (✅ Monolithic PRD - reference)
/home/kala/Documents/GitHub/thesis/docs/prd/                        (✅ 13 epic files (epic-1.md through epic-13.md) - SM agent reads)
/home/kala/Documents/GitHub/thesis/docs/architecture.md              (✅ Monolithic Architecture - reference)
/home/kala/Documents/GitHub/thesis/docs/architecture/                (✅ 14 BMAD-named files - SM/Dev agents read)
/home/kala/Documents/GitHub/thesis/docs/architecture/index.md        (✅ Architecture file index & BMAD workflow guide)
/home/kala/Documents/GitHub/thesis/docs/workflow-decisions.md        (✅ Development workflow, testing approach, QA guidelines - Session 29)

# Thesis Requirements (OAMK Standards)
/home/kala/Documents/GitHub/thesis/docs/thesis/requirements/oamk-structure.md (✅ OAMK thesis structure)
/home/kala/Documents/GitHub/thesis/docs/thesis/requirements/writing-standards-grade5.md (✅ Grade 5 writing standards)

# Thesis Chapter Templates (Reference Structure - Content written during development)
/home/kala/Documents/GitHub/thesis/docs/thesis/chapters/chapter-1-introduction.md
/home/kala/Documents/GitHub/thesis/docs/thesis/chapters/chapter-2-literature-review.md
/home/kala/Documents/GitHub/thesis/docs/thesis/chapters/chapter-3-methodology.md
/home/kala/Documents/GitHub/thesis/docs/thesis/chapters/chapter-4-implementation.md
/home/kala/Documents/GitHub/thesis/docs/thesis/chapters/chapter-5-testing-evaluation.md
/home/kala/Documents/GitHub/thesis/docs/thesis/chapters/chapter-6-discussion.md
/home/kala/Documents/GitHub/thesis/docs/thesis/chapters/chapter-7-conclusion.md

# Session Archive
/home/kala/Documents/GitHub/thesis/.claude/sessions/session-history.md (✅ Sessions 29-38, last 10 kept)

# Archived Planning (2025-11-13)
/home/kala/Documents/GitHub/thesis/docs/archive/planning-phase/README.md (📦 Index of archived docs)
```

---

## Research Resources & Academic Databases

**For AI Agents:** Use these verified sources when adding citations to thesis chapters. ALL citations must be verified via WebSearch before adding.

### Academic Databases (Peer-Reviewed Papers)

**Primary Sources (Tier 1 - Use First):**

- **IEEE Xplore** → https://ieeexplore.ieee.org - Computer science, blockchain, IoT, software engineering
- **ACM Digital Library** → https://dl.acm.org - Computing research, HCI (CHI conferences), software systems
- **Springer** → https://link.springer.com - Business & Information Systems Engineering, supply chain management
- **Nature** → https://www.nature.com - Scientific Reports, interdisciplinary research
- **ScienceDirect (Elsevier)** → https://www.sciencedirect.com - Computers in Industry, Food Control, Telematics

**Secondary Sources (Tier 2 - Use When Appropriate):**

- **MDPI** → https://www.mdpi.com - Open access journals (Applied Sciences, Foods, Sensors, Future Internet)
- **Wiley Online Library** → https://onlinelibrary.wiley.com - Food Science and Food Safety
- **Taylor & Francis** → https://www.tandfonline.com - Production Research, Supply Chain Management
- **Frontiers** → https://www.frontiersin.org - Blockchain, Sustainable Food Systems
- **arXiv** → https://arxiv.org - Preprints for cutting-edge blockchain research

### Official Technical Documentation

**Blockchain & Web3:**

- **Ethereum.org** → https://ethereum.org/en/developers/docs - Official Ethereum documentation
- **Hardhat** → https://hardhat.org/docs - Ethereum development environment
- **OpenZeppelin** → https://docs.openzeppelin.com/contracts - Secure smart contract library
- **Wagmi** → https://wagmi.sh - React hooks for Ethereum
- **Viem** → https://viem.sh - TypeScript interface for Ethereum
- **Solidity** → https://docs.soliditylang.org - Smart contract programming language

**Frontend & Backend:**

- **Next.js** → https://nextjs.org/docs - React framework documentation
- **Chakra UI** → https://chakra-ui.com/docs - Accessible component library
- **Prisma** → https://www.prisma.io/docs - Type-safe database ORM

### Citation Quality Standards (From Session 13)

**Mandatory Verification Process:**

1. **Search First**: Use WebSearch to find papers on academic databases
2. **Verify DOI**: Confirm DOI resolves correctly (https://doi.org/...)
3. **Check Venue**: Ensure Tier 1/2 academic venue (IEEE, ACM, Springer, Nature, etc.)
4. **Validate Details**: Confirm authors, title, year, publication venue
5. **Assess Relevance**: Verify paper directly supports the specific thesis claim

**Citation Requirements:**

- ✅ **DO**: Use peer-reviewed papers with DOIs from IEEE, ACM, Springer, Nature, ScienceDirect
- ✅ **DO**: Use official technical documentation for frameworks/libraries
- ✅ **DO**: Verify EVERY citation via WebSearch before adding
- ❌ **DON'T**: Use industry reports without peer review (e.g., Consensys, Kaspersky)
- ❌ **DON'T**: Make up specific statistics without verified sources
- ❌ **DON'T**: Use vague citations like "research suggests" or "studies show"

**Acceptable Industry Sources (Limited Use):**

- Gartner (supply chain market trends - widely cited in academia)
- Nielsen Norman Group (UX standards - authoritative in HCI research)
- IBM Food Trust, Walmart case studies (documented industry implementations)

### Quick Search Patterns

**Finding Papers:**

```
# IEEE Xplore
"blockchain food traceability" + year:2024
"smart contract security patterns" + year:2023

# ACM Digital Library
"cryptocurrency wallet usability" CHI
"blockchain software engineering"

# Google Scholar (fallback)
"systematic review blockchain supply chain" filetype:pdf
```

**Verification Check:**

- Paper found on academic database? ✅
- DOI resolves correctly? ✅
- Published 2019-2024? ✅ (prefer recent)
- Tier 1/2 venue? ✅
- Directly relevant to claim? ✅

---

## Quick Development Commands

```bash
# Most Common (Week 1+)
npm install                   # Install dependencies
npm run dev                   # Start Next.js dev server
npm run build                 # Build for production
npm run test                  # Run smart contract tests

# Smart Contracts (Week 3+)
npx hardhat compile           # Compile Solidity
npx hardhat test              # Run contract tests
npx hardhat run scripts/deploy.ts --network sepolia  # Deploy to testnet

# Database (Week 5+)
npx prisma generate           # Generate Prisma client
npx prisma db push            # Push schema to Supabase
npx prisma studio             # Open database GUI
```

---

## Important Reminders

### For AI Assistant (Claude Code)

1. **DO NOT implement** unless explicitly requested
2. **ASK questions** if unclear, list one by one at end of responses
3. **Use tools:** context7, web search, MCP for research
4. **Follow BMAD:** SM → Dev → QA cycle (see .bmad-core/user-guide.md)
5. **One story at a time:** Never work on multiple stories simultaneously
6. **Chapter templates:** When updating chapters, remember they're scaffolding - content reflects actual work done

### For Development

1. **Test coverage:** Target >70%, reduce scope if falling behind
2. **Git commits:** Commit often, follow conventional commits (feat:, fix:, docs:)
3. **Thesis updates:** Update relevant chapter templates as features are implemented

### For Team Coordination

- **Discord:** https://discord.com/channels/1409818451580817511/1409818452193181719
- **Meetings:** Weekends (TBD after kickoff)
- **Hours:** Sam 30-40/week, TaiSheng/YiLing 30-40/week
- **Total:** ~400 hours per person over 12 weeks

---

## Auto-Update Instructions (For `/recap` command)

**Full specification:** `~/.claude/commands/recap.md` (authoritative source)

When updating this file after each session:

1. Update "Last Updated" date in YAML frontmatter and Current Session Status
2. Update "Current Session Achievements" → Add new session summary (5-6 bullet points max)
3. Move previous session to .claude/sessions/session-history.md (compress to 20-30 lines)
4. **Keep only last 10 sessions** in session-history.md (delete older sessions)
5. Update "Active Stage" and "Next Priority"
6. Do NOT modify Project Overview, Tech Stack, Timeline, Key Decisions sections
7. Keep this file under 200 lines (high-level only, details in supporting docs)
8. NO `@` symbols in file references (use plain paths only)

---

**Last Session:** Nov 29, 2025 (Session 39) - Epic 4/5 workflow analysis, ready for Story 4.1
**Next Priority:** Approve Story 4.1 → Dev implementation (YiLing)
**Status:** Implementation 19% complete (2/13 epics + Epic 3 Tier 1), 11 epics remaining
**Session History:** See .claude/sessions/session-history.md for Sessions 29-38 (last 10 kept)

_This CLAUDE.md file is the AI assistant's primary context document. Update after each significant milestone._
