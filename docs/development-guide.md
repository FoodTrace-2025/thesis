# Development Guide - FoodTrace Thesis Project

**Last Updated:** 2025-10-24
**Purpose:** Complete development reference for commands, workflows, troubleshooting

This document contains all development commands, BMAD workflow instructions, and common troubleshooting solutions for the FoodTrace thesis project.

---

## 📦 Development Commands

### Quick Start (Week 1+)

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Build for production
npm run build

# Run all tests
npm run test
```

### Smart Contract Development (Hardhat)

```bash
# Compile Solidity contracts
npx hardhat compile

# Run contract tests (Chai + Mocha)
npx hardhat test

# Run tests with coverage report
npx hardhat coverage

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.ts --network sepolia

# Verify contract on Etherscan
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS "Constructor Arg 1"

# Interactive Hardhat console (Sepolia)
npx hardhat console --network sepolia

# Clean build artifacts
npx hardhat clean
```

### Database Management (Prisma + Supabase)

```bash
# Generate Prisma client
npx prisma generate

# Push schema changes to Supabase
npx prisma db push

# Pull schema from Supabase (sync local)
npx prisma db pull

# Open Prisma Studio (database GUI)
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database (⚠️ DANGER - deletes all data)
npx prisma migrate reset
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/epic-X-story-Y

# Commit with conventional commits
git commit -m "feat: add product registration smart contract"
git commit -m "fix: resolve QR code generation bug"
git commit -m "docs: update architecture decision log"
git commit -m "test: add unit tests for trace record function"

# Push feature branch
git push origin feature/epic-X-story-Y

