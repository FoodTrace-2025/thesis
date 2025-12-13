# Chapter 8: Conclusion

This final chapter synthesizes the findings of this thesis and positions the FoodTrace proof-of-concept within the broader blockchain food traceability research landscape. It summarizes the work performed across six development phases (Section 8.1), provides evidence-based answers to the five research questions posed in Chapter 1 (Section 8.2), articulates the thesis's contributions to the research field (Section 8.3), acknowledges project limitations and threats to validity (Section 8.4), proposes future research directions (Section 8.5), and concludes with final remarks on blockchain accessibility for mainstream food supply chain stakeholders (Section 8.6).

## 8.1 Summary of Work

This thesis developed and evaluated a proof-of-concept blockchain-based food supply chain traceability system addressing the fundamental research question: **"How can blockchain technology be made accessible to mainstream users while preserving its core benefits of decentralization, transparency, and immutability?"**

The work progressed through six phases: (1) Problem definition through comprehensive literature review of 30+ sources, analyzing blockchain platform trade-offs and identifying the enterprise-bias research gap (Ellahi et al. 2024; Zhao et al. 2019); (2) Platform selection justifying Ethereum Sepolia testnet based on educational accessibility, transparency alignment, zero-cost development, and JavaScript tooling familiarity; (3) Smart contract implementation developing ProductRegistry.sol (176 lines, Solidity 0.8.20) with role-based access control and 100% test coverage (37 tests); (4) Full-stack application development implementing 4-role supply chain model (Producer, Distributor, Retailer, Consumer) with custodial wallet architecture for business users and wallet-free consumer access; (5) Testing and performance validation achieving 236 total tests across smart contracts, API endpoints, and frontend components; (6) Comparative analysis revealing blockchain advantages (cryptographic immutability, public transparency via Etherscan) and limitations (gas costs ~€0.30 per product journey, oracle problem, GDPR conflicts).

The hybrid data architecture balanced blockchain immutability with practical cost management: critical data (product registration, trace records, ownership transfers) stored on-chain using string storage (~190,000-207,000 gas per product registration, prioritizing code clarity over optimization for POC), while metadata (product descriptions, images, user authentication) resides off-chain in PostgreSQL via Prisma ORM.

---

## 8.2 Research Questions Answered

Table 23 summarizes the evidence-based answers to the five research questions established in Chapter 1, with detailed analysis provided in Chapter 7 Discussion.

TABLE 23. Research questions summary

| RQ | Question | Key Finding |
|----|----------|-------------|
| RQ1 | Ethereum suitability for POC? | Suitable for POC (100% test coverage, Etherscan verifiability); production requires L2 scaling |
| RQ2 | Blockchain vs traditional databases? | Blockchain: immutability, transparency, 1.8s queries; Traditional: lower cost, higher throughput, GDPR compliance |
| RQ3 | Transparency vs privacy balance? | Hybrid architecture viable: critical data on-chain, sensitive metadata off-chain via SHA-256 linking |
| RQ4 | Addressing UX complexity? | Custodial wallets for business (2min onboarding), wallet-free consumer access via QR codes (95% success) |
| RQ5 | Small producer feasibility? | L1 prohibitive ($5-13/product); L2 viable ($0.01-0.26/product) for premium markets |

The implementation demonstrates that blockchain UX barriers are addressable through architectural patterns rather than protocol changes. Layer 2 solutions enable economic viability for small producers targeting premium markets, shifting the research question from "Can blockchain work?" to "How do we scale it accessibly?"

---

## 8.3 Field Impact & Contributions

Ellahi et al.'s (2024) systematic review quantifies the research gap: while 88.3% of blockchain food traceability frameworks address enterprise traceability, only 3-5% address small producer concerns. The 570 million small farms globally (FAO 2023) remain excluded due to cost and complexity assumptions embedded in enterprise-focused research. This thesis addresses this gap through three technical contributions: (1) wallet-free consumer access via read-only RPC queries enabling product verification without MetaMask installation, representing the core accessibility innovation addressing the 80% wallet setup abandonment rate (Voskobojnikov et al. 2021); (2) custodial wallet abstraction enabling email/password authentication for business users via server-side AES-256-GCM encrypted key management, eliminating seed phrase complexity; (3) hybrid storage architecture storing critical traceability data on-chain (product registration, trace records, ownership transfers) while maintaining metadata off-chain, balancing immutability with practical cost management.

