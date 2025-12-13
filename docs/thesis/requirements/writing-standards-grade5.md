# OAMK Grade 5 Writing Standards - FoodTrace Thesis

**For:** OAMK Thesis Writing | **Grade Level:** Grade 5 (Highest)
**Cross-References:** `docs/thesis/requirements/oamk-structure.md` (chapter organization)

---

## Quick Reference (Grade 5 Essentials)

### Core Rules (The 5 Pillars)
1. **Sources must interact** - Never cite in isolation; make sources dialogue
2. **Knowledge base throughout** - Cite literature in Methods, Results, Discussion (not just Chapter 2)
3. **Evaluate source limitations** - Acknowledge strengths AND weaknesses
4. **Quantify research gaps** - "89% of papers focus on X" not "most papers"
5. **Active voice** - "We developed" not "The system was developed"

### Citation Requirements
| Requirement | Standard |
|-------------|----------|
| Sources per major claim | 3+ (diverse perspectives) |
| Technical claims | Tier 1-2 only (IEEE, ACM, Springer) |
| Industry reports (Tier 3-4) | Must cross-reference with Tier 1-2 |

### Word Count Limits
| Chapter | Target | Max |
|---------|--------|-----|
| Ch 1 Introduction | 1,000-1,200 | 1,500 |
| Ch 2 Literature Review | 2,200-2,700 | 3,000 |
| Ch 3 Methodology | 1,400-1,700 | 2,000 |
| Ch 4-5 Implementation | 2,700-3,300 | 4,000 |
| Ch 6 Results | 1,900-2,300 | 2,500 |
| Ch 7 Discussion | 1,400-1,700 | 2,000 |
| Ch 8 Conclusion | 1,100-1,300 | 1,500 |
| **TOTAL** | ~17,000 | **19,000** |

### Per-Claim Checklist
- [ ] 3+ diverse sources cited
- [ ] Sources interact (not isolated)
- [ ] Contradictions acknowledged
- [ ] Source limitations evaluated
- [ ] Connected to field gap

---

## Grade 5 vs Grade 3-4 Comparison

| Aspect | ❌ Grade 3-4 (Avoid) | ✅ Grade 5 (Target) |
|--------|---------------------|---------------------|
| **Source Usage** | Isolated citations | Sources interact/dialogue |
| **Knowledge Base** | Only in Chapter 2 | Throughout thesis |
| **Source Criticism** | Accepts at face value | Evaluates limitations |
| **Literature Integration** | Lists findings | Synthesizes, contrasts |
| **Field Impact** | "We built X" | "Our work addresses gap Y" |

---

## 1. Dialogical Source Engagement

**❌ AVOID:** `"Blockchain improves traceability (Wang 2023). Smart contracts enable automation (Chen 2024)."`

**✅ TARGET:** `"While Wang (2023) demonstrates blockchain benefits in B2B consortiums, Chen (2024) argues public blockchains face scalability challenges. Our work reconciles these by targeting small producer B2C scenarios, addressing Kumar's (2024) identified gap."`

**Key:** Sources interact → contrasts explicit → synthesis addresses gap.

---

## 2. Knowledge Base Throughout

Cite literature in ALL chapters, not just Chapter 2:

| Chapter | Example Integration |
|---------|---------------------|
| Ch 3 Methodology | "Following Springer (2025) review's recommendation, we selected Ethereum..." |
| Ch 5 Results | "88k gas aligns with Wang's (2023) reported range of 85k-95k..." |
| Ch 6 Discussion | "Our findings challenge Kumar's (2024) assertion that gas costs prohibit adoption..." |

---

## 3. Source Criticism Template

For every major source, note:
- **✅ Strengths** - Why valuable
- **⚠️ Limitations** - Where findings may not apply
- **📊 Implications** - How limitations affect interpretation

**Example (IBM Food Trust):**
> "IBM's 2.2-second traceability validates blockchain speed (strength), but uses Hyperledger Fabric B2B consortium (limitation), so cost models differ from our Ethereum small-producer context (implication)."

---

## 4. Common Mistakes (Brief)

| Mistake | Fix |
|---------|-----|
| Citation dumping (5 sources, no interaction) | Make sources dialogue |
| Literature only in Ch 2 | Integrate throughout |
| Uncritical acceptance | Evaluate limitations |
| "We built X" | Position within field gap |
| "Wang says X. Chen says Y." | "Wang says X, but Chen suggests Y. We reconcile by Z." |
| Passive voice overuse | Use active voice (2025 standard) |

---

## 5. Source Authority Hierarchy

| Tier | Examples | Use For | Verification |
|------|----------|---------|--------------|
| **1 - Academic** | IEEE, ACM, Springer journals | Technical claims, research gaps | Accepted (peer-reviewed) |
| **2 - Technical Docs** | Ethereum.org, OpenZeppelin | Implementation details | Accepted for facts |
| **3 - Industry** | IBM case study, Gartner | Real-world context | MUST cross-reference with Tier 1-2 |
| **4 - Web** | Blogs, Wikipedia | Background only | NEVER cite alone |

