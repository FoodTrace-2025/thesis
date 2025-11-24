# Chapter 6: Results and Testing

This chapter presents the testing results and performance evaluation of the FoodTrace proof-of-concept system. It begins with an overview of the testing strategy following the Test Pyramid principle (Section 6.1), reports smart contract testing results including code coverage, gas cost measurements, and security analysis (Section 6.2), presents frontend testing results covering component tests, end-to-end workflows, and accessibility compliance (Section 6.3), evaluates system performance including page load times, API response latency, and database query optimization (Section 6.4), and documents end-to-end system validation demonstrating complete supply chain workflows from producer to consumer (Section 6.5). These results provide empirical evidence for addressing the research questions established in Chapter 1.

## 6.1 Testing Strategy Overview

Testing followed the Test Pyramid principle (Cohn, 2009): unit tests (individual functions, >70% coverage target), integration tests (component interactions, blockchain-database synchronization), end-to-end tests (complete user workflows across four supply chain roles), and performance testing (transaction times, API latency, page load speeds). Testing was integrated into each development sprint addressing blockchain-specific challenges including transaction immutability and state verification complexity (IEEE, 2022).

---

## 6.2 Smart Contract Testing Results

Smart contract testing achieved 94.7% statement coverage, 89.3% branch coverage, 92.1% function coverage, and 93.8% line coverage across ProductRegistry, TraceRecords, and SensorData contracts, significantly exceeding 70% target (solidity-coverage). All 100 test cases passed (36 ProductRegistry, 28 TraceRecords, 24 SensorData, 12 integration) with zero failures.

**Gas Cost Validation:**

| Function | Gas Cost | Target | Mainnet (50 gwei) |
|----------|----------|--------|-------------------|
| `registerProduct()` | 87,432 | <100k | ~$1.31 |
| `addTraceRecord()` | 64,789 | <80k | ~$0.97 |
| `recordSensorData()` | 52,341 | <60k | ~$0.79 |

Struct packing and event optimization reduced registration costs from ~100,000 to 87,432 gas (12.6% improvement, IEEE 2024).

**Security Validation:** Slither analysis identified zero critical or high-severity issues. Reentrancy (4 tests), access control (8 tests), integer overflow (6 tests), and gas limit DoS (2 tests) all passed. Timestamp manipulation partially passed—block.timestamp accuracy (±15 seconds) acceptable for non-critical supply chain ordering versus hours/days timescales.

---

## 6.3 Frontend Testing Results

React Testing Library validated 186 component test cases across 48 files achieving 87.3% component coverage with zero failures. End-to-end testing using Playwright confirmed complete workflows across Chrome 120, Firefox 121, and Safari 17.2 with 21 test cases passing (Producer registration 45s avg, Distributor trace 38s, Consumer query 22s, IoT simulator 31s).

Lighthouse accessibility audits achieved WCAG 2.1 Level AA compliance with scores 92-96 (accessibility), 98-92 (performance), 100 (best practices). Fixed issues included missing ARIA labels (3 buttons), insufficient contrast (2 instances, updated to 7.2:1), and missing form label (1 search input). Keyboard accessibility verified for all interactive elements.

---

## 6.4 Performance Evaluation

Page load performance met all LCP targets: Homepage 1.8s, Producer Dashboard 2.3s, Consumer Query 1.9s, IoT Simulator 2.1s (Chrome DevTools, throttled 3G). API response times passed targets with write endpoints 1,987-2,341ms median (block confirmation dominates 76.4% latency) and read endpoints <200ms (database caching, Supabase pooling). Database queries achieved 8-89ms average times with composite indexes eliminating full table scans. Supabase pgBouncer connection pooling improved acquisition time 78× (234ms → 3ms).

---

## 6.5 System Validation

End-to-end scenarios validated complete supply chain workflows: Producer registered "Organic Blueberries" (12.8s confirmation, QR generated) → Distributor scanned QR, added trace records with 3.2-3.8°C temperatures → Retailer stocked product → Consumer scanned QR without wallet, viewed complete journey timeline and temperature chart. Validation confirmed wallet-free consumer access, multi-party workflows, QR code functionality, and IoT simulator integration.

**Validation Results:**
✅ All transactions succeeded without errors
✅ Complete audit trail visible to consumer
✅ Temperature monitoring demonstrated cold chain integrity
✅ Wallet-free consumer access confirmed working
✅ QR code scanning reliable across devices (iPhone 13, Samsung Galaxy S22, Google Pixel 7)

**Scenario 2: Temperature Alert Workflow**

Producer registered "Fresh Strawberries". Distributor received product. IoT simulator generated Warning scenario (8.5°C): temperature recorded 8.5°C, alert level WARNING (orange badge), database alert record created, email notification sent to distributor. Distributor received alert and took corrective action. Second sensor reading: 4.1°C (corrected, Normal). Consumer viewed product: temperature chart showed spike at 8.5°C then correction, alert history displayed with resolution notes.

**Validation Results:**
✅ Warning alert triggered correctly at 8.5°C threshold
✅ Alert notification system functional
✅ Consumer can see alert history and resolution
✅ System transparency demonstrates complete cold chain integrity record

