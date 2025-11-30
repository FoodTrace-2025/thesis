### Epic 5: Product Registration

**Priority:** 🔴 Must Have
**Estimated Time:** 12-16 hours (Smart Contract 4h + Backend Prerequisites 2-3h + Backend API 4-5h + Frontend 4-6h)
**Assigned:** Sam (Smart Contract), TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 3-5
**Dependencies:** Epic 2 (Company Wallets), Epic 3 Tier 1 (Wallet Encryption), Epic 4 (Component Library - Frontend only)

#### Epic Description

Enable producers to register harvested products on the blockchain with metadata (name, origin, harvest date). System automatically generates unique Product ID and QR code URL for product packaging. Uses company's custodial wallet to sign blockchain transactions server-side (no MetaMask required).

#### Business Value

- **Start of Supply Chain:** First step in food traceability journey
- **Proof of Authenticity:** Blockchain timestamp + immutable record
- **Producer Trust:** Build reputation through verified products
- **Consumer Value:** Foundation for consumer query interface

#### User Stories (High-Level)

- As a **producer**, I want to **register harvested products** with name, origin, harvest date
- As a **producer**, I want to **get unique Product ID** automatically assigned
- As a **producer**, I want to **see QR code URL** to generate QR for packaging
- As a **producer**, I want to **see blockchain confirmation** so I know it's permanent

#### Story Breakdown

| Story | Title | Assignee | Time | Dependencies | Status |
|-------|-------|----------|------|--------------|--------|
| 5.1 | ProductRegistry Smart Contract | Sam | 4h | Epic 3 Tier 1 | ✅ DONE |
| 5.2 | Backend Prerequisites | TaiSheng | 2-3h | Story 5.1 | TODO |
| 5.3 | Product Registration API | TaiSheng | 4-5h | Story 5.2 | TODO |
| 5.4 | Frontend Registration Form | YiLing | 4-6h | Story 5.3, Epic 4 | TODO (after Epic 4) |

**Story 5.1: ProductRegistry Smart Contract** ✅ DONE
- ProductRegistry.sol contract with PRODUCER_ROLE access control
- registerProduct() function, ProductRegistered event
- Deployed to Sepolia: `0x7e18dE7ce4B7C8A985BC03E192469BDf192a1646`
- 100% test coverage, QA review passed

**Story 5.2: Backend Prerequisites**
- Add Product model to Prisma schema
- Modify approve.ts to grant PRODUCER_ROLE on blockchain when approving PRODUCER companies
- Standardize environment variables
- Run database migrations

**Story 5.3: Product Registration API**
- POST /api/products/register endpoint using viem
- Server-side wallet decryption and transaction signing
- Database save with QR code URL generation
- Audit logging

**Story 5.4: Frontend Registration Form** (Blocked by Epic 4)
- Producer dashboard form using Epic 4 components
- Client-side validation, loading states, success modal

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This epic depends on Epic 2 (company wallets exist) and Epic 3 Tier 1 (wallet encryption working). Verify:

```bash
# Epic 3 Tier 1: Wallet encryption functions exist
ls src/lib/crypto/wallet-encryption.ts

# Epic 2: Company approval endpoint exists
ls src/pages/api/admin/companies/[id]/approve.ts
```

**Environment Setup (BEFORE starting Story 5.2):**

1. **Update contract address in .env.local:**
   ```bash
   # Replace placeholder with deployed address from Story 5.1
   NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS=0x7e18dE7ce4B7C8A985BC03E192469BDf192a1646
   ```

2. **Verify deployer private key available:**
   ```bash
   # PRIVATE_KEY in .env.local is the deployer wallet
   # This wallet has DEFAULT_ADMIN_ROLE on ProductRegistry contract
   # Needed to grant PRODUCER_ROLE to company wallets
   ```

3. **Copy contract ABI for backend use:**
   ```bash
   # ABI is at: artifacts/contracts/ProductRegistry.sol/ProductRegistry.json
   # Backend imports directly from this path
   ```

#### Acceptance Criteria (Epic Level)

**Smart Contract (ProductRegistry.sol):** ✅ DONE

- ✅ `ProductRegistry.sol` contract deployed to Sepolia testnet
- ✅ Contract verified on Etherscan (source code published)
- ✅ `registerProduct()` function accepts (name, origin, harvestDate) parameters
- ✅ ProductRegistered event emitted with (productId, producer address, name, timestamp)
- ✅ Role-based access control implemented (only PRODUCER_ROLE can register products)
- ✅ `grantProducerRole()` function for admin to grant roles
- ✅ Product struct stores (id, name, origin, harvestDate, producer, timestamp, exists)
- ✅ Input validation: name length > 0, harvestDate <= block.timestamp
- ✅ Unit tests achieve >70% code coverage (Hardhat + Chai)
- ✅ Function returns productId (auto-incremented uint256)

**Backend Prerequisites (Story 5.2):**

- ✅ Product model added to Prisma schema with all required fields
- ✅ Company approval (approve.ts) grants PRODUCER_ROLE on blockchain for PRODUCER companies
- ✅ Role granting uses deployer wallet (PRIVATE_KEY) to sign transaction
- ✅ Atomic operation: if role granting fails, entire approval fails
- ✅ Environment variables standardized (NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS)
- ✅ Database migration successful

