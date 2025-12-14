# Abstract

Food supply chains face persistent transparency challenges, with traditional paper-based systems requiring days to trace product origins. The 2018 Walmart case demonstrated this problem: tracing mangoes took 6 days 18 hours using conventional methods. Meanwhile, 475 million small farms globally remain underserved by enterprise blockchain solutions that require consortium membership and technical expertise.

This thesis developed a proof-of-concept blockchain-based food supply chain traceability system addressing the research question: "How can blockchain technology be made accessible to mainstream users while preserving its core benefits of decentralization, transparency, and immutability?" The system implemented a 4-role supply chain model (Producer, Distributor, Retailer, Consumer) with wallet-free consumer access as the core accessibility innovation.

The implementation utilized Ethereum blockchain with Solidity smart contracts deployed to Sepolia testnet, a hybrid on-chain/off-chain data architecture balancing immutability with cost efficiency, and Next.js 14 for full-stack web development with TypeScript.

Development followed the BMAD methodology (Breakthrough Method of Agile AI-driven Development) over a 12-week sprint. Smart contracts employed test-driven development practices with the Hardhat framework, while iterative design validated user workflows across all supply chain roles.

Testing achieved 100% smart contract coverage (37 tests) and 236 total tests passing across all system layers. The system demonstrated 1.8-second average query performance, 95% QR code scanning success rate, and complete supply chain workflow validation from producer registration through consumer verification.

The proof-of-concept validates that Ethereum public blockchain can provide transparent, immutable traceability while addressing mainstream accessibility through wallet-free consumer patterns. Layer 2 solutions reduce costs to $0.01-0.26 per product, making blockchain traceability economically viable for small producers targeting premium markets.

---

## Keywords

Blockchain, Food Traceability, Supply Chain Management, Smart Contracts, Ethereum, Web3, QR Code
