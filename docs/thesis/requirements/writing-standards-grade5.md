# OAMK Grade 5 Writing Standards - FoodTrace Thesis

**Document Type:** Writing Quality Standards Reference
**Project:** FoodTrace - Blockchain Food Traceability System
**OAMK Grade Level:** Grade 5 (Highest Standard)
**Target Audience:** All team members during thesis writing (Weeks 10-12)

**Cross-References:**
- For thesis structure and chapter organization → `docs/planning/thesis-structure-oamk.md`
- For complete thesis outline → `docs/planning/thesis-outline.md` (original, archived)

---

## 📚 GRADE 5 WRITING STANDARDS (OAMK Criteria)

**Supervisor's Emphasis (Kickoff Meeting Oct 31):** Knowledge Base and Source Criticism are the **main core parts** for thesis evaluation. Cross-referencing required.

**OAMK Grade 5 Definition (August 1, 2025):**

> "The thesis is of an exceptionally high standard throughout. The graduate has incorporated a thorough understanding of working methods and is able to evaluate their own actions and their impact on the development of their field. The graduate utilizes and applies **diverse information** and justifies their choices with ethical transparency."

### Key Differences: Grade 5 vs Grade 3-4

| Aspect                     | ❌ Grade 3-4 (Avoid)          | ✅ Grade 5 (Target)                              |
| -------------------------- | ----------------------------- | ------------------------------------------------ |
| **Source Usage**           | Isolated citations            | Sources interact/dialogue                        |
| **Knowledge Base**         | Only in Chapter 2             | Throughout thesis (Methods, Results, Discussion) |
| **Source Criticism**       | Accepts sources at face value | Evaluates strengths, limitations, applicability  |
| **Literature Integration** | Lists what others found       | Synthesizes, compares, contrasts findings        |
| **Field Impact**           | "We built X"                  | "Our work addresses gap Y in field Z"            |
| **Conclusions**            | Restates results              | Connects results to field advancement            |

---

## 1. Dialogical Source Engagement (Required for Grade 5)

**Grade 3-4 Pattern (AVOID):**

```markdown
❌ "Blockchain improves traceability (Wang 2023). Smart contracts enable automation
(Chen 2024). Ethereum is suitable for supply chains (Lee 2023)."
```

**Problem:** Sources exist in isolation. No interaction between them.

**Grade 5 Pattern (TARGET):**

```markdown
✅ "While Wang et al. (2023) demonstrate blockchain's traceability benefits in
centralized B2B consortiums, Chen (2024) argues that public blockchains like Ethereum
face scalability challenges at enterprise scale. Our work reconciles these perspectives
by targeting small producer B2C scenarios where Ethereum's transparency advantages
outweigh consortium models' privacy benefits (Lee 2023; Springer 2025 systematic review).
This positioning addresses the research gap identified by Kumar et al. (2024): 'Most
blockchain food traceability implementations focus on large enterprises, leaving small
producer viability unexplored.'"
```

**Why Grade 5:** Sources interact (Wang vs Chen), contrasts are explicit (consortium vs public),
synthesis addresses field gap (Kumar), and our positioning is justified within this dialogue.

---

## 2. Knowledge Base Throughout (Not Just Chapter 2)

**OAMK Grade 5 Requirement:** Knowledge base must inform methods, analysis, evaluation, and conclusions—not just exist in Literature Review.

### Chapter 3 (Methodology) - Knowledge Base Integration:

**Grade 3-4 Pattern (AVOID):**

```markdown
❌ "We chose Ethereum Sepolia testnet for development. The testing framework uses
Hardhat with Chai assertions."
```

**Problem:** No connection to literature. Decisions appear arbitrary.

**Grade 5 Pattern (TARGET):**

```markdown
✅ "Following the Springer (2025) systematic review's recommendation for public blockchain
transparency in consumer-facing applications, we selected Ethereum Sepolia testnet.
This aligns with Wang et al. (2023) who demonstrate that testnet cost structures
($0 gas) enable realistic POC validation without mainnet economic barriers. The Hardhat
testing framework addresses Chen's (2024) critique of inadequate smart contract test
coverage in academic prototypes; our >70% coverage target exceeds the field median of
45% reported by Kumar et al. (2024)."
```

**Why Grade 5:** Every decision is grounded in literature (Springer 2025, Wang 2023, Chen 2024, Kumar 2024).

### Chapter 5 (Results) - Knowledge Base Integration:

**Grade 3-4 Pattern (AVOID):**

```markdown
❌ "Product registration consumed 88,432 gas. Average query time was 1.8 seconds."
```

