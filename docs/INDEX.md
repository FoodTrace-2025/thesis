# FoodTrace - Blockchain Food Traceability System
## Documentation Index

**Last Updated:** 2025-10-24
**Project Type:** Bachelor's Thesis (OAMK)
**Team:** Sam Chou (FuzzyKala), TaiSheng Chen, YiLing Chen
**Duration:** 12 weeks (Oct 31, 2025 - Jan 23, 2026)
**Methodology:** BMAD (Breakthrough Method of Agile AI-driven Development)

---

## 📋 Quick Navigation

| Category | Status | Description |
|----------|--------|-------------|
| [Core Documents](#core-documents) | 🟢 Active | BMAD workflow documents (PRD, Architecture, etc.) |
| [Planning Artifacts](#planning-artifacts) | 🟡 Reference | Initial planning and analysis documents |
| [Development Artifacts](#development-artifacts) | 🔵 Future | Generated during development (stories, QA) |
| [Thesis Writing](#thesis-writing) | 🟣 Academic | Thesis chapters and academic deliverables |
| [Meeting Notes](#meeting-notes) | 📝 Archive | Team meetings and decision logs |

---

## 🎯 Core Documents (BMAD Workflow)

These are the **primary documents** that drive development. They follow BMAD methodology standards and are actively used by AI agents during the workflow.

### Planning Phase Documents

| Document | Status | Agent | Description | Path |
|----------|--------|-------|-------------|------|
| **Project Brief** | ✅ Complete | Analyst | Foundation document, project concept, goals, scope | [brief.md](./brief.md) |
| **PRD** | 🔜 To Create | PM | Product Requirements Document with features, epics, stories | `prd.md` |
| **Architecture** | 🔜 To Create | Architect | System architecture, tech stack, design decisions | `architecture.md` |
| **Frontend Spec** | ⚪ Optional | UX Expert | UI/UX specifications (if needed) | `front-end-spec.md` |

### Sharded Documents (Created After PRD/Architecture)

| Folder | Created By | Purpose | Status |
|--------|------------|---------|--------|
| `prd/` | PO Agent | Sharded PRD epics for development | 🔜 After PRD |
| `architecture/` | PO Agent | Sharded architecture sections (tech-stack, coding-standards, source-tree) | 🔜 After Architecture |

### Development Documents (Generated During Implementation)

| Folder | Created By | Purpose | Status |
|--------|------------|---------|--------|
| `stories/` | SM Agent | User stories (epic-X.story-Y.md format) | 🔜 Development Phase |
| `qa/` | QA Agent | QA assessments, gates, test results | 🔜 Development Phase |

---

## 📦 Planning Artifacts (Reference Only)

These documents were created during the **initial brainstorming and planning phase**. They are NOT part of the active BMAD workflow but serve as valuable reference material.

### Planning Documents

| Document | Created | Purpose | Path |
|----------|---------|---------|------|
| **Team Workload Analysis** | 2025-10-17 | Role breakdown, hour estimates, week-by-week tasks | [planning/team-workload.md](./planning/team-workload.md) |
| **Change Log** | 2025-10-17 | Summary of changes from 5-role to 4-role system | [planning/change-log.md](./planning/change-log.md) |

### Session Notes (Meeting Records)

| Date | Topic | Path |
|------|-------|------|
| 2025-10-17 | Architecture decisions (Next.js monolith, IoT simulator, Supabase) | [planning/session-notes/2025-10-17-architecture-decisions.md](./planning/session-notes/2025-10-17-architecture-decisions.md) |
| 2025-10-31 | Kickoff meeting with thesis supervisor | 🔜 To be created |

---

## 🔧 Development Artifacts (Generated)

These folders and files are **created automatically** by BMAD agents during the development workflow.

### Story Structure

```
stories/
├── epic-1.story-1.1-product-registration.md
├── epic-1.story-1.2-qr-code-generation.md
├── epic-2.story-2.1-trace-record-addition.md
└── ...
```

### QA Structure

```
qa/
├── assessments/
│   ├── epic-1.story-1.1-risk-20250215.md
│   ├── epic-1.story-1.1-test-design-20250215.md
│   └── epic-1.story-1.1-trace-20250220.md
└── gates/
    └── epic-1.story-1.1-product-registration.yml
```

---

## 📚 Thesis Writing (Academic Deliverables)

### Thesis Template

**Location:** `/home/kala/Downloads/Thesis-template-110625-Word.docx`

**Required Chapters (OAMK Standard):**
1. Introduction
2. Literature Review (Blockchain, Food Supply Chain)
3. Methodology (BMAD workflow, Ethereum selection)
4. Implementation (Smart contracts, Frontend, Backend)
5. Results (Testing, Performance, Case Study)
6. Discussion (Challenges, Limitations, Lessons Learned)
7. Conclusion (Summary, Future Work)
8. References

**Target:** 60+ pages (20 pages per person minimum)

### Poster

**Template:** `/home/kala/Downloads/Maturity Poster Template (1).pptx`
**Deadline:** Week 12 (April 2025)
**Format:** Visual summary of thesis (problem → solution → results)

---

## 🔗 External References

### Academic Resources

- [Cyfrin Updraft - Solidity Course](https://updraft.cyfrin.io/) - Free Solidity learning (10-15 hours)
- [OAMK Ruokajälki Project](https://www.oamk.fi/en/partnership/rdi-projects/ruokajalki) - Context for food traceability
- [Walmart + IBM Food Trust Case Study](https://www.lfdecentralizedtrust.org/case-studies/walmart-case-study) - Industry example

### Technical Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Wagmi v2 Hooks](https://wagmi.sh/)
- [Supabase Documentation](https://supabase.com/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/)

### Research Papers (For Literature Review)

- **Springer 2025:** "Digital Transformation of Food Supply Chain Management Using Blockchain" - Systematic literature review
- **IEEE 2024:** "Hyperledger Fabric for Food Supply Chain Management"
- **ScienceDirect 2024:** "Optimization of agrifood supply chains using Hyperledger Fabric"

---

## 🚀 Getting Started (New Team Members)

### First Time Setup

1. **Read Core Documents** (In Order):
   - Start: [brief.md](./brief.md) - Understand project vision
   - Next: Wait for PRD.md (will be created by PM agent)
   - Then: Wait for architecture.md (will be created by Architect agent)

2. **Understand Planning Context**:
   - Review: [planning/team-workload.md](./planning/team-workload.md) - Your role and tasks
   - Review: [planning/session-notes/2025-10-17-architecture-decisions.md](./planning/session-notes/2025-10-17-architecture-decisions.md) - Why we chose Next.js monolith, IoT simulator, Supabase

3. **Development Environment Setup** (Week 1):
   - Install: Node.js 18+, VS Code, Git
   - Extensions: Solidity, Hardhat Solidity
   - Create: MetaMask wallet with Sepolia testnet
   - Get: Test ETH from Sepolia faucets

### Document Flow (BMAD Workflow)

```
Planning Phase (Weeks 1-2):
brief.md → prd.md → architecture.md

Transition to Development:
PO Agent shards documents → prd/ and architecture/ folders created

Development Cycle (Weeks 3-10):
SM creates story → Dev implements → QA reviews → Repeat
```

---

## 📊 Project Status Tracking

### Current Phase

**Phase:** 🟢 **Planning Phase** (Pre-Development)
**Next Milestone:** Kickoff Meeting (October 31, 2025)
**PRD Deadline:** Week 2 (November 8-14, 2025)

### Timeline Overview

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1 | Setup | Environment, wallets, learning Solidity |
| 2 | Planning | PRD, Architecture documents |
| 3-4 | Contracts | Smart contract development + testing |
| 5-7 | Frontend | UI implementation (Producer, Distributor, Retailer, Consumer) |
| 8 | Testing | Integration testing, bug fixes |
| 9 | Polish | Documentation, demo video |
| 10-12 | Thesis | Writing, poster, final presentation |

---

## 👥 Team Roles & Responsibilities

### Team Structure

| Person | Role | Primary Focus (70-85%) | Secondary Focus |
|--------|------|------------------------|-----------------|
| **Sam Chou (FuzzyKala)** | Blockchain Lead | Solidity, Smart Contracts, Gas Optimization | Architecture, Code Review |
| **TaiSheng Chen** | Backend/Integration Lead | Testing, Backend API, Web3 Integration | Smart Contract Review, DevOps |
| **YiLing Chen** | UI/UX Lead | Design, Frontend Components, Consumer UI | Basic Web3, QR Codes, Testing |

### Communication

- **Weekly Meetings:** Every Monday 14:00-15:00
- **Daily Updates:** Discord/Telegram (async)
- **Blockers:** Post immediately in group chat

---

## 🔄 Document Update Protocol

### Who Updates What

| Document | Updated By | Frequency | Trigger |
|----------|------------|-----------|---------|
| INDEX.md (this file) | Any team member | As needed | New documents created, milestones reached |
| brief.md | Analyst | Rarely | Major scope changes only |
| prd.md | PM | Weekly during planning | New features, priority changes |
| architecture.md | Architect | As needed | Technical decisions, stack changes |
| Session notes | Meeting organizer | After each meeting | Meeting conclusions |

### Version Control

- **Main Branch:** Production-ready code only
- **Develop Branch:** Active development
- **Feature Branches:** Individual stories

---

## 📝 Notes & Tips

### Using This Index

- **Bookmark this page** - It's your single source of truth
- **Update it frequently** - Keep paths and status current
- **Link from README** - Make it easy to find
- **Share with team** - Everyone should reference this

### BMAD Workflow Reminder

1. **Planning agents** (PM, Architect) create big documents in **Web UI** (cost-effective)
2. **Copy documents** to `docs/` folder in project
3. **PO agent shards** documents in **IDE** (creates many small files)
4. **Development cycle** (SM → Dev → QA) happens in **IDE** with sharded docs

### Emergency Contacts

- **Thesis Supervisor:** (Add contact info after kickoff meeting)
- **BMAD Discord:** [discord.gg/gk8jAdXWmj](https://discord.gg/gk8jAdXWmj)
- **Project Lead (Sam):** (Add contact info)

---

## 🆘 Troubleshooting

### "I can't find a document"

- Check this INDEX.md first
- Search in `docs/` folder
- Check `planning/` subfolder for older planning docs

### "Document naming doesn't match"

- We follow **BMAD standards** now (lowercase, kebab-case)
- Old format: `PROJECT_BRIEF.md` → New format: `brief.md`

### "Where should I put new documents?"

- **Core workflow docs** → `docs/` (root level)
- **Planning notes** → `docs/planning/`
- **Meeting notes** → `docs/planning/session-notes/`
- **Generated stories** → `docs/stories/` (auto-created by SM agent)
- **QA reports** → `docs/qa/` (auto-created by QA agent)

---

**Document Maintained By:** Sam Chou (Team)
**Last Review:** 2025-10-24
**Next Review:** After kickoff meeting (October 31, 2025)

---

_This index follows BMAD (Breakthrough Method of Agile AI-driven Development) methodology standards._
