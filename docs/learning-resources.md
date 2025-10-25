# Learning Resources - FoodTrace Thesis Project

**Last Updated:** 2025-10-24
**Purpose:** Comprehensive learning materials for blockchain, Web3, and academic research

This document contains all learning resources, tutorials, documentation links, and academic papers relevant to the FoodTrace thesis project.

---

## 🎓 Solidity & Smart Contract Development

### Primary Learning Path (Sam - Week 1)

**Cyfrin Updraft (HIGHLY RECOMMENDED)**

- **URL:** https://updraft.cyfrin.io/
- **Cost:** FREE
- **Time:** 10-15 hours (Week 1 target)
- **Focus Modules:**
  - "Simple Storage" - Basic Solidity syntax
  - "Fund Me" - Payable functions, withdrawal patterns
  - "Storage + Memory" - Gas optimization basics
  - "Events & Logs" - Event emission for trace records
  - **AccessControl patterns** - Role-based permissions (critical for 4-role system)

**Why Cyfrin Updraft:**

- Updated for Solidity ^0.8.20 (our version)
- Teaches Hardhat framework (our toolchain)
- Security-first approach
- Free, self-paced, comprehensive

### Reference Documentation

**Solidity Official Docs:**

- **URL:** https://docs.soliditylang.org/
- **Use For:** Language reference, syntax lookups
- **Key Sections:**
  - Solidity by Example
  - Security Considerations
  - Common Patterns

**OpenZeppelin Contracts:**

- **URL:** https://docs.openzeppelin.com/contracts/
- **Use For:** Battle-tested, audited smart contract libraries
- **Key Contracts for Our Project:**
  - `AccessControl.sol` - Role-based permissions (Producer, Distributor, Retailer)
  - `ReentrancyGuard.sol` - Prevent reentrancy attacks
  - `Pausable.sol` - Emergency stop mechanism
  - `Ownable.sol` - Contract ownership management

**Hardhat Documentation:**

- **URL:** https://hardhat.org/docs
- **Use For:** Testing, deployment, debugging
- **Key Sections:**
  - Testing with Chai/Mocha
  - Hardhat Network (local blockchain)
  - Deploying contracts
  - Verifying on Etherscan

### Security Resources

**Smart Contract Security Best Practices:**

- **URL:** https://consensys.github.io/smart-contract-best-practices/
- **Topics:**
  - Known attack patterns
  - Security tools
  - Recommended patterns

**Solidity Security Blog:**

- **URL:** https://blog.soliditylang.org/category/security/
- **Use For:** Latest security advisories

---

## ⚛️ Web3 Frontend Development

### For TaiSheng (Backend/Integration Lead) - Week 1-2

**Wagmi v2 Hooks:**

- **URL:** https://wagmi.sh/
- **Purpose:** React hooks for Ethereum (wallet connection, contract interactions)
- **Key Hooks:**
  - `useConnect` - Wallet connection
  - `useAccount` - User account info
  - `useReadContract` - Read smart contract data
  - `useWriteContract` - Write to smart contracts
  - `useWaitForTransaction` - Transaction confirmation

**RainbowKit:**

- **URL:** https://www.rainbowkit.com/
- **Purpose:** Beautiful wallet connection UI
- **Features:**
  - Pre-built wallet connection modal
  - Support for MetaMask, WalletConnect, Coinbase Wallet
  - Customizable themes

**Viem:**

- **URL:** https://viem.sh/
- **Purpose:** TypeScript Ethereum library (alternative to ethers.js)
- **Why Viem:**
  - Better TypeScript support
  - Smaller bundle size
  - Modern, clean API
  - Used by Wagmi v2 under the hood

### For YiLing (UI/UX Lead) - Week 1-2

**Basic Web3 Concepts:**

- **URL:** https://ethereum.org/en/developers/docs/intro-to-ethereum/
- **Topics:**
  - What is Ethereum?
  - Wallets and accounts
  - Gas fees
  - Transactions

**Web3 UX Best Practices:**

- **URL:** https://www.nngroup.com/articles/web3-blockchain-ux/
- **Topics:**
  - Wallet connection patterns
  - Transaction feedback
  - Error handling
  - Loading states

---

## 📚 Academic Research (For Literature Review - All Team Members - Week 10)

### Must-Cite Papers

**Springer 2025 - Systematic Literature Review:**

- **Title:** "Digital Transformation of Food Supply Chain Management Using Blockchain"
- **Why Important:** 50/50 split (24 papers Ethereum, 24 papers Hyperledger Fabric)
- **Use For:** Chapter 2.3 - Ethereum vs Hyperledger Fabric comparison
- **Key Finding:** Equal academic usage validates either choice for food traceability

**Walmart + IBM Food Trust Case Study:**

- **URL:** https://www.lfdecentralizedtrust.org/case-studies/walmart-case-study
- **Key Metric:** Traceability improved from 7 days → 2.2 seconds
- **Use For:** Chapter 1 - Introduction, demonstrating real-world impact
- **Blockchain:** Hyperledger Fabric (industry choice for B2B)

**IEEE 2024 - Hyperledger Fabric for Food Supply Chain:**

- **Focus:** Enterprise blockchain solutions
- **Use For:** Chapter 2.3 - Compare with Ethereum approach
- **Key Takeaway:** Hyperledger better for production B2B, Ethereum better for learning/POC

**ScienceDirect 2024 - Agrifood Supply Chain Optimization:**

- **Focus:** Hyperledger Fabric optimization techniques
- **Use For:** Chapter 6 - Discussion, future work recommendations

### Additional Research Resources

**OAMK Ruokajälki Project:**

