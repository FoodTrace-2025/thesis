# Change Management - FoodTrace Thesis Project

**Last Updated:** 2025-10-30
**Purpose:** Scope change process, decision trees, escalation procedures
**Source:** Extracted from PRD Section 11

This document defines how the team handles scope changes, timeline delays, and project challenges.

---

## 11.1 How to Request Scope Changes

### When to Request Change

- If a feature is technically impossible (discovered during implementation)
- If timeline is at risk (falling behind Week 4 or Week 7 checkpoint)
- If requirements unclear or contradictory
- If better approach discovered (with clear justification)

### Change Request Process

1. **Identify Issue** (Any team member)
   - Write clear problem statement: "What's not working?"
   - Estimate impact: Days delayed? Features affected?

2. **Propose Solution** (Team discussion)
   - Option A: Scope cut (remove feature)
   - Option B: Simplify (reduce complexity)
   - Option C: Extend timeline (add hours)
   - Option D: Get help (pair programming, outside resource)

3. **Team Vote** (All 3 members)
   - Majority vote: 2/3 approval required
   - Consensus preferred for major changes

4. **Update Documents** (Sam or TaiSheng)
   - Update PRD: Mark epic as "DEFERRED" or "SIMPLIFIED"
   - Update timeline: Adjust Week X estimates
   - Update brief.md if major scope change

5. **Notify Supervisor** (If major change)
   - Email supervisor with change rationale
   - Request approval if thesis scope affected

---

## 11.2 Scope Reduction Decision Tree

### Week 6 Assessment (If <50% Complete)

```
Are you <50% complete by Week 6?
│
├─ YES → Trigger emergency scope reduction
│   │
│   ├─ Step 1: Cut Epic 5 (Multi-Party Verification)
│   │   - Saves 6-8 hours
│   │   - Low impact on thesis (nice-to-have feature)
│   │
│   ├─ Step 2: Cut Epic 8 (Multi-Language)
│   │   - Saves 4-6 hours
│   │   - Zero impact on thesis (optional enhancement)
│   │
│   └─ Step 3: Simplify Epic 7 (Data Visualization)
│       - Cut charts, keep tables
│       - Saves 3-4 hours
│
└─ NO → Continue as planned, monitor weekly
```

### Week 7 Assessment (If UI <70% Complete)

```
Is frontend <70% complete by Week 7?
│
├─ YES → Trigger frontend triage
│   │
│   ├─ Step 1: Simplify Epic 7 (Data Visualization)
│   │   - Cut charts, keep tables only
│   │   - Saves 3-4 hours
│   │
│   ├─ Step 2: Simplify Epic 4 (Consumer Query)
│   │   - Cut QR scanner, keep manual entry
│   │   - Saves 2-3 hours
│   │
│   └─ Step 3: Reduce Epic 6 (QR Functionality)
│       - QR generation only (no scanning)
│       - Saves 2-3 hours
│
└─ NO → Continue as planned, focus on polish
```

### Week 8 Assessment (If P0 Bugs Remaining)

```
Are there P0 (critical) bugs remaining in Week 8?
│
├─ YES → Trigger bug triage
│   │
│   ├─ Assess severity: Does it block thesis defense?
│   │   ├─ YES → All hands on deck, fix before Week 9
│   │   └─ NO → Document as "Known Limitation" in thesis
│   │
│   ├─ Estimate fix time: <8 hours or >8 hours?
│   │   ├─ <8 hours → Fix immediately
│   │   └─ >8 hours → Consider workaround or limitation
│   │
│   └─ If unfixable: Prepare backup demo (video, screenshots)
│
└─ NO → Proceed to polish and documentation
```

---

## 11.3 Decision-Making Authority

### Technical Decisions

| Decision Type | Primary Decision Maker | Approval Required |
|---------------|------------------------|-------------------|
| **Smart Contract Logic** | Sam (Blockchain Lead) | TaiSheng code review |
| **Database Schema** | TaiSheng (Backend Lead) | Sam architecture review |
| **UI/UX Design** | YiLing (UI/UX Lead) | Team feedback (non-blocking) |
| **API Design** | TaiSheng (Backend Lead) | Sam integration review |
| **Tech Stack Changes** | Sam (Team Lead) | All 3 members (consensus) |
| **Scope Cuts** | Team Vote (2/3 majority) | Supervisor notification if major |

### Conflict Resolution

**If 2-person disagreement:**
1. **Technical disagreement:** Research + prototype both approaches (max 4 hours)
2. **Timeline concerns:** Team meeting to reassess scope against Week 4/7/8 checkpoints
3. **Quality vs. speed:** Default to MVP approach (speed wins for thesis timeline)
4. **Design vs. technical:** Compromise with input from both sides, Sam makes final call

**If 3-person stalemate:**
- Escalate to thesis supervisor for guidance
- Default to "simpler" option (reduces risk)
- Document decision rationale for thesis

---

## 11.4 Version Control for Documents

### Major Document Changes

**PRD Changes (Sections 1-6):**
- Update version number (e.g., v1.0 → v1.1)
- Add changelog entry at bottom of PRD
- Notify team in Discord/Telegram
- Re-run PO validation if >10% change

**Architecture Changes:**
- Update `docs/architecture.md`
- Update affected epics in `docs/prd/epic-*.md`
- Notify team in weekly standup
- Document in "Architecture Decision Log" (create if needed)