**Backend API (POST /api/products/register):**

- ✅ NextAuth.js session validation (user must be authenticated)
- ✅ User role validation (only users with PRODUCER role can register)
- ✅ Company status validation (only APPROVED companies)
- ✅ Company wallet decryption using Epic 3 Tier 1 encryption (decryptWalletKey)
- ✅ Wallet decryption error handling (return 500 error with audit log entry)
- ✅ Server-side transaction signing using company custodial wallet (viem)
- ✅ Gas estimation before transaction submission
- ✅ Blockchain transaction submission with retry logic (3 attempts on network failure)
- ✅ Transaction receipt verification (wait for 1 block confirmation)
- ✅ Product metadata saved to database (off-chain)
- ✅ QR code URL generated: `https://foodtrace.app/trace/{blockchainId}`
- ✅ Transaction hash and productId returned to frontend
- ✅ Audit log entry created (action: PRODUCT_REGISTERED, userId, companyId, productId)

**Frontend (Producer Dashboard):** (Story 5.4 - After Epic 4)

- ✅ Product registration form rendered using Epic 4 components
- ✅ Form validation: name required, origin required, harvest date cannot be future
- ✅ Loading states shown during transaction submission
- ✅ Success confirmation with Product ID and QR code URL
- ✅ Error handling: wallet decryption failure, blockchain rejection
- ✅ Mobile-responsive form layout

#### Technical Approach

**Smart Contract (`contracts/ProductRegistry.sol`):** ✅ IMPLEMENTED

```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract ProductRegistry is AccessControl {
    bytes32 public constant PRODUCER_ROLE = keccak256("PRODUCER_ROLE");

    struct Product {
        uint256 id;
        string name;
        string origin;
        uint256 harvestDate;
        address producer;
        uint256 timestamp;
        bool exists;
    }

    uint256 public productCount;
    mapping(uint256 => Product) public products;

    event ProductRegistered(
        uint256 indexed productId,
        address indexed producer,
        string name,
        uint256 timestamp
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function registerProduct(
        string memory name,
        string memory origin,
        uint256 harvestDate
    ) public onlyRole(PRODUCER_ROLE) returns (uint256) {
        require(bytes(name).length > 0, "Name required");
        require(harvestDate <= block.timestamp, "Future date not allowed");

        productCount++;
        products[productCount] = Product({
            id: productCount,
            name: name,
            origin: origin,
            harvestDate: harvestDate,
            producer: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit ProductRegistered(productCount, msg.sender, name, block.timestamp);
        return productCount;
    }

    function grantProducerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(PRODUCER_ROLE, account);
    }

    // ... other functions (getProduct, productExists, etc.)
}
```

**Product Model (Prisma Schema):**

```prisma
model Product {
  id              String   @id @default(cuid())
  blockchainId    Int      @unique
  name            String
  origin          String
  harvestDate     DateTime
  companyId       String
  company         Company  @relation(fields: [companyId], references: [id])
  createdByUserId String
  createdBy       User     @relation(fields: [createdByUserId], references: [id])
  transactionHash String
  qrCodeUrl       String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([companyId])
  @@index([blockchainId])
}
```

**Company Approval with PRODUCER_ROLE Granting (approve.ts modification):**

```typescript
// In src/pages/api/admin/companies/[id]/approve.ts
import { createPublicClient, createWalletClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import ProductRegistryABI from '@/../artifacts/contracts/ProductRegistry.sol/ProductRegistry.json';

// After generating company wallet...
// Grant PRODUCER_ROLE on blockchain (only for PRODUCER companies)
if (company.type === 'PRODUCER') {
  const deployerAccount = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

  const walletClient = createWalletClient({
    account: deployerAccount,
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  const hash = await walletClient.writeContract({
    address: process.env.NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS as `0x${string}`,
    abi: ProductRegistryABI.abi,
    functionName: 'grantProducerRole',
    args: [walletAddress], // company's newly generated wallet
  });

  // Wait for confirmation
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });
}
```

**Backend API (`src/pages/api/products/register.ts`):**

