# Kickoff Meeting Agenda

**Date:** Octtober 31, 2025
**Attendees:** Sam Chou, TaiSheng Chen, YiLing Chen, Thesis Supervisor
**Duration:** ~2 hours
**Location:** TBD

---

## 📋 Meeting Objectives

1. Align with thesis supervisor on project scope and requirements
2. Confirm timeline and deliverables
3. Clarify team roles and responsibilities
4. Establish communication protocols
5. Get Week 1 tasks approved

---

## 🗓️ Agenda

### 1. Introductions & Project Overview (15 min)

**Team Introductions:**

- Sam Chou - Blockchain Lead
- TaiSheng Chen - Backend/Integration Lead
- YiLing Chen - UI/UX Lead

**Project Pitch (5 min):**

- Problem: Food supply chain traceability challenges
- Solution: Blockchain-based transparent tracking system
- Key Innovation: IoT simulation + wallet-free consumer access
- 4-role system: Producer → Distributor → Retailer → Consumer

### 2. Thesis Requirements Clarification (20 min)

**Questions for Supervisor:**

1. **Timeline & Deadlines:**

   - Confirm: 12 weeks (Jan 31 - Apr 25)?
   - Thesis submission exact date?
   - Any mid-term checkpoints/presentations?

2. **Deliverables:**

   - Thesis document: 60+ pages confirmed?
   - Poster: When is it due? Presentation format?
   - Working prototype: How detailed should demo be?

3. **Thesis Structure:**

   - Can we use the template at `/home/kala/Downloads/Thesis-template-110625-Word.docx`?
   - Are there specific chapter requirements?
   - Literature review expectations (number of sources)?

4. **Technical Scope:**

   - Is using Ethereum testnet acceptable (vs mainnet)?
   - IoT simulator vs real hardware - academically valid?
   - Target test coverage (we plan 70%+)?

5. **Grading Criteria:**
   - What's the weight distribution (Implementation vs Writing vs Analysis)?
   - Any specific technical requirements?
   - How important is the POC functionality?

### 3. Project Scope Review (20 min)

**Walk Through:**

- [Project Brief](../brief.md) - Review core concepts
- [Team Workload](../team-workload.md) - Discuss role allocation

**Key Decision Points:**

1. 4 roles vs 5 roles (we chose 4 - get approval)
2. Next.js monolith vs microservices (we chose monolith - confirm)
3. IoT simulator approach (we chose simulator - validate)
4. Optional features (reputation system, multi-party verification)

**Questions for Team:**

- TaiSheng: Comfortable with testing & Web3 integration?
- YiLing: Familiar with Chakra UI? Need design tools (Figma)?
- Sam: Solidity learning timeline realistic (10-15 hours Week 1)?

### 4. Timeline & Milestones (15 min)

**Proposed 12-Week Timeline:**

| Week                   | Phase           | Deliverables                              | Owner                         |
| ---------------------- | --------------- | ----------------------------------------- | ----------------------------- |
| **1** (Jan 31 - Feb 7) | Setup           | Environment, Solidity basics, GitHub repo | All                           |
| **2** (Feb 8 - 14)     | Planning        | PRD, Architecture docs                    | Sam + Team                    |
| **3-4** (Feb 15 - 28)  | Smart Contracts | Core contracts, tests (>70% coverage)     | Sam (lead), TaiSheng (tests)  |
| **5-7** (Mar 1 - 21)   | Frontend        | 4-role UIs, Web3 integration              | YiLing (lead), TaiSheng (API) |
| **8** (Mar 22 - 28)    | Testing         | E2E testing, bug fixes                    | TaiSheng (lead), All          |
| **9** (Mar 29 - Apr 4) | Polish          | Documentation, demo video                 | All                           |
| **10-12** (Apr 5 - 25) | Thesis          | Writing, poster, presentation             | All (20 pages each)           |

**Checkpoints:**

- Week 2: PRD + Architecture review
- Week 4: Smart contract deployment to testnet
- Week 7: Frontend MVP demo
- Week 9: Complete POC demo
- Week 11: Thesis draft review

### 5. Methodology & Tools (10 min)

**Development Approach:**

- Using BMAD (Breakthrough Method of Agile AI-driven Development)
- AI-assisted development with Claude Code
- GitHub for version control
- Weekly sprints (one story at a time)

**Tools Stack:**

- **IDE:** VS Code (all team members)
- **Blockchain:** Hardhat + MetaMask + Sepolia testnet
- **Frontend:** Next.js 15 + TypeScript + Chakra UI v3
- **Database:** Supabase (PostgreSQL + connection pooling)
- **Hosting:** Vercel (free tier sufficient)

### 6. Communication & Collaboration (10 min)

**Proposed Structure:**

**Meetings:**

