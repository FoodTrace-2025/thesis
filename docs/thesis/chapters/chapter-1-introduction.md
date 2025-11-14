# Chapter 1: INTRODUCTION

## 1.1 Background

Blockchain technology, introduced by Nakamoto (2008) with Bitcoin, has evolved beyond cryptocurrency to enable transparent, immutable record-keeping through smart contracts—self-executing programs deployed on decentralized networks. While blockchain's cryptographic guarantees (immutability, transparency, Byzantine fault tolerance) theoretically address supply chain traceability challenges, practical adoption faces significant barriers: user experience complexity, transaction costs, and scalability limitations (Buterin, 2014; Wood, 2014).

Food supply chains exemplify these challenges. Traditional centralized systems rely on intermediaries and paper-based tracking, creating information asymmetries and slow response times. Walmart's 2016 mango traceability experiment required nearly seven days using conventional paper-based methods (Kamath, 2018). After implementing IBM Food Trust on Hyperledger Fabric, the same query completed in 2.2 seconds (Kamath, 2018; Hyperledger Foundation case study, 2019)—demonstrating blockchain's technical capability for rapid consensus across distributed stakeholders.

However, existing blockchain supply chain implementations face a critical trade-off between accessibility and decentralization. Enterprise solutions like IBM Food Trust provide user-friendly interfaces but rely on permissioned blockchains controlled by centralized gatekeepers, undermining public verifiability (Hyperledger Foundation case study, 2019). Conversely, public blockchain applications (Ethereum DApps) offer true decentralization but suffer from poor user experience—requiring wallet management, cryptocurrency for transaction fees, and technical expertise that excludes mainstream users (Consensys, 2023). This creates a "crypto-native vs mainstream user" divide limiting adoption beyond technical enthusiasts.

### Research Gap

Current research lacks solutions balancing transparency benefits of public blockchains with accessibility requirements for mass adoption. Ellahi et al.'s (2024) systematic review analyzing 60 blockchain food supply chain frameworks identifies underexplored applications including small producer financing, food donation systems, and humanitarian concerns, revealing an enterprise-dominant implementation focus in existing research. Moreover, wallet-based access remains the dominant pattern, creating adoption barriers for end consumers who simply want to verify product authenticity without installing cryptocurrency software.

This thesis addresses this gap by demonstrating how Ethereum public blockchain can provide transparent supply chain tracking while enabling wallet-free consumer access through hybrid architecture: critical data on-chain (product identity, ownership, timestamps), metadata off-chain (PostgreSQL), cryptographically linked via SHA-256 hashes. This approach targets small-scale producers—the 570 million farms globally (FAO, 2023) underserved by enterprise consortium models.

---

## 1.2 Problem Statement

The central problem addressed is: **How can blockchain technology be made accessible to mainstream users while preserving its core benefits of decentralization, transparency, and immutability?**

This manifests in food supply chain traceability through interconnected challenges: (1) User experience barriers—cryptocurrency wallet setup requires seed phrase management, network configuration, and irrecoverable key storage that deters mainstream adoption (academic research analyzing wallet UX identifies these as primary abandonment factors); (2) Cost-prohibitive transaction fees—Ethereum mainnet gas costs averaged $0.20-$2 per transaction in early 2025 (Crypto.com Gas Dashboard, 2025), though peak congestion historically reached $2-10, exceeding small producer margins; (3) Oracle problem—blockchain ensures data immutability but cannot verify off-chain data accuracy ("garbage in, garbage out"); and (4) Platform selection complexity—when to use public blockchain (Ethereum) vs permissioned alternatives (Hyperledger Fabric).

---

## 1.3 Objectives & Research Questions

### 1.3.1 Main Objective

**"Design, implement, and evaluate a proof-of-concept blockchain-based food traceability system demonstrating how Ethereum smart contracts can provide transparent, immutable supply chain tracking while addressing mainstream accessibility through wallet-free consumer access and hybrid data architecture."**

This objective emphasizes: (1) technical demonstration (smart contracts, Web3 architecture, hybrid storage), (2) accessibility innovation (wallet-free pattern), (3) real-world validation (4-role supply chain: Producer → Distributor → Retailer → Consumer), and (4) critical evaluation (performance analysis, limitations documentation).

### 1.3.2 Specific Objectives

This thesis implements: Solidity smart contracts with role-based access control (OpenZeppelin patterns) deployed to Ethereum Sepolia testnet; wallet-free consumer query interface enabling QR code product verification without cryptocurrency wallets; hybrid data architecture (on-chain: product ID, ownership, timestamps; off-chain: metadata in PostgreSQL/Supabase); Next.js Web3 application with Wagmi v2 integration for 4 supply chain roles; IoT sensor simulation pattern (temperature/humidity monitoring architecture without physical hardware); and comparative platform analysis (Ethereum vs Hyperledger Fabric trade-offs for food traceability).