# Switch back to main
git checkout main
```

---

## 🔄 BMAD Workflow (When Development Starts)

### Phase 1: Planning (Weeks 1-2)

**Agents:** PM, Architect, PO
**Location:** Web UI (Claude.ai) - cost-effective for large documents

**Steps:**
1. `/analyst` → Already created brief.md ✅
2. `/pm create-doc prd` → Create PRD from brief.md
3. `/architect create-doc architecture` → Create architecture from PRD
4. `/po` run master checklist → Validate alignment

**Action:** Copy `prd.md` and `architecture.md` to `docs/` folder

### Phase 2: Development (Weeks 3-10)

**Agents:** PO, SM, Dev, QA
**Location:** Claude Code (IDE) - file operations required

#### Step 1: PO Shards Documents (Week 2)

```bash
@po shard docs/prd.md
@po shard docs/architecture.md
```

This creates:
- `docs/prd/epic-*.md` (sharded PRD epics)
- `docs/architecture/*.md` (tech-stack, coding-standards, source-tree)

#### Step 2: SM → Dev → QA Cycle (Week 3-10)

**Story Manager (SM) - Creates Story:**
```
NEW CHAT → @sm *create
→ Reviews sharded PRD, creates story in docs/stories/
→ Update story status: Draft → Approved
```

**Developer (Dev) - Implements Story:**
```
NEW CHAT → @dev
→ Implements story, writes tests
→ Update story status: Approved → InProgress → Review
```

**QA - Reviews & Refactors:**
```
NEW CHAT → @qa *review {story}
→ Reviews code, refactors, creates quality gate
→ Update story status: Review → Done (or back to InProgress if issues)
```

**🔴 CRITICAL:** Always start NEW CLEAN CHAT when switching agents (SM → Dev → QA)

**Repeat for each story (ONE at a time, sequentially)**

---

## 🛠️ Known Issues & Solutions

### Development Environment

#### Issue: VS Code + Solidity compatibility?

**Solution:** ✅ YES! Install these extensions:
- **Solidity** (by Juan Blanco)
- **Hardhat Solidity** (by Nomic Foundation)
- **Solidity Visual Developer**

**Settings:**
- Enable Solidity linting in VS Code
- Set Solidity compiler version to match hardhat.config.ts

#### Issue: GitHub organization vs simple repo?

**Solution:** ✅ Organization recommended (FoodTrace-OAMK)

**Benefits:**
- Shared ownership (not tied to one person)
- Professional for thesis presentation
- Better permission management
- Can add supervisor as outside collaborator

**How to create:**
1. Go to github.com → Your profile → Organizations → New organization
2. Choose "Create a free organization"
3. Name: FoodTrace-OAMK
4. Add team members: Sam, TaiSheng, YiLing

#### Issue: MetaMask network configuration?

**Solution:** Add Sepolia testnet manually

**Network Details:**
- Network Name: Sepolia Testnet
- RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
- Chain ID: 11155111
- Currency Symbol: SepoliaETH
- Block Explorer: https://sepolia.etherscan.io

#### Issue: Sepolia test ETH faucets?

**Solution:** Use multiple faucets (daily limits apply)

**Recommended Faucets:**
- https://sepoliafaucet.com/
- https://www.infura.io/faucet/sepolia
- https://faucet.quicknode.com/ethereum/sepolia
- https://faucet.chainstack.com/sepolia-faucet

**Get 3 wallets funded** (Producer, Distributor, Retailer roles for testing)

---

## 🎯 Scope Management

### Optional Features (Can be cut if behind schedule)

- ❌ **Reputation system** (complex, cut first if needed)
- ❌ **Multi-party verification** (nice-to-have, cut second)
- ❌ **Photo EXIF metadata** (optional enhancement)
- ✅ **MUST KEEP:** QR codes, basic traceability, IoT simulator

### Emergency Scope Reduction Timeline

**Week 6 checkpoint:** If falling behind, drop reputation system

**Week 7 checkpoint:** If still behind, simplify to 3 roles (drop Distributor)

**Week 8 checkpoint:** If major issues, document as "known limitations" in thesis

---

## ⚙️ Known Configurations

### APIs & Services (Free Tiers)

**Ethereum Sepolia Testnet:**
- Network: Public testnet (permanent)
- Cost: €0 (test ETH is free)
- Purpose: Smart contract deployment

**Alchemy or Infura API:**
- Tier: Free tier should suffice
- Requests: 100K requests/month (free)
- Purpose: Ethereum RPC provider

**Supabase:**
- Tier: Free tier
- Database: 500MB storage
- Bandwidth: 2GB bandwidth/month
- Purpose: PostgreSQL database

**Vercel:**
- Tier: Free tier (Hobby)
- Deployments: Unlimited
- Bandwidth: 100GB bandwidth/month
- Purpose: Next.js hosting (Asia CDN)

### Team Accounts (To Be Created Week 1)

**Week 1 Setup Checklist:**
- [ ] Create 3 MetaMask wallets (Producer, Distributor, Retailer)
- [ ] Get Sepolia test ETH for all 3 wallets (0.1 ETH each minimum)
- [ ] Create GitHub organization (FoodTrace-OAMK)
- [ ] Create Supabase project
- [ ] Create Vercel account (link to GitHub)
- [ ] Create Alchemy or Infura API key

---

## 🚨 Important Development Reminders

### For All Team Members

1. **Test before committing:** Always run `npm run build` and `npm run test` before pushing
2. **Commit often:** Small, atomic commits with clear messages
3. **One story at a time:** Never work on multiple stories simultaneously (BMAD rule)
4. **Follow BMAD workflow:** SM → Dev → QA cycle strictly (no shortcuts)
5. **Gas optimization:** Target <100k gas for simple functions in smart contracts

### For Sam (Blockchain Lead)

- **Complete Cyfrin Updraft** (10-15 hours) before writing production contracts
- **Test coverage target:** >70% for all smart contracts
- **Security:** Always use OpenZeppelin contracts when possible
- **Documentation:** Add NatSpec comments to all public/external functions

### For TaiSheng (Backend/Integration Lead)

- **Supabase pooling:** Use pgBouncer connection pooling (critical for Vercel serverless)
- **API error handling:** Always return proper status codes and error messages
- **Testing:** Write integration tests for all API routes
- **Web3 integration:** Test wallet connections on mobile devices

### For YiLing (UI/UX Lead)

- **Mobile-first:** Design for mobile (60%+ Taiwan users on mobile)
- **Accessibility:** Maintain WCAG 2.1 AA standards
- **Performance:** Keep bundle size under 250KB First Load JS
- **QR codes:** Test QR scanning on multiple devices (Android + iOS)

---

## 📞 Getting Help

**Technical Issues:**
1. Check this document first
2. Search project documentation (`docs/` folder)
3. Check BMAD Discord: https://discord.gg/gk8jAdXWmj
4. Ask in team Discord/Telegram

**Academic Questions:**
- Thesis supervisor (contact after kickoff meeting Oct 31)
- OAMK thesis office
- Team weekly meetings (Mondays 14:00-15:00)

---

## 📋 Definition of Done Checklist

### Epic-Level Definition of Done

**For an epic to be considered "DONE", ALL of the following must be true:**

#### Code Quality
- ✅ All code merged to `main` branch (no WIP branches)
- ✅ Code follows project coding standards (see `docs/architecture/coding-standards.md` after Architect creates it)
- ✅ No ESLint errors or warnings
- ✅ No TypeScript type errors (`npm run type-check` passes)
- ✅ All console.log() debugging statements removed

#### Testing
- ✅ Smart contracts: >70% test coverage (`npx hardhat coverage`)
- ✅ Smart contracts: All functions have unit tests
- ✅ Smart contracts: Integration tests pass (complete product journey)
- ✅ Frontend: Manual testing on Chrome, Firefox, Safari
- ✅ Frontend: Mobile responsive (tested on iOS + Android)
- ✅ API: All endpoints tested with Postman/automated tests

#### Documentation
- ✅ Smart contract functions: NatSpec comments (/** */ format)
- ✅ Complex functions: Inline comments explaining logic
- ✅ API endpoints: Documented in README or separate API.md
- ✅ Database schema: Prisma models documented
- ✅ User-facing features: Entry in user manual (Week 9)

