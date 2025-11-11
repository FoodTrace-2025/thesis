# FoodTrace System Diagrams

This folder contains Mermaid diagrams for system architecture and business flow.

## Diagrams

### 1. Business Flow (`business-flow.md`)
- **Purpose**: Shows complete supply chain journey (Producer → Distributor → Retailer → Consumer)
- **Use for**: Understanding user workflows, explaining to non-technical stakeholders
- **Used in**: Thesis Chapter 1 (Introduction), Chapter 4 (Implementation)
- **Best for**: Kickoff meeting presentation, stakeholder demos

### 2. Technical Architecture (`technical-architecture.md`)
- **Purpose**: Shows complete technical stack (UI → Frontend → Backend → Blockchain/Database)
- **Use for**: Development reference, implementation decisions
- **Used in**: Thesis Chapter 3.4 (Architecture), Chapter 4 (Implementation)
- **Best for**: Technical deep-dives, professor questions

### 3. System Overview (`system-overview.md`)
- **Purpose**: High-level simplified view for presentations
- **Use for**: Kickoff meetings, demos, executive summaries
- **Used in**: Thesis Chapter 1.5 (Thesis Structure overview)
- **Best for**: Quick 2-minute overview

## Viewing Diagrams

### In VS Code:
1. Install "Markdown Preview Mermaid Support" extension
2. Right-click diagram file → "Open Preview"

### In GitHub:
- Mermaid renders automatically in markdown files

### Export as Image:
1. Use Mermaid Live Editor: https://mermaid.live/
2. Paste code → Export as PNG/SVG
3. Use in thesis document or presentations

### In Excalidraw:
1. Copy Mermaid code
2. Paste into Excalidraw canvas
3. Excalidraw will render it automatically
4. Adjust styling as needed

## Technical Stack Reference

Quick reference for version numbers (always use exact versions in diagrams):

**Frontend:**
- Next.js 14.2.15 (Pages Router)
- React 18
- TypeScript 5.8+
- Chakra UI v2

**Backend:**
- Node.js Server (Render.com)
- Wagmi v2 + Viem
- RainbowKit

**Blockchain:**
- Ethereum Sepolia Testnet
- Solidity ^0.8.20
- Hardhat + Chai/Mocha
- OpenZeppelin Contracts

**Database:**
- Supabase PostgreSQL
- Prisma ORM
- pgBouncer Connection Pooling

**Deployment:**
- Render.com (750h/month free tier)
- Node.js Server (NOT serverless)

## Last Updated
- Date: 2025-11-10
- Updated by: Sam Chou
- Purpose: Kickoff meeting preparation (November 11, 2025 at 15:00)
- Session: Diagram optimization for visual clarity

## Notes for Team

**When to use each diagram:**
- **Kickoff meeting**: Start with System Overview, then Business Flow, have Technical Architecture ready for questions
- **Development Phase (Weeks 3-9)**: Reference Technical Architecture for implementation details
- **Thesis Writing (Weeks 10-12)**: All three diagrams needed for different chapters
- **Demo/Defense**: Business Flow shows the user journey clearly

**Maintenance:**
- Update diagrams when architecture changes
- Keep version numbers current
- Export to images before thesis submission
- Commit diagram updates with clear commit messages