### 1.3.3 Research Questions

**RQ1: Technical Suitability**
_How suitable is Ethereum blockchain for food supply chain traceability in proof-of-concept implementations?_

**RQ2: Comparative Analysis**
_What are the technical advantages and limitations of blockchain-based traceability compared to traditional centralized database approaches?_

**RQ3: Transparency vs Privacy Trade-offs**
_How can blockchain applications balance public verification requirements with business data privacy needs?_

**RQ4: Accessibility Innovation**
_How can user experience challenges (wallet management, transaction complexity) be addressed to enable broader blockchain adoption?_

**RQ5: Small Producer Feasibility**
_What is the feasibility of deploying blockchain traceability for small-scale producers, and what barriers exist?_

---

## 1.4 Scope & Limitations

This **proof-of-concept (POC)** system uses Ethereum Sepolia testnet (not mainnet—zero real costs), Next.js 14.2.15 + React + TypeScript frontend, Solidity ^0.8.20 smart contracts with Hardhat framework, and Supabase (PostgreSQL) for off-chain metadata. The simplified 4-role supply chain model (Producer, Distributor, Retailer, Consumer) focuses on one product category for demonstration.

**Key limitations acknowledged:** Testnet deployment means gas costs estimated not experienced; IoT simulation without physical sensors (no MQTT, hardware, edge computing); limited scalability testing (3-wallet scenario, not high-volume production); no formal security audit or enterprise system integration; 12-week timeline prevents long-term deployment validation. These limitations are justified by educational focus, budget constraints (zero-cost requirement), and time constraints appropriate for bachelor's thesis scope. Detailed limitation implications discussed in Chapter 6.

---

## 1.5 Thesis Structure

This thesis progresses through seven chapters: **Chapter 1** (current) establishes blockchain technology context, research problem, and objectives. **Chapter 2** reviews literature on blockchain fundamentals, Ethereum vs Hyperledger Fabric, supply chain implementations, IoT integration, and Web3 UX patterns, synthesizing the Springer (2025) systematic review's finding of equal academic adoption (24 Ethereum, 24 Hyperledger papers). **Chapter 3** explains BMAD methodology, platform selection justification (why Ethereum for POC despite Hyperledger's enterprise advantages), technical architecture design, and testing approach. **Chapter 4** details smart contract implementation (Solidity + OpenZeppelin), backend development (Next.js API routes, Wagmi v2, Supabase), and frontend interfaces (4-role dashboards, QR codes, responsive design). **Chapter 5** presents test results (>70% coverage target), performance analysis (gas costs, transaction times, query response), user acceptance testing, and comparative analysis vs traditional systems. **Chapter 6** interprets results, evaluates blockchain advantages, acknowledges limitations (scalability, oracle problem, GDPR conflicts), and recommends production deployment strategies. **Chapter 7** answers research questions, positions technical contributions within field gaps identified by Springer review, and proposes future work (Layer 2 scaling, real IoT sensors, Hyperledger migration for enterprise scenarios).

---

## References for Chapter 1

Buterin, V. (2014). _Ethereum: A next-generation smart contract and decentralized application platform_. Ethereum Foundation. https://ethereum.org/whitepaper

Consensys. (2023). _Web3 User Research: Barriers to Blockchain Adoption_. Consensys Research Reports.

Crypto.com. (2025). _Ethereum Gas Tracker Dashboard_. Retrieved from https://crypto.com/price/ethereum-gas

Food and Agriculture Organization (FAO). (2023). _Small family farms country factsheet_. Retrieved from https://www.fao.org/family-farming

Hyperledger Foundation. (2019). _Walmart and IBM Food Trust Case Study_. Hyperledger Foundation Case Studies. Retrieved from https://www.hyperledger.org/case-studies/walmart

Kamath, R. (2018). Food traceability on blockchain: Walmart's pork and mango pilots with IBM. _The Journal of the British Blockchain Association_, 1(1), 1-12. https://doi.org/10.31585/jbba-1-1-(10)2018

Nakamoto, S. (2008). _Bitcoin: A peer-to-peer electronic cash system_. https://bitcoin.org/bitcoin.pdf

Springer. (2025). Digital transformation of food supply chain management using blockchain: A systematic literature review. _Business & Information Systems Engineering_. https://doi.org/10.1007/s12599-025-00948-0

Wood, G. (2014). _Ethereum: A secure decentralised generalised transaction ledger_. Ethereum Foundation. https://ethereum.github.io/yellowpaper/paper.pdf

---

**Word Count:** ~1,210 words (Target: 1,200 | Original: 4,271 | Reduction: 72%)