#### Functionality
- ✅ All acceptance criteria met (see epic specifications)
- ✅ No P0 (critical) bugs remaining (P1-P2 acceptable if documented)
- ✅ Feature works end-to-end (tested by all 3 team members)
- ✅ Error handling implemented (user sees friendly error, not crash)
- ✅ Loading states implemented (user knows system is working)

#### Deployment (Epic 9)
- ✅ Code deployed to production (Render.com)
- ✅ Feature accessible via live URL
- ✅ Environment variables configured correctly
- ✅ No secrets in codebase (all in .env.local, .gitignore)

#### Review
- ✅ Code reviewed by at least 1 other team member (GitHub PR approval)
- ✅ Demo'd to team during weekly standup
- ✅ QA agent review passed (after BMAD workflow starts Week 3+)

---

### Story-Level Definition of Done

**For a story (created by SM agent in Week 3+) to be "DONE":**

#### SM Agent Creates Story
- ✅ Story file exists in `docs/stories/epic-X.story-Y.md`
- ✅ Story status: `Draft` → `Approved` (SM reviewed and approved)

#### Dev Agent Implements
- ✅ All code files created/modified as specified in story
- ✅ Tests written and passing
- ✅ Story status: `Approved` → `InProgress` → `Review`

#### QA Agent Reviews
- ✅ QA gate created in `docs/qa/gates/epic-X.story-Y.yml`
- ✅ All blockers resolved (no ❌ items in QA gate)
- ✅ Warnings acknowledged (⚠️ items documented)
- ✅ Story status: `Review` → `Done` ✅

---

### Week-Level Definition of Done

**Weekly Checkpoints:**

**Week 2 (End of Planning Phase):**
- ✅ PRD created and approved by team
- ✅ Architecture document created and approved
- ✅ PO validation >90% alignment with brief.md
- ✅ GitHub organization created, all members added
- ✅ 3 wallets funded with Sepolia test ETH (0.5 ETH each)
- ✅ First "Hello World" contract deployed to testnet

**Week 4 (Critical Checkpoint - Contracts Done):**
- ✅ All smart contracts deployed to Sepolia testnet
- ✅ Contracts verified on Etherscan
- ✅ Test coverage >70%
- ✅ Database schema deployed to Supabase
- ✅ Component library 80% complete

