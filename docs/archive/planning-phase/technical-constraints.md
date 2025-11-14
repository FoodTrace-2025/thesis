# Technical Constraints - FoodTrace Thesis Project

**Last Updated:** 2025-10-30
**Purpose:** Technology limitations, development environment requirements, timeline constraints
**Source:** Extracted from PRD Section 8

This document details all technical, environmental, timeline, and academic constraints for the FoodTrace project.

---

## 8.1 Technology Limitations

### Blockchain Constraints

**Ethereum Sepolia Testnet:**
- ✅ Permanent testnet (no reset risk like Goerli)
- ⚠️ Test ETH required from faucets (rate-limited, max 0.1-0.5 ETH/day)
- ⚠️ Block time: ~12-15 seconds (transaction confirmation delay)
- ⚠️ Gas price volatility: Can spike during high usage
- ❌ Not production mainnet (no real economic value)

**Smart Contract Immutability:**
- ✅ Once deployed, code cannot be modified (ensures trust)
- ⚠️ Bugs require new contract deployment (migration complexity)
- ⚠️ If critical bug found post-Week 4, must redeploy and re-test
- 🛠️ **Mitigation**: Extensive testing Week 3-4, formal code review

**Gas Cost Considerations:**
- ⚠️ Each blockchain transaction costs gas (testnet free, mainnet expensive)
- ⚠️ Complex functions (loops, storage) more expensive
- 🎯 **Target**: <100k gas per transaction (<$5 on mainnet at 50 gwei)
- 🛠️ **Mitigation**: Gas optimization pass in Week 8, store minimal data on-chain

### Database & Backend Constraints

**Supabase Free Tier Limits:**
- ✅ 500MB database storage (sufficient for POC, ~5000 products estimated)
- ✅ 2GB bandwidth/month (sufficient for thesis demo)
- ⚠️ PostgreSQL connection limit: 60 connections (pgBouncer pooling helps)
- ⚠️ Row Level Security (RLS) rules can impact performance
- 🛠️ **Mitigation**: Monitor usage dashboard, upgrade to paid tier if needed ($25/month)

**Render.com Free Tier Limits:**
- ✅ 750 hours/month free (sufficient for 1 instance)
- ⚠️ Server sleeps after 15 minutes inactivity (cold start: 30-60 seconds)
- ⚠️ 512MB RAM limit (Next.js build may be tight)
- ⚠️ No persistent disk storage (database must be external)
- 🛠️ **Mitigation**: Keep production instance awake with UptimeRobot pings, optimize build

**Next.js 14.2.15 Pages Router:**
- ✅ Stable, battle-tested (1+ year in production)
- ⚠️ No React Server Components (RSC) - App Router feature only
- ⚠️ API Routes serverless (Render.com runs as traditional Node.js, so no issue)
- 🛠️ **Decision**: Stick with Pages Router for stability, avoid bleeding-edge features

### Frontend Constraints

**Chakra UI v2:**
- ✅ Comprehensive component library, accessibility-first
- ⚠️ Bundle size: ~450KB (acceptable for thesis, may need optimization)
- ⚠️ Limited dark mode support without custom theming
- 🛠️ **Mitigation**: Tree-shaking to reduce bundle, skip dark mode (out of scope)

**QR Code Scanning (html5-qrcode):**
- ✅ Works on most modern browsers (Chrome, Firefox, Safari)
- ⚠️ Requires HTTPS for camera access (Render.com provides automatic SSL)
- ⚠️ iOS Safari requires user permission prompt (UX friction)
- ⚠️ Lighting conditions affect scan reliability
- 🛠️ **Mitigation**: Fallback to manual Product ID entry, test in multiple lighting

**Mobile Browser Compatibility:**
- ✅ Target: Modern browsers (Chrome 90+, Safari 14+, Firefox 88+)
- ⚠️ Older Android browsers may have Web3 issues
- ⚠️ iOS WKWebView (in-app browsers) may block camera
- 🛠️ **Mitigation**: Test on real devices, provide "Open in Browser" prompt

---

## 8.2 Development Environment Constraints

### Team Setup Requirements

**Minimum Hardware Requirements (All Team Members):**
- **CPU**: Intel i5 / AMD Ryzen 5 (2018+) or Apple M1/M2
- **RAM**: 8GB minimum (16GB recommended for smooth Hardhat testing)
- **Disk**: 10GB free space (Node modules + blockchain data)
- **Internet**: Stable connection (blockchain RPC calls, Supabase cloud database)

**Required Software (Week 1 Setup):**
- **Node.js**: v18.x LTS or v20.x (not v21+, unstable)
- **npm**: v9+ or pnpm v8+ (package manager)
- **Git**: v2.30+ (version control)
- **VS Code**: Latest (recommended IDE)
  - Extensions: Solidity (by Juan Blanco), Hardhat Solidity, Prisma, ESLint
- **MetaMask**: Browser extension (for testing business user wallets)

**API Keys & Accounts (Week 1):**
- ✅ **Alchemy or Infura**: Free tier Ethereum API key (100k requests/month)
- ✅ **Supabase**: Free tier project (database + storage)
- ✅ **Render.com**: GitHub-connected account (deployment)
- ✅ **Sepolia Faucets**: 3 wallet addresses funded (0.5 ETH each minimum)
- ⏳ **Etherscan API**: For contract verification (optional, free tier)