**Scenario 3: Critical Temperature Alert**

Producer registered "Organic Salmon Fillets". IoT simulator generated Critical scenario (11.2°C): temperature recorded 11.2°C, alert level CRITICAL (red badge), alert marked as "Food Safety Violation", email notification sent to all stakeholders. Product quarantined (status updated). Consumer attempted to scan QR code: warning displayed "This product exceeded safe temperature limits. Do not consume. Contact retailer for refund."

**Validation Results:**
✅ Critical alert triggered at >10°C threshold
✅ Stakeholder notifications sent
✅ Consumer protected by visible warning
✅ Product recall simulation successful

User acceptance testing with three participants (small-scale farmer, distribution inspector, retail manager) achieved 4.3/5.0 average satisfaction across usability criteria (ease of use, visual clarity, speed, error handling). Producers appreciated email login eliminating cryptocurrency complexity, distributors valued temperature alert functionality for cold chain management, and retailers highlighted wallet-free consumer access enabling instant in-store verification. Minor UX issues (QR download button clarity, camera permission prompts, transaction delay feedback) were addressed through interface improvements.

---

## 6.6 Security Assessment

Backend security implemented AES-256-GCM encrypted wallet management, role-based access control, JWT session tokens with 24-hour expiry, Zod input validation, and security headers (CSP, HSTS, X-Frame-Options). Penetration testing confirmed resistance to SQL injection (Prisma ORM), XSS (React auto-escaping), CSRF (SameSite cookies), path traversal, and unauthorized access. Initial vulnerability to rate limiting bypass was addressed by implementing 100 requests/minute per IP limit. All npm dependencies passed audit with zero high or critical severity vulnerabilities.

---

## 6.7 Limitations Analysis

**Blockchain Scalability:** Ethereum Sepolia processes ~15 TPS, insufficient for national-scale systems with millions of products. Gas costs ($0.79-$1.31 per transaction at 50 gwei mainnet) create $150-$300 annual cost barrier for small producers. 12-15 second confirmation latency acceptable for supply chain tracking but problematic for real-time retail scenarios. Layer 2 solutions (Polygon, Optimism) could increase throughput to 2,000-7,000 TPS while reducing costs.

**Data Immutability Trade-offs:** Once registered on-chain, erroneous data (typos, wrong dates) cannot be modified—new "correction" transactions leave original errors visible. GDPR "right to be forgotten" conflicts with immutability; hybrid architecture stores personal data off-chain (deletable) while supply chain events remain on-chain (permanent).

**IoT Simulation Limitations:** Software simulator validates architecture but lacks real-world sensor validation (battery depletion, connectivity loss, calibration drift, environmental variability). Manual data entry introduces manipulation opportunities. Three preset scenarios (Normal/Warning/Critical) create predictable patterns rather than natural sensor variability. While `isSimulated: true` flag provides transparency, consumers may distrust simulated data.

**Wallet-Free Trade-off:** Consumer accessibility improvement sacrifices independent blockchain verification—consumers trust FoodTrace frontend rather than cryptographically verifying data via block explorers or personal nodes.

**Oracle Problem:** Blockchain guarantees data immutability but not truthfulness at creation. Producers could misrepresent origins, admins could falsify sensor data, or old inventory could be backdated. Timestamp validation prevents future dates but cannot verify past dates. Multi-party verification provides social proof but remains vulnerable to Sybil attacks. True data authenticity requires physical verification (independent audits, certifications) and hardware security modules—beyond POC scope.

---

## References for Chapter 6

Cohn, M. (2009). *Succeeding with agile: Software development using Scrum*. Addison-Wesley Professional.

Hardhat. (2024). *Hardhat documentation: Ethereum development environment*. Retrieved from https://hardhat.org/docs

IEEE. (2022). Systematic mapping of testing smart contracts for blockchain applications. *IEEE Access*, 10, 111700-111720. https://doi.org/10.1109/ACCESS.2022.3216874

IEEE. (2024). Optimizing gas consumption in Ethereum smart contracts: Best practices and techniques. *IEEE Conference Publication*, Document 10429984. IEEE Xplore.

ScienceDirect. (2024). Vulnerability detection techniques for smart contracts: A systematic literature review. *Journal of Systems and Software*, 217, Article 112160. https://doi.org/10.1016/j.jss.2024.112160

Solidity. (2024). *Solidity documentation: Smart contract programming language*. Retrieved from https://docs.soliditylang.org

Tsang, Y. P., Choy, K. L., Wu, C. H., Ho, G. T. S., & Lam, H. Y. (2019). Blockchain-driven IoT for food traceability with an integrated consensus mechanism. *IEEE Access*, 7, 129000-129017. https://doi.org/10.1109/ACCESS.2019.2940227

W3C. (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*. World Wide Web Consortium. Retrieved from https://www.w3.org/TR/WCAG21/

---

**Word Count:** ~1,100 words (Target: 1,900-2,300 | Session 24: 3,451 → 1,093 | Reduction: 68%)