**Problem:** Numbers exist in vacuum. No field context.

**Grade 5 Pattern (TARGET):**

```markdown
✅ "Product registration consumed 88,432 gas, aligning with Wang et al.'s (2023)
reported range of 85k-95k for ERC-721-equivalent operations. This validates Chen's
(2024) assertion that 'basic supply chain transactions remain economically viable
on Layer 1 Ethereum for high-value products.' However, our average query time of
1.8 seconds falls below IBM Food Trust's 2.2-second benchmark (IBM 2019), suggesting
that public blockchain query performance competes with permissioned consortium models
when proper caching strategies are employed—a finding that contradicts Lee's (2023)
claim that 'public blockchains cannot match enterprise performance.'"
```

**Why Grade 5:** Results are contextualized within field (Wang, Chen, IBM, Lee), contradictions
are explicit (Lee's claim challenged), and implications are drawn (public blockchain viability).

### Chapter 6 (Discussion) - Knowledge Base Integration:

**Grade 3-4 Pattern (AVOID):**

```markdown
❌ "Our system works well for small producers. Gas costs may be a barrier."
```

**Problem:** Generic observations without field positioning.

**Grade 5 Pattern (TARGET):**

```markdown
✅ "Our findings challenge Kumar et al.'s (2024) assertion that 'Ethereum gas costs
prohibit small producer adoption.' While mainnet gas fees ($5-20 per transaction at
50 gwei) exceed small producer margins, our testnet validation demonstrates that Layer 2
solutions (Polygon, Optimism) reduce costs to $0.01-0.05 per transaction—within the
'acceptable range' defined by Chen (2024) for agricultural cooperatives. This reconciles
the Springer (2025) systematic review's contradictory findings: 12 papers cite cost
barriers, yet 8 papers report successful small producer deployments. The discrepancy
stems from Layer 1 vs Layer 2 implementation choices, a distinction absent from the
reviewed literature."
```

**Why Grade 5:** Challenges existing claims (Kumar), synthesizes contradictions (Springer review),
explains discrepancies (L1 vs L2), and contributes field insight (missing distinction).

---

## 3. Source Criticism in Practice

**Apply to EVERY major source cited:**

### Example: IBM Food Trust Case Study

**Grade 3-4 Citation (AVOID):**

```markdown
❌ "IBM Food Trust reduced traceability time from 7 days to 2.2 seconds (IBM 2019),
demonstrating blockchain's effectiveness."
```

**Grade 5 Citation (TARGET):**

```markdown
✅ "IBM Food Trust's 2.2-second traceability time (IBM 2019) demonstrates blockchain
viability for large enterprises operating within established consortiums. However,
this case study's applicability to our small producer B2C context is limited by three
factors: (1) IBM uses permissioned Hyperledger Fabric, not public Ethereum (architecture
difference); (2) Walmart's supplier relationships ensure data quality upstream, whereas
independent producers lack such enforcement mechanisms (trust model difference); and
(3) consortium members share infrastructure costs, unlike our independent producer model
bearing full gas fees (economic model difference). Despite these limitations, the IBM
case validates blockchain's core value proposition—speed and immutability—which transfers
to our context when combined with Layer 2 scaling solutions (Chen 2024)."
```

**Why Grade 5:**

- Acknowledges source's contributions (2.2-second speed, viability)
- Explicitly evaluates limitations (architecture, trust model, economics)
- Explains transferability (core value proposition holds, with modifications)
- Connects to other sources (Chen 2024 for Layer 2 context)

---

## 4. Field Impact Evaluation (Chapter 7.3)

**Grade 3-4 Contributions (AVOID):**

```markdown
❌ "We built a blockchain food traceability system with QR codes and IoT simulation."
```

**Grade 5 Contributions (TARGET):**

```markdown
✅ **Field Gap Addressed:**
Kumar et al. (2024) identified that "Most blockchain food traceability implementations
focus on large enterprises, leaving small producer viability unexplored." The Springer
(2025) systematic review confirms this gap: 89% of reviewed papers (52/58) study
enterprise consortiums; only 11% (6/58) address small producer scenarios.

**Our Innovation:**
This thesis addresses the gap by demonstrating that Ethereum public blockchain, when
combined with (1) Layer 2 scaling, (2) custodial wallet abstraction, and (3) IoT
simulation for POC validation, achieves cost-performance parity with permissioned
consortium models for small producer B2C traceability.

**Impact on Field Development:**
Our findings contradict the prevailing assumption (Lee 2023; Kumar 2024) that public
blockchains are unsuitable for small producers. By isolating the Layer 2 scaling factor
as the critical enabler, we provide a concrete path for future implementations targeting
the 570 million small farms globally (FAO 2023). This shifts the research question from
"Can small producers use blockchain?" (answered: yes, with L2) to "How do we design
producer-centric governance for public blockchain traceability?" (open research direction).
```

**Why Grade 5:**

- Explicitly states field gap (Kumar, Springer review)
- Quantifies gap (89% vs 11%)
- Positions innovation within gap (L2 + custodial + simulation)
- Evaluates impact (contradicts assumptions, opens new research directions)

---

## 5. Knowledge Base in Abstract and Conclusions

### Abstract (250-300 words):

**Grade 3-4 Pattern (AVOID):**

```markdown
❌ "This thesis develops a blockchain food traceability system using Ethereum smart
contracts. The system achieved 88k gas per transaction and 1.8-second query time.
Blockchain is suitable for food traceability."
```

**Grade 5 Pattern (TARGET):**

```markdown
✅ "Addressing Kumar et al.'s (2024) identified research gap—small producer blockchain
viability—this thesis demonstrates that Ethereum public blockchain, when combined with
Layer 2 scaling and custodial wallet abstraction, achieves cost-performance parity with
permissioned consortium models (IBM Food Trust) for B2C food traceability. Our POC
contradicts prevailing assumptions (Lee 2023; Kumar 2024) that public blockchains are
unsuitable for small producers: 88k gas per transaction translates to $0.01-0.05 on
Layer 2 (Polygon), within Chen's (2024) 'acceptable range' for agricultural cooperatives.
This finding reconciles the Springer (2025) systematic review's contradictory literature
(12 papers cite cost barriers vs 8 report success) by isolating Layer 2 as the critical
enabler. The thesis contributes a concrete implementation path for the 570 million small
farms globally (FAO 2023) and shifts the research frontier from feasibility questions
to governance design for producer-centric public blockchain traceability."
```

**Why Grade 5:** Field gap stated (Kumar), field dialogue engaged (contradictions reconciled),
impact evaluated (shifts research frontier), diverse sources integrated (7 citations).

---

## 6. Practical Writing Process for Grade 5

### Step 1: Before Writing (Week 10 Prep)

For EVERY major claim you plan to make:

1. **Find 3+ sources** on the topic (Tier 1-2 preferred)
2. **Note agreements and disagreements** between sources
3. **Identify gaps or contradictions** in the literature
4. **Plan how your work addresses** these gaps/contradictions

**Example prep notes:**

```text
Topic: Ethereum gas costs for small producers

Sources:
- Kumar 2024: "Gas costs prohibit adoption" (pessimistic)
- Chen 2024: L2 solutions <$0.05/tx "acceptable for cooperatives" (optimistic)
- Springer 2025: 12 papers cite cost barriers, 8 report success (contradictory)

Gap: No clear explanation for contradiction. Hypothesis: L1 vs L2 distinction missing.

Our contribution: Isolate L2 as the critical factor. Show L1 prohibitive, L2 viable.
```

### Step 2: During Writing (Week 10-11)

**Every paragraph should:**

1. State a claim
2. Support with 2+ sources
3. Acknowledge any contradictory evidence
4. Explain your position within the dialogue

**Template:**

```markdown
[CLAIM]. While [Author A] argues [Position A], [Author B] demonstrates [Position B].
Our work reconciles these perspectives by [Your synthesis]. This addresses [Author C]'s
identified gap: "[Quote]".
```

### Step 3: Review (Week 12)

**Checklist for EVERY major section:**

- [ ] **Dialogical?** Do sources interact, or exist in isolation?
- [ ] **Knowledge Base?** Connected to literature, or just reporting results?
- [ ] **Source Criticism?** Evaluated limitations, or accepted at face value?
- [ ] **Field Impact?** Positioned within research gaps, or just described features?
- [ ] **Synthesis?** Reconciled contradictions, or listed findings?

---

## 7. Common Grade 5 Mistakes to Avoid

### Mistake 1: Citation Dumping

```markdown
❌ "Blockchain improves traceability (Wang 2023; Chen 2024; Lee 2023; Kumar 2024;
Springer 2025)."
```

**Fix:** Make sources interact, don't just list them.

### Mistake 2: Literature Review Isolation

```markdown
❌ Chapter 2: Comprehensive literature review
Chapters 3-6: Zero connection to literature
```

**Fix:** Integrate knowledge base throughout (see examples above).

### Mistake 3: Uncritical Acceptance

```markdown
❌ "IBM achieved 2.2-second traceability (IBM 2019), validating our approach."
```

**Fix:** Evaluate source limitations and transferability (see IBM example above).

### Mistake 4: Generic Contributions

```markdown
❌ "We built a working blockchain system."
```

**Fix:** Position contributions within field gaps and evaluate impact (see Field Impact example).

### Mistake 5: Missing Synthesis

```markdown
❌ "Wang says X. Chen says Y. Lee says Z."
```

**Fix:** "Wang says X, but Chen's findings suggest Y. Our work reconciles these by Z."

### Mistake 6: Passive Voice Overuse (2025 Update)

```markdown
❌ "The system was developed by the team. The results were analyzed and it was found that..."
```

**Fix:** "We developed the system. We analyzed the results and found that..."

**Why This Matters (2025 Standard):**
- Active voice is clearer and more direct
- Modern CS thesis writing prefers active voice
- Saves words (important for 60-65 page limit)
- Shows ownership and confidence in your work

**When Passive Is Acceptable:**
- Actor is unknown: "The blockchain was deployed to Sepolia testnet" (by whom? doesn't matter)
- Emphasizing result over actor: "Gas costs were reduced by 15% through optimization"

---

## 8. Grade 5 Quick Reference Card

**For EVERY major claim in your thesis, ask:**

| Question                          | Grade 3-4 Answer  | Grade 5 Answer                  |
| --------------------------------- | ----------------- | ------------------------------- |
| **How many sources?**             | 1-2               | 3+ (diverse perspectives)       |
| **Do sources interact?**          | No (isolated)     | Yes (dialogue/contrast)         |
| **Contradictions acknowledged?**  | No                | Yes, explicitly                 |
| **Source limitations evaluated?** | No                | Yes, systematically             |
| **Connected to knowledge base?**  | Only in Chapter 2 | Throughout thesis               |
| **Field gap identified?**         | No                | Yes, with evidence              |
| **Impact on field evaluated?**    | No                | Yes, with concrete implications |

**If you answer "Grade 3-4" to ANY question above, revise that section.**

---

## 9. Final Grade 5 Checklist (Week 12 Review)

Before submission, verify:

### Source Engagement:

- [ ] Every major claim supported by 3+ sources (not 1-2)
- [ ] Sources interact in text (not isolated citations)
- [ ] Contradictions explicitly acknowledged and explained
- [ ] Agreements synthesized (not just listed)

### Knowledge Base Integration:

- [ ] Chapter 3 (Methodology): Decisions grounded in literature
- [ ] Chapter 5 (Results): Findings contextualized within field
- [ ] Chapter 6 (Discussion): Claims positioned in research dialogue
- [ ] Chapter 7 (Conclusion): Impact on field development evaluated

### Source Criticism:

- [ ] Major sources (IBM, Springer review) evaluated for limitations
- [ ] Transferability of findings explicitly discussed
- [ ] Source hierarchy respected (Tier 1-2 for critical claims)
- [ ] Cross-referenced critical quantitative data (2+ sources)

### Field Impact:

- [ ] Research gap identified with evidence (author quotes)
- [ ] Gap quantified when possible (X% of papers, Y studies)
- [ ] Innovation positioned within gap
- [ ] Impact on field explicitly evaluated (not just claimed)

### Writing Quality:

- [ ] Active voice preferred (2025 standard - clarity and directness over formality)
- [ ] Synthesis > Summary (reconcile contradictions, don't just list)
- [ ] Dialogical engagement (sources interact, don't exist in isolation)
- [ ] Critical evaluation (strengths + limitations + applicability)
- [ ] Concise writing (target 60-65 pages, not 100+)

---

**Remember:** Grade 5 is not about perfection—it's about demonstrating **critical thinking** through systematic source engagement, field positioning, and impact evaluation. Your supervisor emphasized Knowledge Base and Source Criticism because they're the clearest indicators of Grade 5 capability. Follow these guidelines, and you'll meet the OAMK standard.

---

# 📊 SOURCE VERIFICATION & CRITICISM (Grade 5 Essential)

**Supervisor's Requirement (Kickoff Meeting Oct 31):** "Use cross-referencing to verify if resources are trustworthy"
**OAMK Grade 5 Standard:** "Ethical transparency with source justification"

## Why This Section Matters

Your supervisor explicitly emphasized source verification during the kickoff meeting. Grade 5 evaluation criteria require that you:

- Utilize expert sources appropriately (not just compile them)
- Engage in dialogue with sources (sources must interact, not exist in isolation)
- Demonstrate source criticism and trustworthiness evaluation

**Without proper source verification, your thesis cannot achieve Grade 5, regardless of technical quality.**

---

## 1. Source Authority Hierarchy

Use higher-ranked sources whenever possible. Lower-tier sources require verification from higher tiers.

### Tier 1 - Peer-Reviewed Academic (Highest Trust)

**Examples:**

- Journal articles (Springer, IEEE, Elsevier, ScienceDirect)
- Conference papers (IEEE Blockchain Conference, ACM)
- Systematic reviews (e.g., Springer 2025 systematic review)
- Doctoral dissertations from recognized universities

**Use for:**

- Technical claims about blockchain performance, security
- Research gaps and field development
- Methodological justification
- Theoretical frameworks

**Verification requirement:** Generally accepted without cross-reference (peer review provides validation)

**Example citation:**

> "Wang et al. (2023) demonstrate that Ethereum gas costs for supply chain transactions average 85k gas per product registration in controlled environments."

---

### Tier 2 - Technical Documentation (High Trust for Implementation)

**Examples:**

- Official documentation (Ethereum.org, Solidity docs, OpenZeppelin)
- White papers (Ethereum whitepaper, Bitcoin whitepaper)
- Technical specifications (EIP proposals, RFCs)
- Open-source project documentation (Hardhat, Next.js)

**Use for:**

- Technical accuracy verification
- Code patterns and implementation details
- Architecture decisions
- API specifications

**Verification requirement:** No cross-reference needed for factual technical details (e.g., "Solidity 0.8+ includes overflow protection")

**Example citation:**

> "OpenZeppelin's AccessControl contract (v5.0 documentation) provides role-based permission management following the principle of least privilege."

---

### Tier 3 - Industry Reports (Medium Trust, MUST Verify Claims)

**Examples:**

- IBM Food Trust case study
- McKinsey/Deloitte blockchain reports
- Gartner research
- Government statistics (WHO, FDA, European Commission)

**Use for:**

- Real-world context and business justification
- Market trends and adoption rates
- Regulatory landscape
- Case study examples

**⚠️ Verification requirement:** MUST cross-reference quantitative claims with Tier 1-2 sources

**Example (CORRECT - with verification):**

> "IBM reports 2.2-second traceability for the Walmart Food Trust deployment (IBM case study 2019). This performance is corroborated by Kamath et al.'s (2020) independent analysis, which found 2.5-second average across multiple Hyperledger Fabric implementations."

**Example (INCORRECT - no verification):**

> "IBM reports 2.2-second traceability, demonstrating blockchain superiority." ❌ (industry self-reporting without academic verification)

---

### Tier 4 - Web Sources (Low Trust, Use Sparingly)

**Examples:**

- Blog posts (Medium, company blogs)
- News articles
- Vendor marketing materials
- Wikipedia
- YouTube videos

**Use for:**

- Background context only
- Preliminary understanding (not for citations)
- Industry trends (anecdotal)

**⚠️ Verification requirement:** NEVER cite alone. Always corroborate with Tier 1-2 sources.

**Example (ACCEPTABLE - used for context only):**

> "Industry discussions (Medium 2024) suggest growing interest in Layer 2 solutions, though academic research remains limited (Chen 2024 notes only 12 peer-reviewed papers on L2 food traceability as of 2024)."

**Example (UNACCEPTABLE):**

> "According to a Medium article, blockchain will revolutionize food safety." ❌ (blog as primary source)

---

## 2. Cross-Reference Verification Protocol

### For Critical Claims (ALWAYS verify with 2+ sources)

Critical claims include:

- Performance metrics (gas costs, transaction speed, throughput)
- Security vulnerabilities or guarantees
- Cost estimates (mainnet gas fees, infrastructure costs)
- Adoption statistics (number of users, deployments)

**Protocol:**

1. Find primary source (Tier 1 or 2)
2. Verify with 2+ additional sources (preferably different tiers)
3. If sources contradict, explicitly discuss the discrepancy
4. If sources agree, state the consensus

**Example (3-source verification):**

> "Gas costs for ERC-721 token minting average 85k-100k gas across multiple studies: Wang et al. (2023) report 85k gas in optimized implementations, OpenZeppelin documentation estimates 95k gas for standard patterns, and Buterin's (2023) Ethereum performance analysis shows 100k gas under network congestion. This range suggests our product registration costs of 88k gas align with field standards."

---

### For Controversial Claims (present multiple perspectives)

Controversial claims include:

- Platform superiority (Ethereum vs Hyperledger vs other blockchains)
- Suitability for specific use cases
- Scalability solutions effectiveness
- Security model trade-offs

**Protocol:**

1. Present argument A with citation
2. Present counterargument B with citation
3. Synthesize with reference to systematic review or meta-analysis if available
4. State your position with context-specific justification

**Example (balanced presentation):**

> "The optimal blockchain platform for food traceability remains contested. Wang (2023) advocates for Ethereum due to public transparency and consumer verifiability, arguing that private chains undermine trust. Conversely, IBM Food Trust (2022) demonstrates Hyperledger Fabric's enterprise advantages: permissioned access, regulatory compliance, and consortium governance. The Springer 2025 systematic review found equal representation (24 Ethereum papers, 24 Hyperledger papers), suggesting both platforms address different use cases rather than one being universally superior. For our proof-of-concept emphasizing consumer transparency, Ethereum's public nature aligns with objectives, though we acknowledge Hyperledger Fabric may better serve enterprise B2B scenarios requiring privacy (IBM case study, Chen 2024)."

---

## 3. Source Limitation Acknowledgment

**Grade 5 requires acknowledging limitations of major sources.** This demonstrates critical thinking, not weakness.

### For Every Major Source Used, Note:

**✅ Strengths** - Why this source is valuable
**⚠️ Limitations** - Context where findings may not apply
**📊 Implications** - How limitations affect your interpretation

### Example: IBM Food Trust Case Study

**✅ Strengths:**

- Real-world production deployment (not just POC)
- Verifiable performance data (2.2-second traceability)
- Large-scale consortium (Walmart + suppliers)
- Multi-year operational history

**⚠️ Limitations:**

- B2B consortium model (Walmart-supplier relationships)
- May not apply to small producer B2C scenarios
- Uses Hyperledger Fabric (different architecture from our Ethereum POC)
- Enterprise resources (not representative of SME capabilities)

**📊 Implications for Our Work:**
"While IBM Food Trust demonstrates blockchain viability for large enterprises, our Ethereum POC targets small producers with direct consumer access. The 2.2-second performance metric validates blockchain speed benefits (IBM 2019), but cost models differ: IBM's consortium shares infrastructure costs, whereas our independent producers bear full gas fees. This difference necessitates Layer 2 solutions for small producer viability (Chen 2024)."

---

### Example: Springer 2025 Systematic Review

**✅ Strengths:**

- Comprehensive literature coverage (48 papers, 2020-2025)
- Peer-reviewed methodology
- Equal platform representation (validates our Ethereum choice)
- Identifies research gaps

**⚠️ Limitations:**

- Academic focus (POCs overrepresented vs production systems)
- Publication bias toward novel approaches (mature solutions underreported)
- Literature-based (may miss practical implementation challenges)
- Limited industry deployment data

**📊 Implications for Our Work:**
"The Springer review's 50/50 Ethereum-Hyperledger split confirms academic validity of either platform (Springer 2025). However, its academic focus means production deployment challenges (regulatory compliance, enterprise integration) may be underrepresented. We supplement with industry sources (IBM case study) while acknowledging their promotional bias."

---

### Example: Ethereum Documentation

**✅ Strengths:**

- Authoritative (official Ethereum Foundation)
- Up-to-date technical specifications
- Comprehensive API coverage
- Active maintenance

**⚠️ Limitations:**

- Optimistic performance claims (testnet vs mainnet congestion)
- Lacks cost-benefit analysis for specific industries
- Technical documentation (not academic research)
- May not address edge cases or limitations

**📊 Implications for Our Work:**
"Ethereum documentation provides technical accuracy for Solidity implementation (Ethereum.org 2025), but gas cost estimates assume normal network conditions. During congestion, costs can increase 10x (Buterin 2023), affecting small producer feasibility. We use testnet data cautiously, noting mainnet performance may vary."

---

## 4. Citation Integrity Checklist

**Before citing ANY source, complete this checklist:**

- [ ] **Author Verification**: Checked author credentials (academic affiliation, industry role, publication history)
- [ ] **Recency Check**: Publication date is 2020+ for blockchain topics (rapidly evolving field)
  - Exception: Foundational works (Nakamoto 2008, Buterin 2014) remain relevant
- [ ] **Original Source Access**: Accessed the original paper/document (not second-hand citation)
  - ❌ Bad: "Wang et al. (2023) as cited in Chen (2024) found..."
  - ✅ Good: "Wang et al. (2023) found... This aligns with Chen's (2024) analysis..."
- [ ] **Cross-Reference (Critical Claims)**: Verified quantitative data with 1+ additional source
- [ ] **Context Check**: Understood the study's scope, methodology, and limitations
- [ ] **Bias Awareness**: Identified potential conflicts of interest (e.g., IBM case study is self-reported)
- [ ] **Tier Appropriate**: Used Tier 1-2 sources for technical claims, Tier 3-4 only for context

---

## 5. How to Present Source Criticism in Your Thesis

Source criticism should be **integrated throughout**, not isolated to one section.

### In Literature Review (Chapter 2) - After Each Major Section:

Add a "Source Evaluation" subsection:

**Example (after Section 2.3 - Blockchain in Food Supply Chains):**

> **Source Evaluation:**
> This review primarily relies on peer-reviewed studies (Wang 2023, Chen 2024, Liu 2025) for technical accuracy, supplemented by industry case studies (IBM Food Trust, Walmart) for real-world context. The IBM case study provides valuable deployment insights but reflects enterprise B2B scenarios that differ from our small-producer B2C focus. The Springer 2025 systematic review offers comprehensive academic coverage but may underrepresent practical implementation challenges noted in industry reports. We cross-reference performance claims across academic and industry sources to balance optimistic projections with practical constraints.

---

### In Methodology (Chapter 3.3) - When Justifying Platform Choice:

**Example:**

> **Source-Based Platform Justification:**
> While the Springer 2025 review shows equal academic adoption (24 Ethereum papers, 24 Hyperledger papers), we acknowledge potential publication bias toward novel POCs rather than production systems. IBM's Hyperledger deployments (Food Trust, TradeLens) represent mature implementations, whereas Ethereum food traceability remains largely experimental (Chen 2024). Our Ethereum choice reflects transparency priorities for consumer-facing POC, acknowledging this aligns with academic research more than current industry practice. For production deployment, Hyperledger Fabric may better serve enterprise B2B scenarios (IBM 2022), but lacks public verifiability essential for consumer trust (Wang 2023).

---

### In Results (Chapter 5) - When Presenting Performance Data:

**Example:**

> **Performance Contextualization:**
> Our transaction speeds averaged 12.5 seconds per block on Sepolia testnet, aligning with Buterin's (2023) documented Sepolia performance benchmarks (12-15 second block time). However, we acknowledge testnet performance does not reflect mainnet conditions: Ethereum.org documentation notes 10x gas price variance during congestion, and Consensys (2024) reports mainnet confirmation times can reach 60+ seconds during peak usage. Academic studies (Wang 2023, Chen 2024) similarly use testnet data, introducing comparable limitations. For production deployment, Layer 2 solutions (Polygon, Optimism) offer 2-second finality according to technical documentation, though independent academic verification remains limited (only 3 peer-reviewed papers as of 2024).

---

### In Discussion (Chapter 6.3) - When Acknowledging Limitations:

**Example:**

> **Oracle Problem and Data Authenticity:**
> Our system inherits the oracle problem identified by Tapscott (2016) and Buterin (2014): blockchain ensures data immutability but cannot verify off-chain data accuracy at input. While we implement timestamp validation and multi-party verification (Wang 2023's recommended approaches), these mitigations cannot eliminate intentional fraud. Industry solutions like IoT sensor integration (IBM Food Trust uses tamper-evident hardware) address this in production but exceed POC scope. Academic research on blockchain-IoT authentication (Chen 2024, Liu 2025) remains theoretical, with limited field validation. This represents a known field limitation, not unique to our implementation.

---

## 6. Common Source Criticism Mistakes (Avoid These)

### ❌ Mistake 1: Citing Wikipedia or Blogs as Primary Sources

**Bad:**

> "According to Wikipedia, blockchain is a distributed ledger..."

**Good:**

> "Blockchain technology functions as a distributed ledger (Nakamoto 2008, Ethereum whitepaper 2014), providing cryptographic immutability through hash-linked blocks."

---

### ❌ Mistake 2: Second-Hand Citations (Citing Through Another Paper)

**Bad:**

> "Nakamoto (2008) as cited in Wang (2023) proposed..."

**Good:**

> "Nakamoto's (2008) Bitcoin whitepaper proposed proof-of-work consensus..."
> (You accessed Nakamoto 2008 directly, not through Wang)

---

### ❌ Mistake 3: Accepting Industry Claims Without Verification

**Bad:**

> "IBM Food Trust demonstrates blockchain's superiority with 2.2-second traceability (IBM case study 2019)."

**Good:**

> "IBM Food Trust achieved 2.2-second traceability in their Walmart deployment (IBM case study 2019). Independent analysis by Kamath (2020) corroborates this performance range (2.5-second average), though both studies focus on Hyperledger Fabric B2B consortiums, which may not translate to Ethereum public chain scenarios."

---

### ❌ Mistake 4: Ignoring Source Dates in Rapidly Evolving Field

**Bad:**

> "Ethereum's proof-of-work consensus provides security (Wood 2015)."

**Good:**

> "Ethereum originally used proof-of-work consensus (Wood 2015), but transitioned to proof-of-stake via The Merge in September 2022 (Ethereum.org 2022), fundamentally altering its security model and energy profile."

---

### ❌ Mistake 5: Not Acknowledging Contradictions Between Sources

**Bad:**

> "Wang (2023) shows Ethereum is best for food traceability. Chen (2024) demonstrates Hyperledger is optimal." (Contradiction ignored)

**Good:**

> "Platform suitability remains context-dependent: Wang (2023) advocates Ethereum for consumer-facing transparency, while Chen (2024) demonstrates Hyperledger's advantages for enterprise privacy. The Springer 2025 review's 50/50 split suggests complementary use cases rather than platform superiority."

---

## 7. Source Verification in Abstract and Conclusions

Even your abstract and conclusions must reflect source-based justification (Grade 5 requirement).

### Abstract "Results" Section - Include Source Comparison:

**Example:**

> "Transaction speeds averaged 12.5 seconds per confirmation on Sepolia testnet, aligning with documented benchmarks (Buterin 2023). Gas costs of 88k per product registration fall within the 85k-100k range reported in academic literature (Wang 2023, OpenZeppelin documentation). Performance analysis demonstrates POC viability while confirming scalability concerns identified in systematic reviews (Springer 2025)."

---

### Conclusion "Research Questions" - Cite Sources in Every Answer:

**Example (Q1):**

> "Our POC demonstrates Ethereum's technical suitability for transparency-focused food traceability, consistent with the Springer 2025 review's 50/50 academic split. Transaction speeds align with Buterin's (2023) benchmarks, but gas costs of 88k per product would translate to €0.008 on mainnet (current gas prices), confirming Chen's (2024) cost barrier for small producers producing low-value, high-volume goods. This supports emerging consensus: Ethereum suits high-value transparency-critical products (Wang 2023), while Hyperledger Fabric better serves volume B2B (IBM 2022)."

---

## 8. Tools for Source Management

**Use reference management tools to ensure consistency:**

- **Zotero** (Free, open-source, browser integration)
- **Mendeley** (Free, desktop + web, PDF annotation)
- **EndNote** (Paid, institutional access through OAMK library)

**Benefits:**

- Automatic citation formatting (IEEE, APA, etc.)
- Duplicate detection
- PDF organization and annotation
- Collaboration features for team thesis

**Setup recommendation (Week 10, Day 1):**

1. Create shared Zotero library with team
2. Add all sources during literature review
3. Export .bib file for thesis
4. Update as you write (don't wait until Week 12)

---

## 9. Final Source Verification Checklist (Before Submission)

**Complete this checklist during Week 12 thesis review:**

- [ ] **All Tier 3-4 sources verified**: Every industry report/web source cross-referenced with Tier 1-2
- [ ] **Critical claims have 2+ sources**: Performance metrics, costs, adoption rates verified
- [ ] **Major sources limitations acknowledged**: IBM, Springer, Ethereum docs have limitation sections
- [ ] **No second-hand citations**: All sources accessed directly
- [ ] **Recent sources prioritized**: 80%+ sources from 2020+ for blockchain topics
- [ ] **Author credentials verified**: Academic affiliations, publication histories checked
- [ ] **Contradictions addressed**: When sources disagree, discrepancy discussed explicitly
- [ ] **Source criticism integrated**: Not isolated to one section, woven throughout
- [ ] **Reference manager used**: Consistent formatting, no missing citations
- [ ] **Original documents saved**: PDF copies of all sources in project folder

---

**Remember:** Source verification is not about doubting your sources - it's about demonstrating Grade 5 critical thinking and academic rigor. Your supervisor emphasized this for a reason: it's the difference between Grade 4 and Grade 5.

---

**Document Version:** 1.0
**Created:** 2025-01-13
**For:** OAMK Thesis Writing (Weeks 10-12)
**Related Files:**
- `docs/planning/thesis-structure-oamk.md` (chapter organization)
- `docs/planning/thesis-outline.md` (original complete outline, archived)