- Weekly team sync: Every Monday 14:00-15:00 (1 hour)
- Daily async updates: Discord/Telegram
- Supervisor check-ins: Bi-weekly (every 2 weeks)?

**Documentation:**

- All docs in `/docs` folder (BMAD standards)
- INDEX.md as master reference
- Session notes after each meeting

**GitHub Workflow:**

- Main branch: Production-ready code only
- Develop branch: Active development
- Feature branches: Individual stories
- PR reviews: At least 1 team member approval

**Question for Team:**

- Preferred communication tool: Discord or Telegram?
- Best time for weekly meetings?

### 7. Week 1 Action Items (10 min)

**Immediate Tasks (By Feb 7):**

**All Team Members:**

- [ ] Create GitHub repo (Organization or simple repo?)
- [ ] Install development tools (Node.js, VS Code, Git)
- [ ] Create MetaMask wallets (1 per person minimum)
- [ ] Get Sepolia test ETH from faucets
- [ ] Read Project Brief thoroughly
- [ ] Review [Documentation Index](../INDEX.md)

**Sam (Blockchain Lead):**

- [ ] Start Cyfrin Updraft Solidity course (target: 10-15 hours)
- [ ] Deploy "Hello World" contract to Sepolia testnet
- [ ] Research OpenZeppelin access control patterns
- [ ] Draft initial smart contract structure

**TaiSheng (Backend/Integration):**

- [ ] Setup Supabase account and project
- [ ] Study Wagmi v2 hooks documentation
- [ ] Review Hardhat testing framework (Chai + Mocha)
- [ ] Prepare database schema draft (Product, TraceRecord, SensorReading)

**YiLing (UI/UX):**

- [ ] Setup Figma account (if using for wireframes)
- [ ] Research Chakra UI v3 components
- [ ] Review Web3 wallet connection (RainbowKit)
- [ ] Explore QR code libraries (react-qr-code, html5-qrcode)

### 8. Risk Assessment & Mitigation (10 min)

**Identified Risks:**

| Risk                               | Impact | Probability | Mitigation                                                   |
| ---------------------------------- | ------ | ----------- | ------------------------------------------------------------ |
| Solidity learning curve too steep  | High   | Medium      | Cyfrin Updraft (structured), pair programming, StackOverflow |
| Smart contract bugs/security       | High   | Medium      | OpenZeppelin patterns, extensive testing, code reviews       |
| Timeline too aggressive (12 weeks) | High   | Medium      | Emergency scope reduction plan (drop optional features)      |
| Web3 integration complexity        | Medium | Medium      | Use proven libraries (Wagmi v2, RainbowKit), copy from docs  |
| Team availability conflicts        | Medium | Low         | 40 hours/week commitment confirmed, flexible scheduling      |

**Emergency Scope Reduction (if needed):**

1. ❌ Drop reputation system (Week 6 checkpoint)
2. ❌ Drop multi-party verification (Week 6 checkpoint)
3. ❌ Simplify to 3 roles (drop Distributor) (Week 7 checkpoint)
4. ⚠️ Reduce from 4 to 2 wallets (emergency only)

### 9. Questions & Open Discussion (15 min)

**Open Floor:**

- Supervisor feedback on scope?
- Team concerns or questions?
- Any additional requirements we missed?

**Topics for Discussion:**

1. Ethereum vs Hyperledger Fabric justification (for literature review)
2. Test coverage expectations (we target 70%+)
3. Poster presentation format and timing
4. Access to university resources (servers, APIs)?

### 10. Next Steps & Wrap-Up (5 min)

**Immediate Actions (Today):**

- [ ] Create GitHub repository
- [ ] Setup team communication channel (Discord/Telegram)
- [ ] Share calendar invites for weekly meetings
- [ ] Distribute supervisor contact information

**Week 1 Deadline (Feb 7):**

- All development environments setup
- Solidity basics learned (Sam)
- GitHub repo populated with initial structure
- First weekly sync meeting scheduled

**Next Supervisor Meeting:**

- Date: TBD (bi-weekly?)
- Format: In-person or online?

---

## 📝 Meeting Notes Template (Fill After Meeting)

### Key Decisions Made:

1.
2.
3.

### Action Items Assigned:

- **Sam:**
- **TaiSheng:**
- **YiLing:**
- **Team:**

### Supervisor Feedback:

-

### Timeline Adjustments:

-

### Next Meeting:

- Date:
- Topics:

---

## 🔗 Reference Documents

- [Project Brief](../../brief.md)
- [Team Workload Analysis](../team-workload.md)
- [Architecture Decisions (Oct 17)](./2025-10-17-architecture-decisions.md)
- [Documentation Index](../../INDEX.md)
- [README.md](../../README.md)

---

**Prepared By:** Sam Chou
**Last Updated:** 2025-01-30
**Meeting Status:** 🟡 Scheduled