The work challenges assumptions that public blockchains are unsuitable for small producers. Layer 2 costs ($0.01-$0.26 per product) contradict blanket infeasibility claims, explaining contradictory literature findings through explicit Layer 1 vs Layer 2 comparison—a distinction absent from 87% of reviewed papers (Vasileiou et al. 2025). This shifts the research frontier from "Can small producers afford blockchain?" (answered: No for L1, Yes for L2 with premium products) to new directions: producer-centric governance design, cross-chain interoperability incentives, zero-knowledge proofs for GDPR compliance, and Layer 2 decentralization guarantees.

---

## 8.4 Limitations

This thesis honestly documents several constraints inherent to the proof-of-concept scope:

**Economic Constraints:** Gas costs (~€0.30 per product journey on Layer 1) require optimization or Layer 2 migration for production viability. The Sepolia testnet deployment masks true mainnet costs.

**Oracle Problem:** Blockchain guarantees data immutability but not accuracy at input—the fundamental "garbage in, garbage out" challenge. Multi-party verification provides social consensus but not cryptographic proof of real-world truth.

**Regulatory Compliance:** GDPR "right to erasure" conflicts with blockchain immutability. The hybrid architecture partially addresses this (personal data deletable off-chain), but wallet addresses and timestamps persist permanently on-chain.

**Scope Reduction:** IoT sensor integration (Epic 8) was deferred due to timeline constraints. The current implementation validates blockchain traceability through manual data entry; IoT would automate collection without changing immutability properties.

These limitations are not failures but honest documentation appropriate for bachelor's thesis POC scope.

---

## 8.5 Future Work

Table 24 outlines the recommended research and development roadmap building on this proof-of-concept.

TABLE 24. Future work roadmap

| Timeline | Focus Area | Key Activities |
|----------|------------|----------------|
| Short (3-6 mo) | L2 Deployment | Polygon mainnet migration, organic farm partnership, HTTPS mobile scanning |
| Medium (6-12 mo) | IoT + Privacy | Sensor integration with edge computing, zk-SNARKs for selective disclosure |
| Long (1-2 yr) | Scale + Compliance | Hyperledger Fabric comparison, industry consortium, FDA/EU regulatory reporting |

**IoT Sensor Integration:** The deferred Epic 8 architecture includes DHT22 sensors (~€5-10), ESP32 microcontrollers (~€8-15), and edge computing for hourly on-chain summaries. Total per-unit cost: €15-30 versus €150-200 for industrial-grade HSM sensors.

**Gas Optimization:** Replace string storage with bytes32 hashes (keccak256) for 40-60% gas reduction. Layer 2 migration (Polygon, Arbitrum, Optimism) offers 90%+ cost reduction while maintaining Ethereum security guarantees.

---

## 8.6 Final Remarks

This research demonstrates that blockchain technology can transform food supply chain transparency from trust-based to cryptographically-verified systems. The proof-of-concept validates that Ethereum public blockchain can provide transparent, immutable traceability while addressing mainstream accessibility through wallet-free consumer access and custodial wallet patterns.

The question is no longer "Can blockchain work for food traceability?" This thesis answers yes, with documented constraints. The question is now "How do we scale this technology accessibly?" The answer requires Layer 2 deployment, gas optimization, and IoT integration—the future work documented in Section 8.5.

---

## References for Chapter 8

Ellahi, R. M., et al. 2024. Blockchain-driven food supply chains: A systematic review for unexplored opportunities. _Applied Sciences_, 14(19), 8944.

Food and Agriculture Organization. 2023. _The state of food and agriculture 2023_. FAO.

Vasileiou, M., et al. 2025. Digital transformation of food supply chain management using blockchain: A systematic literature review. _Business & Information Systems Engineering_.

Voskobojnikov, A., et al. 2021. The U in crypto stands for usable: An empirical study of user experience with mobile cryptocurrency wallets. _CHI '21: CHI Conference on Human Factors in Computing Systems_.

Zhao, G., et al. 2019. Blockchain technology in agri-food value chain management: A synthesis of applications, challenges and future research directions. _Computers in Industry_, 109, 83-99.

---

**Word Count:** ~1,200 words | **Tables:** 23-24 | **References:** 5
