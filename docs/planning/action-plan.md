# Action Plan - FoodTrace Thesis Project

**Last Updated:** 2025-10-30
**Purpose:** Immediate action items and next steps for Week 0-3
**Source:** Extracted from PRD Section 10

This document contains detailed action items for each team member during the kickoff and early development phases.

---

## 10.1 Immediate Actions (Week 0-1, Before Kickoff Oct 31)

### For Sam (Blockchain Lead)

**Before Kickoff Meeting:**
- ✅ Review this PRD thoroughly (read all 12 epics)
- ✅ Re-read brief.md to refresh on project vision
- ✅ Prepare questions for supervisor (see kickoff agenda in `docs/planning/session-notes/2025-10-31-kickoff-meeting-agenda.md`)
- ✅ Confirm GitHub organization created: "FoodTrace-2025" or similar
- ✅ Ensure MetaMask installed and 3 test wallets created

**Week 1 (Oct 31 - Nov 7):**
- [ ] **Day 1-2**: Start Cyfrin Updraft "Simple Storage" module (3 hours)
- [ ] **Day 3-4**: Complete Cyfrin Updraft "Fund Me" module (4 hours)
- [ ] **Day 5**: Read OpenZeppelin AccessControl documentation (2 hours)
- [ ] **Day 6**: Deploy "Hello World" contract to Sepolia testnet (2 hours)
- [ ] **Day 7**: Write kickoff meeting notes, update team on learnings (1 hour)

**Tools to Setup:**
- [ ] Install Hardhat: `npm install --save-dev hardhat`
- [ ] Install Hardhat plugins: `@nomicfoundation/hardhat-toolbox`
- [ ] Install OpenZeppelin: `@openzeppelin/contracts`
- [ ] Configure `hardhat.config.ts` (Sepolia network, Alchemy API key)
- [ ] Get Sepolia test ETH from faucets (0.5 ETH minimum per wallet)

---

### For TaiSheng (Backend/Integration Lead)

**Before Kickoff Meeting:**
- ✅ Review this PRD (focus on Epic 0.5, 0.6, 1.5, 4, 9)
- ✅ Review brief.md section on architecture decisions
- ✅ Understand custodial wallet model (re-read Epic 0.5 if unclear)

**Week 1 (Oct 31 - Nov 7):**
- [ ] **Day 1-2**: Read Wagmi v2 documentation (3 hours)
- [ ] **Day 3**: Create Supabase account and new project (2 hours)
- [ ] **Day 4**: Design Prisma schema (sketch all models: Company, User, Product, Trace, Sensor) (4 hours)
- [ ] **Day 5**: Read Hardhat testing documentation (3 hours)
- [ ] **Day 6**: Learn Solidity basics (Cyfrin Updraft "Simple Storage", 3 hours)
- [ ] **Day 7**: Test RainbowKit wallet connection (sample Next.js app, 2 hours)

**Tools to Setup:**
- [ ] Create Supabase project: https://supabase.com/dashboard
- [ ] Get Supabase connection strings (DATABASE_URL, DIRECT_URL)
- [ ] Install Prisma: `npm install prisma @prisma/client`
- [ ] Initialize Prisma: `npx prisma init`
- [ ] Install NextAuth.js: `npm install next-auth`
- [ ] Install Wagmi v2: `npm install wagmi viem`

---

### For YiLing (UI/UX Lead)

**Before Kickoff Meeting:**
- ✅ Review this PRD (focus on Epic 1, 1.5, 2, 4, 6, 7)
- ✅ Review brief.md section on user personas
- ✅ Understand 4-role supply chain flow

**Week 1 (Oct 31 - Nov 7):**
- [ ] **Day 1**: Read "Intro to Ethereum" (ethereum.org, 2 hours)
- [ ] **Day 2**: Research Web3 UX best practices (Medium articles, Figma community, 3 hours)
- [ ] **Day 3**: Analyze competitor UIs (IBM Food Trust, Walmart blockchain, 3 hours)
- [ ] **Day 4**: Create user flow diagrams (4 roles: Producer, Distributor, Retailer, Consumer, 4 hours)
- [ ] **Day 5**: Study Chakra UI v2 documentation (3 hours)
- [ ] **Day 6-7**: Start Figma wireframes (Producer dashboard first, 6 hours)

**Tools to Setup:**
- [ ] Install Figma desktop app (or use web version)
- [ ] Create Figma design file: "FoodTrace Wireframes"
- [ ] Setup Chakra UI v2: `npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion`
- [ ] Explore Chakra UI templates: https://chakra-templates.dev/
- [ ] Install QR libraries: `npm install react-qr-code html5-qrcode`

---

## 10.2 Week 2 Actions (Nov 8-14)

**Architecture Agent (Claude.ai Web UI):**
- [ ] Create `architecture.md` using `/architect create-doc architecture`
- [ ] Copy to local `docs/architecture.md`

**PO Agent (Claude Code IDE):**
- [ ] Run validation: `@po` (master checklist)
- [ ] Target: >90% alignment between brief.md, prd.md, architecture.md
- [ ] If <90%: Iterate with PM/Architect agents until passing

**All Team Members:**
- [ ] Review PRD and Architecture documents together (2 hour meeting)
- [ ] Approve both documents (sign-off)
- [ ] Plan Week 3-4 sprints (identify first 3 stories for SM agent)