### Cross-Reference Protocol
- **Critical claims** (performance, costs): Verify with 2+ sources
- **Controversial claims** (platform choice): Present multiple perspectives, synthesize

---

## 6. Final Checklist (Week 12)

### Source Engagement
- [ ] Every major claim: 3+ sources
- [ ] Sources interact in text
- [ ] Contradictions acknowledged

### Knowledge Base
- [ ] Ch 3: Decisions grounded in literature
- [ ] Ch 5: Results contextualized
- [ ] Ch 6: Claims positioned in dialogue

### Source Criticism
- [ ] Major sources evaluated for limitations
- [ ] Tier 1-2 for technical claims
- [ ] Cross-referenced quantitative data

### Writing Quality
- [ ] Active voice preferred
- [ ] Synthesis > Summary
- [ ] Target 60-65 pages

---

## 7. Formatting Rules (Professor Feedback)

### Table/Figure Caption Format (Updated 2025-12-12)

**Caption Format:**
- **Figures:** `FIGURE N. Description in sentence case`
- **Tables:** `TABLE N. Description in sentence case`

**Rules:**
1. `FIGURE` and `TABLE` must be UPPERCASE
2. Period (`.`) after the number (e.g., `FIGURE 8.` not `FIGURE 8:`)
3. Description in sentence case (first letter capital, rest lowercase except proper nouns)
4. No markdown italics (remove asterisks) - causes incorrect formatting when copied to Word
5. **Figure captions:** BELOW the figure
6. **Table captions:** ABOVE the table

**Examples:**
- `FIGURE 8. Data structures of ProductRegistry contract`
- `TABLE 13. Role-based access control relationships`
- `FIGURE 13. Complete supply chain journey showing trace record actions at each stage.`

**Proper nouns to keep capitalized:**
- Platform names: Ethereum, Hyperledger Fabric, Sepolia
- Product names: ProductRegistry, FoodTrace, OpenZeppelin
- Technical terms: Test Pyramid, AccessControl

### Numbering
Sequential across chapters:
- Ch 1: Tables 1-2, Figure 1
- Ch 2: Tables 3-8, Figures 2-5
- Ch 3: Tables 9-12, Figure 6
- Ch 4: Tables 13-15, Figures 7-8
- Ch 5: Tables 16-17, Figures 9-11
- Ch 6: Tables 18-21, Figures 12-13
- Ch 7: Table 22, Figure 14

### Content Guidelines
- Tables: For structured comparisons (2+ items with multiple attributes)
- Numbered prose: For sequential items or short lists (3-4 items)
- Figures/diagrams: For process flows and system overviews
- Bullet points: Only for truly unstructured lists (rare)

### In-Text Citation Format (Updated 2025-12-12)

**Format:** `(Author Year)` - NO comma between author and year

**Rules:**
1. Remove comma between author and year
2. Keep proper format for page numbers: `(Author Year, p. 123)`
3. Multiple citations separated by semicolon: `(Author1 2024; Author2 2023)`

**Examples:**
- ❌ Wrong: `(Nakamoto, 2008)`
- ✅ Correct: `(Nakamoto 2008)`
- ❌ Wrong: `(Voskobojnikov et al., 2021)`
- ✅ Correct: `(Voskobojnikov et al. 2021)`
- ❌ Wrong: `(Casino et al., 2019; Zhao et al., 2019)`
- ✅ Correct: `(Casino et al. 2019; Zhao et al. 2019)`

---

## 8. Thesis Writing Workflow

1. **AI edits markdown** (`docs/thesis/chapters/chapter-X.md`)
2. **Human reviews** changes in markdown
3. **Human copies to Word** (Thesis Report G22.docx)
4. **Human handles figures** (Mermaid → Excalidraw → PNG → Word)

**Note:** Markdown is source of truth; Word is final output.

---

## 9. Academic Databases

### Tier 1 - Primary
| Database | URL | Focus |
|----------|-----|-------|
| IEEE Xplore | ieeexplore.ieee.org | CS, blockchain, IoT |
| ACM Digital Library | dl.acm.org | Computing, HCI |
| Springer | link.springer.com | Business IS, supply chain |
| ScienceDirect | sciencedirect.com | Computers in Industry |

### Tier 2 - Secondary
| Database | URL | Focus |
|----------|-----|-------|
| MDPI | mdpi.com | Open access (Applied Sciences) |
| Wiley | onlinelibrary.wiley.com | Food Science |
| Taylor & Francis | tandfonline.com | Production Research |

### Technical Documentation
- **Blockchain:** Ethereum.org, Hardhat, OpenZeppelin, Solidity docs
- **Frontend/Backend:** Next.js, Chakra UI, Prisma

### Citation Verification
Before adding ANY citation:
- [ ] Found on Tier 1-2 database?
- [ ] DOI resolves correctly?
- [ ] Published 2019+?
- [ ] Directly relevant to claim?

---

**Document Version:** 2.0
**Updated:** 2025-12-11 (Condensed from 1,074 to ~350 lines)