**Epic Changes (After Sharding):**
- Update individual epic file in `docs/prd/epic-*.md`
- Add changelog entry in epic file
- Notify SM agent if stories already created
- Update affected stories in `docs/stories/`

### Changelog Format

```markdown
## Changelog

### v1.1 (2025-11-15)
- **SCOPE CUT**: Removed Epic 5 (Multi-Party Verification) - behind schedule at Week 6
- **SIMPLIFIED**: Epic 7 now tables-only (no charts)
- **Reason**: Fell to 45% completion by Week 6 checkpoint
- **Impact**: Saves 10-12 hours, thesis still viable

### v1.0 (2025-10-30)
- Initial PRD creation by PM agent
- All 12 epics defined
```

---

## 11.5 Escalation Procedures

### When to Escalate to Supervisor

**Immediate Escalation (Email within 24 hours):**
- Critical bug discovered post-deployment (Week 4+)
- Team member illness/absence >3 days
- Major scope cut required (>20% of features)
- Timeline extension needed (>1 week delay)
- Technical blocker with no workaround

**Next Check-In Escalation (Wait until scheduled meeting):**
- Minor scope simplification (<10% features)
- Design feedback needed
- Resource requests (books, access, etc.)
- General progress updates

### Escalation Email Template

```
Subject: FoodTrace Project - [Issue Type] - Action Needed

Dear [Supervisor Name],

We've encountered an issue with the FoodTrace thesis project that requires your guidance.

**Problem:**
[Clear description of issue]

**Impact:**
[How this affects timeline/scope/quality]

**What We've Tried:**
1. [Solution attempt 1]
2. [Solution attempt 2]

**What We Need:**
[Specific help requested: Decision? Extension? Resources?]

**Proposed Next Steps:**
[Our suggested path forward]

Please advise at your earliest convenience. Available for meeting [dates/times].

Best regards,
FoodTrace Team (Sam, TaiSheng, YiLing)
```

---

## 11.6 Known Scope Reduction Scenarios

### Scenario 1: Epic 5 (Multi-Party Verification) Cut

**Trigger:** <50% complete by Week 6
**Impact on Thesis:** Low (documented as "nice-to-have" in brief.md)
**Workaround:** Single-party verification only (creator can self-verify)
**Thesis Justification:**
> "Due to timeline constraints, multi-party verification was deferred to future work. The system demonstrates single-party verification, sufficient to prove blockchain immutability concept."

---

### Scenario 2: Epic 8 (Multi-Language) Cut

**Trigger:** <50% complete by Week 6
**Impact on Thesis:** None (optional enhancement, not in brief.md core features)
**Workaround:** English-only interface
**Thesis Justification:**
> "Internationalization was identified as optional during project planning. English-only interface used for POC, with multi-language support documented as future enhancement."

---

### Scenario 3: Epic 7 (Data Visualization) Simplified

**Trigger:** UI <70% complete by Week 7
**Impact on Thesis:** Low (thesis requires data display, not necessarily charts)
**Workaround:** Tables instead of charts (still functional, less polished)
**Thesis Justification:**
> "Data visualization implemented using tables for clarity and rapid development. Chart-based visualization identified as future UX enhancement."

---

### Scenario 4: QR Scanning Removed (Generation Only)

**Trigger:** iOS camera issues, UI <70% complete by Week 7
**Impact on Thesis:** Medium (QR codes are in brief.md core features)
**Workaround:** QR generation works, manual Product ID entry for query
**Thesis Justification:**
> "QR code generation successfully implemented. Scanning functionality deferred due to iOS camera permission complexity. Manual Product ID entry provides equivalent functionality for POC demonstration."

---

## 11.7 Emergency Contingency Plan

### If Week 9 Demo Not Ready

**Plan A: Simplified Demo (Week 9 focus):**
- Demo 1 complete product journey (Producer → Distributor → Retailer → Consumer)
- Skip optional features (verification, IoT, charts)
- Use pre-populated data (no live transactions)
- Show smart contract on Etherscan as proof

**Plan B: Video Demo (Week 9 backup):**
- Record full demo before thesis defense
- Prepare screenshots as backup slides
- Live demo: Show only most stable features
- Video fallback if live fails

**Plan C: Thesis Reframing (Week 10-12):**
- Reframe thesis as "Feasibility Study" instead of "Working POC"
- Chapter 6 (Discussion) focuses on challenges encountered
- Still valid thesis, different angle
- Requires supervisor approval

---

## 11.8 Post-Project Change Process

### After Thesis Submission (Week 13+)

**If continuing project:**
- Create "v2.0" branch (keep thesis version as v1.0)
- Implement cut features (Epic 5, 8, etc.)
- Upgrade to Next.js 15 if desired
- Consider Hyperledger Fabric migration (production-ready)

**Thesis corrections:**
- Minor typo fixes: Direct edit (no version change)
- Major rewrites: Create v1.1 with changelog
- Notify supervisor of significant changes

---

**Document Maintained By:** Sam Chou
**Last Review:** 2025-10-30
**Related Documents:**
- PRD: @docs/prd.md (product requirements)
- Technical Constraints: @docs/planning/technical-constraints.md (risks, mitigations)
- Action Plan: @docs/planning/action-plan.md (next steps)