**YiLing (Week 2 - Design Heavy Week):**
- [ ] Complete all Figma wireframes (12 hours)
- [ ] Create design system (colors, typography, components, 8 hours)
- [ ] High-fidelity mockups (4 hours)
- [ ] Present designs to team for feedback (2 hours)

---

## 10.3 Week 3+ Actions (BMAD Development Workflow)

**PO Agent Shards Documents:**
```bash
@po shard docs/prd.md
@po shard docs/architecture.md
```
Creates:
- `docs/prd/epic-*.md` (12 files, one per epic)
- `docs/architecture/*.md` (tech-stack, coding-standards, source-tree, etc.)

**SM Agent Creates Stories (One at a Time):**
```bash
NEW CHAT → @sm *create
```
Reads sharded epic, creates detailed story in `docs/stories/`

**Dev Agent Implements:**
```bash
NEW CHAT → @dev
```
Reads approved story, implements feature, writes tests

**QA Agent Reviews:**
```bash
NEW CHAT → @qa *review {story}
```
Reviews code quality, creates QA gate, approves or requests fixes

**🔴 CRITICAL RULE:** Always use NEW CLEAN CHAT when switching agents!

---

## 10.4 Supervisor Kickoff Meeting (Oct 31, 2025)

**Agenda:**

1. **Introduction** (5 minutes)
   - Team introductions (Sam, TaiSheng, YiLing)
   - Project title: "Blockchain-Based Food Supply Chain Traceability System"
   - Timeline: 12 weeks (9 weeks dev + 3 weeks thesis)

2. **Project Overview** (10 minutes)
   - Present brief.md problem statement
   - Explain 4-role supply chain architecture
   - Demo Walmart + IBM Food Trust case study (7 days → 2.2 seconds)
   - Explain Ethereum vs Hyperledger Fabric choice (Springer 2025 justification)

3. **PRD Walkthrough** (15 minutes)
   - Present this PRD document (12 epics overview)
   - Highlight key features: QR codes, IoT simulator, wallet-free consumer access
   - Show custodial wallet model (email login, no MetaMask required)
   - Timeline breakdown: Week 4 (contracts), Week 7 (UI), Week 9 (demo)

4. **Questions for Supervisor** (15 minutes)
   - **Q1**: Is IoT simulator approach acceptable? (We believe yes, but confirm)
   - **Q2**: Ethereum Sepolia testnet sufficient, or need mainnet explanation?
   - **Q3**: Citation style preference: IEEE or APA?
   - **Q4**: Thesis page count target: 60 minimum, 75-85 pages ideal?
   - **Q5**: Frequency of check-ins: Weekly emails, or bi-weekly meetings?
   - **Q6**: Access to OAMK Ruokajälki project resources? (Optional)
   - **Q7**: Poster presentation logistics: When? Where? Format?

5. **Scope Confirmation** (10 minutes)
   - Confirm POC (proof-of-concept) acceptable
   - Confirm 12-week timeline realistic
   - Confirm 3-person team structure approved
   - Discuss emergency scope reduction plan (if needed)

6. **Next Steps** (5 minutes)
   - Team commits to Week 4 checkpoint: Contracts deployed by Nov 28
   - Team commits to Week 9 checkpoint: Working demo by Jan 2
   - Schedule next check-in: Week 4 or Week 6?
   - Exchange contact info (email, phone)

**Materials to Bring:**
- ✅ Printed brief.md (or digital copy on laptop)
- ✅ This PRD (digital, ready to demo)
- ✅ Sample screenshots (Walmart Food Trust, IBM Food Trust)
- ✅ Notebook for notes

---

## 10.5 Communication Setup (Week 1)

**GitHub Organization:**
- [ ] Create organization: "FoodTrace-2025" (Sam creates)
- [ ] Add members: Sam (owner), TaiSheng (admin), YiLing (admin)
- [ ] Create repository: "thesis" (main repo)
- [ ] Setup branch protection: `main` branch (require PR approval)
- [ ] Setup `.gitignore` (Node.js, .env.local, .DS_Store, etc.)

**Discord/Telegram Channel:**
- [ ] Create team channel: "FoodTrace Thesis 2025"
- [ ] Pin important links:
  - GitHub repo
  - Live demo URL (after deployment)
  - Figma design file
  - Supabase dashboard
  - Sepolia Etherscan contract addresses

**Weekly Standup:**
- [ ] Schedule: Every Monday 14:00-15:00 (1 hour)
- [ ] Location: OAMK campus or Discord video call
- [ ] Agenda template:
  1. Last week wins (what each person completed)
  2. This week goals (what each person will work on)
  3. Blockers (any issues preventing progress)
  4. Demo (show working features)
  5. Next week planning

**Document Collaboration:**
- [ ] Setup Google Drive or OneDrive folder: "FoodTrace Thesis"
- [ ] Subfolders:
  - `/Meeting Notes` (weekly standup notes)
  - `/Thesis Drafts` (Word documents)
  - `/Design Assets` (Figma exports, images)
  - `/Research Papers` (PDFs of cited papers)

---

**Document Maintained By:** Sam Chou
**Last Review:** 2025-10-30
**Related Documents:**
- PRD: @docs/prd.md (product requirements)
- Brief: @docs/brief.md (project vision)
- Team Workload: @docs/planning/team-workload.md (role breakdown)