- **URL:** https://www.oamk.fi/en/partnership/rdi-projects/ruokajalki
- **Relevance:** Local context for food traceability in Oulu region
- **Use For:** Chapter 1 - Introduction, connecting to regional initiatives

**Blockchain Council - Food Traceability:**

- **URL:** https://www.blockchain-council.org/blockchain/blockchain-in-food-supply-chain/
- **Use For:** Background reading, industry trends

**Google Scholar Search Terms:**

- "blockchain food traceability 2023-2025"
- "Ethereum food supply chain"
- "smart contracts agriculture"
- "IoT blockchain supply chain"

### Academic Writing Resources

**OAMK Thesis Template:**

- **Location:** `/home/kala/Downloads/Thesis-template-110625-Word.docx`
- **Use:** Mandatory template for final thesis submission
- **Style:** OAMK official styles (do not modify)

**Thesis Writing Guide:**

- **Location:** `@docs/planning/thesis-outline.md`
- **Content:** 942 lines, complete chapter breakdown, writing timeline (Weeks 10-12)

**Citation Management:**

- **Tool:** Mendeley or Zotero (recommended)
- **Style:** IEEE or ACM (confirm with supervisor at kickoff meeting)
- **Minimum:** 20-30 references expected for 60+ page thesis

---

## 🛠️ Additional Tools & Technologies

### Next.js 15 (App Router)

**Official Documentation:**

- **URL:** https://nextjs.org/docs
- **Key Topics:**
  - Pages Router (our choice)
  - API Routes (serverless backend)
  - Static Site Generation (SSG)
  - Image Optimization

**Why Pages Router (not App Router):**

- Simpler for thesis POC
- Better documentation/examples
- Team familiar with Pages Router
- More stable (App Router still evolving)

### Chakra UI v3

**Official Documentation:**

- **URL:** https://chakra-ui.com/
- **Use For:** UI component library
- **Key Components:**
  - Button, Input, Form components
  - Modal, Toast for user feedback
  - Responsive Grid, Flex layouts
  - Dark mode support (optional for future)

### Supabase

**Official Documentation:**

- **URL:** https://supabase.com/docs
- **Key Topics:**
  - PostgreSQL database
  - pgBouncer connection pooling (critical for Vercel!)
  - Row Level Security (RLS)
  - Realtime subscriptions

**Why Supabase:**

- Built-in connection pooling (prevents Vercel serverless issues)
- Free tier (500MB storage)
- Easy Prisma integration
- Built-in authentication (if needed later)

---

## 📅 Learning Timeline (Week-by-Week)

### Week 1 (Oct 31 - Nov 7): Foundations

**Sam (Blockchain Lead):**

- [ ] Complete Cyfrin Updraft "Simple Storage" (3 hours)
- [ ] Complete Cyfrin Updraft "Fund Me" (4 hours)
- [ ] Read OpenZeppelin AccessControl docs (2 hours)
- [ ] Deploy "Hello World" contract to Sepolia (1 hour)

**TaiSheng (Backend/Integration):**

- [ ] Read Wagmi v2 documentation (3 hours)
- [ ] Read Supabase + Prisma setup guide (2 hours)
- [ ] Setup local Supabase project (2 hours)
- [ ] Test wallet connection with RainbowKit (2 hours)

**YiLing (UI/UX Lead):**

- [ ] Read "Intro to Ethereum" (ethereum.org) (2 hours)
- [ ] Research Chakra UI v3 components (3 hours)
- [ ] Create Figma wireframes for 4 roles (4 hours)
- [ ] Study Web3 UX best practices (2 hours)

### Week 2 (Nov 8-14): Deep Dive

**All Team Members:**

- [ ] Read PRD (after PM agent creates it)
- [ ] Read Architecture document (after Architect creates it)
- [ ] Review Solidity security best practices
- [ ] Practice with testnet deployments

### Week 10 (Jan 3-9, 2026): Literature Review

**All Team Members:**

- [ ] Read Springer 2025 systematic review (must-cite)
- [ ] Read Walmart + IBM case study (must-cite)
- [ ] Find 5-10 additional papers (Google Scholar)
- [ ] Start writing Chapter 2 (Literature Review)

---

## 🎯 Learning Goals

### By End of Week 1

**Sam:**

- ✅ Understand Solidity basics (variables, functions, modifiers)
- ✅ Know how to write/run tests with Hardhat
- ✅ Deploy simple contract to Sepolia testnet
- ✅ Understand AccessControl patterns

**TaiSheng:**

- ✅ Understand wallet connection flow
- ✅ Know Wagmi hooks for read/write operations
- ✅ Setup Supabase with Prisma
- ✅ Understand serverless database pooling

**YiLing:**

- ✅ Understand blockchain basics (wallets, gas, transactions)
- ✅ Know Web3 UX patterns (wallet connection, transaction feedback)
- ✅ Familiar with Chakra UI v3 components
- ✅ Created initial wireframes

### By End of Week 2

**All Team Members:**

- ✅ Complete PRD/Architecture document review
- ✅ Understand full system architecture
- ✅ Ready to start Epic 1 implementation (Week 3)

---

## 📞 Where to Ask Questions

**Solidity/Smart Contracts:**

- Stack Overflow: #solidity tag
- Ethereum Stack Exchange: https://ethereum.stackexchange.com/
- Hardhat Discord: https://hardhat.org/discord
- BMAD Discord: https://discord.gg/gk8jAdXWmj

**Web3 Frontend:**

- Wagmi GitHub Discussions
- RainbowKit Discord
- Next.js Discord

**Academic Questions:**

- Thesis supervisor (after kickoff meeting)
- OAMK thesis office
- Team meetings (Mondays 14:00-15:00)

---

**Document Maintained By:** Sam Chou
**Last Review:** 2025-10-24
**Next Review:** After Week 1 learning completion