```typescript
import { createPublicClient, createWalletClient, http, parseEventLogs } from 'viem';
import { sepolia } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { decryptWalletKey, getEncryptionKey } from '@/lib/crypto';
import ProductRegistryABI from '@/../artifacts/contracts/ProductRegistry.sol/ProductRegistry.json';

const registerSchema = z.object({
  name: z.string().min(1, "Name required").max(100),
  origin: z.string().min(1, "Origin required").max(100),
  harvestDate: z.string().refine((date) => new Date(date) <= new Date(), "Future date not allowed"),
});

export default async function handler(req, res) {
  // 1. Auth validation
  // 2. Role validation (PRODUCER only)
  // 3. Input validation with Zod

  // 4. Decrypt company wallet
  const encryptionKey = getEncryptionKey();
  const privateKey = decryptWalletKey(company.encryptedPrivateKey, encryptionKey);

  // 5. Create viem clients
  const account = privateKeyToAccount(privateKey as `0x${string}`);
  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL),
  });

  // 6. Estimate gas
  const gasEstimate = await publicClient.estimateContractGas({
    address: process.env.NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS as `0x${string}`,
    abi: ProductRegistryABI.abi,
    functionName: 'registerProduct',
    args: [name, origin, BigInt(harvestTimestamp)],
    account,
  });

  // 7. Submit transaction with retry
  const hash = await walletClient.writeContract({
    address: process.env.NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS as `0x${string}`,
    abi: ProductRegistryABI.abi,
    functionName: 'registerProduct',
    args: [name, origin, BigInt(harvestTimestamp)],
    gas: gasEstimate * 120n / 100n, // 20% buffer
  });

  // 8. Wait for receipt
  const receipt = await publicClient.waitForTransactionReceipt({ hash, confirmations: 1 });

  // 9. Parse event to get productId
  const logs = parseEventLogs({
    abi: ProductRegistryABI.abi,
    eventName: 'ProductRegistered',
    logs: receipt.logs,
  });
  const productId = Number(logs[0].args.productId);

  // 10. Save to database
  const qrCodeUrl = `https://foodtrace.app/trace/${productId}`;

  await prisma.product.create({
    data: {
      blockchainId: productId,
      name,
      origin,
      harvestDate: new Date(harvestDate),
      companyId: user.companyId,
      createdByUserId: user.id,
      transactionHash: hash,
      qrCodeUrl,
    },
  });

  // 11. Create audit log
  // 12. Return success response
  return res.status(200).json({ success: true, productId, transactionHash: hash, qrCodeUrl });
}
```

#### Dependencies

**Requires:**
- Epic 2 (Company Wallets) - Company custodial wallets must exist for transaction signing
- Epic 3 Tier 1 (Wallet Encryption) - Wallet decryption functions must work before product registration
- Epic 4 (Component Library) - Form components needed for frontend (Story 5.4 only)

**Blocks:**
- Epic 6 (Product Transfer) - Cannot transfer products until products exist
- Epic 7 (Supply Chain Tracking) - Cannot track products until products registered
- Epic 8 (IoT Simulator) - Cannot attach sensor data until products exist
- Epic 9 (Consumer Query) - Cannot query products until products registered

#### Environment Variables

```bash
# .env.local - Required for Epic 5

# RPC URL (existing from Epic 1)
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Deployer wallet (existing from Epic 1) - has DEFAULT_ADMIN_ROLE on contract
PRIVATE_KEY=0x...

# Wallet encryption key (existing from Epic 3)
WALLET_ENCRYPTION_KEY=...

# Contract address (Story 5.1 deployment)
NEXT_PUBLIC_PRODUCT_REGISTRY_ADDRESS=0x7e18dE7ce4B7C8A985BC03E192469BDf192a1646
```

#### Team Assignment

**Sam (4 hours - Smart Contract Lead):** ✅ COMPLETED

- ProductRegistry.sol contract implementation
- Smart contract unit tests (100% coverage achieved)
- Contract deployment to Sepolia and Etherscan verification

**TaiSheng (6-8 hours - Backend Lead):**

- Story 5.2: Backend Prerequisites (2-3 hours)
  - Add Product model to Prisma schema
  - Modify approve.ts to grant PRODUCER_ROLE for PRODUCER companies
  - Run database migration
  - Test role granting with contract

- Story 5.3: Product Registration API (4-5 hours)
  - POST /api/products/register route implementation
  - Server-side transaction signing with viem
  - Gas estimation and retry logic
  - Database save with QR code URL
  - Error handling and audit logging

**YiLing (4-6 hours - Frontend Lead):** (After Epic 4)

- Story 5.4: Producer registration form
  - Build form using Epic 4 components
  - Client-side validation
  - Loading states and success modal
  - Error handling UI

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| PRODUCER_ROLE granting fails during approval | Atomic operation - entire approval fails, admin retries |
| Company wallet doesn't have PRODUCER_ROLE | Story 5.2 ensures role is granted during approval |
| Wallet decryption fails | Error handling returns 500 with audit log, user sees "Contact admin" |
| Blockchain transaction rejected | Gas estimation + 20% buffer, retry logic (3 attempts) |
| Database and blockchain out of sync | Use atomic transaction pattern, audit logging for debugging |
| ethers.js code in story (wrong library) | All code samples updated to use viem (codebase standard) |
| Epic 4 not ready for frontend | Story 5.4 explicitly blocked until Epic 4 complete |

#### QR Code Strategy (Simplified)

**Epic 5 (Backend):**
- Generate QR code URL: `https://foodtrace.app/trace/{blockchainId}`
- Save URL to Product record in database
- Return URL to frontend

**Epic 5 (Frontend - Story 5.4):**
- Display QR code using `react-qr-code` React component
- QR code renders on client-side (no server-side generation needed)

**Epic 9 (Consumer Query):**
- Consumer scans QR code with phone camera
- Browser opens `https://foodtrace.app/trace/{blockchainId}`
- Page displays product trace history

---

**Last Updated:** 2025-11-30 (Story 5.1 completed, Epic rewritten for accuracy)