**GitHub Organization Requirement:**
- ✅ Must create GitHub organization (e.g., "FoodTrace-2025")
- ⚠️ Render.com deployment requires organization ownership (not personal repo)
- 🛠️ **Action**: Sam creates organization, adds TaiSheng and YiLing as members (Week 1)

---

## 8.3 Time & Resource Constraints

### Timeline Pressure Points

**Non-Negotiable Deadlines:**
- ✅ **Week 4 Checkpoint**: Smart contracts MUST be deployed to Sepolia (no extensions)
- ✅ **Week 7 Checkpoint**: All UI interfaces MUST be functional (integration complete)
- ✅ **Week 9 Deadline**: Working demo MUST be ready (thesis defense prep)
- ✅ **Week 12 Deadline**: Thesis submission (~January 23, 2026)

**Time Buffer Allocation:**
- Week 1-2: +20% buffer (learning curve uncertainty)
- Week 3-4: +15% buffer (smart contract complexity)
- Week 5-7: +10% buffer (integration challenges)
- Week 8: -10% buffer (testing must finish on time)
- Week 9-10: No buffer (fixed thesis deadline)

**If Behind Schedule (Emergency Scope Cuts):**

**Week 6 Assessment:**
- If <40% complete: **CUT Epic 5 (Multi-Party Verification)** - saves 6-8 hours
- If <30% complete: **CUT Epic 8 (Multi-Language)** - saves additional 4-6 hours

**Week 7 Assessment:**
- If frontend not 70% complete: **Simplify Epic 7 (Data Visualization)** - cut charts, keep tables
- If API not 80% complete: **CUT Epic 0.6 Tier 3 (Nice-to-Have security)** - saves 3 hours

**Week 8 Assessment:**
- If major bugs: Accept as "known limitations" in thesis, document thoroughly
- If performance issues: Skip optimization, focus on functional demo

---

## 8.4 Academic Constraints

### OAMK Thesis Requirements

**Page Count:**
- ✅ Minimum: 60 pages (20 pages per person)
- ⚠️ Maximum: ~100 pages (reviewers prefer concise)
- 🎯 **Target**: 75-85 pages (comfortable margin)

**Citation Requirements:**
- ✅ Minimum: 20 references
- 🎯 **Target**: 30-40 references (mix academic + technical)
- ✅ **Must-Cite**:
  - Springer 2025 Systematic Review (Ethereum vs Hyperledger)
  - Walmart + IBM Food Trust Case Study
  - Ethereum whitepaper / Solidity documentation
  - OpenZeppelin documentation

**Formatting Constraints:**
- ✅ **Template**: OAMK official Word template (DO NOT MODIFY STYLES)
- ✅ **Font**: Arial or Calibri (as specified in template)
- ✅ **Line Spacing**: 1.5 or double (check template)
- ✅ **Margins**: As per template (usually 2.5cm)
- ⚠️ **Figures**: Must be referenced in text, numbered sequentially
- ⚠️ **Code Snippets**: Max 20 lines per snippet, use syntax highlighting

**Thesis Defense:**
- ✅ **Duration**: ~20-30 minutes presentation + Q&A
- ✅ **Poster**: A1 size (PowerPoint template provided by OAMK)
- ✅ **Demo**: Live or video (live preferred, video as backup)

---

## 8.5 Known Risks & Mitigations

### Technical Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Smart contract critical bug post-deployment | Medium | High | Extensive testing Week 3-4, formal code review, redeploy if needed |
| Sepolia testnet faucet rate limits | Medium | Medium | Fund 3 wallets early, use multiple faucets, ask BMAD community for ETH |
| Render.com free tier insufficient | Low | Medium | Monitor usage, upgrade to $7/month if needed |
| Wallet encryption vulnerability | Low | High | Use proven libraries (crypto.js), Sam security review, TaiSheng double-check |
| Database connection exhaustion | Low | High | Supabase pgBouncer enabled, connection pooling tested Week 5 |
| QR code scanning fails on iOS | Medium | Low | Fallback to manual Product ID entry, test on real iPhones |
| Integration delays (Week 5-7) | Medium | High | Daily standups, pair programming, TaiSheng helps YiLing |
| Team member illness | Low | High | Document everything, cross-train on critical paths, Week 8 buffer |

### Academic Risks

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Thesis supervisor rejects POC approach | Very Low | Critical | Kickoff meeting Oct 31 confirms scope, brief.md already approved |
| Time overrun (can't finish thesis writing) | Medium | High | Week 10-12 focused writing, peer review, start outlines in Week 9 |
| Demo breaks during thesis defense | Medium | Medium | Video backup, staging environment, test demo 10 times before defense |
| Insufficient academic sources | Low | Medium | Start literature review Week 1, aim for 40 references (20% buffer) |
| Formatting issues with OAMK template | Medium | Low | Use template from Day 1, check formatting weekly |

---

**Document Maintained By:** Sam Chou
**Last Review:** 2025-10-30
**Related Documents:**
- PRD: @docs/prd.md (product requirements)
- Architecture: @docs/architecture.md (to be created Week 2)
- Development Guide: @docs/development-guide.md (commands, workflows)