**Week 7 (Critical Checkpoint - Integration Done):**
- ✅ All 4 role interfaces functional (Producer, Distributor, Retailer, Consumer)
- ✅ Wallet connection working (RainbowKit integrated)
- ✅ Product can be registered, transferred, and queried end-to-end
- ✅ QR code generation and scanning working
- ✅ IoT simulator functional

**Week 8 (Testing Complete):**
- ✅ No P0 (critical) bugs remaining
- ✅ Cross-browser testing complete (Chrome, Firefox, Safari)
- ✅ Mobile testing complete (iOS + Android)
- ✅ Performance acceptable (<3 second page load, <100ms API)
- ✅ Accessibility baseline met (WCAG Level A)

**Week 9 (Demo Ready):**
- ✅ Deployed to Render.com (live URL accessible)
- ✅ Demo video recorded (3-5 minutes, high quality)
- ✅ User manual complete (screenshots, step-by-step)
- ✅ Presentation slides prepared
- ✅ Demo rehearsed (all 3 members can present)

**Week 12 (Thesis Submitted):**
- ✅ Thesis document complete (60+ pages)
- ✅ Formatted using OAMK template
- ✅ References 20+ sources (IEEE or APA style)
- ✅ Poster created (A1 size, OAMK template)
- ✅ All figures numbered and captioned
- ✅ Peer review complete (each member reads full thesis)
- ✅ Submitted to OAMK Theseus system

---

### Project-Level Definition of Done

**For the entire FoodTrace project to be "DONE":**

#### Functional Requirements
- ✅ Producer can register products on blockchain
- ✅ Distributor can add trace records
- ✅ Retailer can receive and update products
- ✅ Consumer can query product history (wallet-free)
- ✅ QR codes generated and scannable
- ✅ IoT simulator generates realistic sensor data
- ✅ Temperature violations trigger alerts

#### Technical Requirements
- ✅ Smart contracts deployed to Sepolia testnet (permanent)
- ✅ Application deployed to Render.com (live URL)
- ✅ Database hosted on Supabase (persistent)
- ✅ >70% test coverage (smart contracts)
- ✅ No critical security vulnerabilities
- ✅ Gas costs <0.01 ETH per transaction (testnet)

#### Academic Requirements
- ✅ Thesis 60-100 pages (meets OAMK standards)
- ✅ Abstract <300 words (describes project clearly)
- ✅ Literature review cites 20+ sources
- ✅ Methodology explains BMAD approach
- ✅ Results include performance metrics, test coverage
- ✅ Discussion addresses limitations (GIGO problem, scalability)
- ✅ Conclusion answers all research questions
- ✅ Formatted correctly (OAMK template)
- ✅ Poster created (A1, professional quality)

#### Demo Requirements
- ✅ Complete product journey demo (Producer → Distributor → Retailer → Consumer)
- ✅ QR code scanning demo (on smartphone)
- ✅ Consumer query demo (wallet-free access)
- ✅ IoT simulator demo (Normal/Warning/Critical scenarios)
- ✅ Blockchain transparency demo (Etherscan verification)
- ✅ Demo video recorded (backup if live fails)
- ✅ Presentation <20 minutes (thesis defense)

#### Documentation Requirements
- ✅ README.md complete (setup instructions, tech stack, architecture)
- ✅ API documentation (all endpoints documented)
- ✅ User manual (step-by-step with screenshots)
- ✅ Technical documentation (smart contracts, database schema)
- ✅ Code comments (NatSpec for contracts, inline for complex logic)
- ✅ .env.example (all required environment variables listed)

#### Team Requirements
- ✅ All 3 members contributed equally (~400 hours each)
- ✅ Git commit history shows balanced contributions
- ✅ No major conflicts or issues (resolved through consensus)
- ✅ Weekly standups held consistently
- ✅ All members can explain architecture and design decisions

---

**Document Maintained By:** Sam Chou (Team Lead)
**Last Review:** 2025-10-30
**Next Review:** After architecture.md creation (Week 2)
