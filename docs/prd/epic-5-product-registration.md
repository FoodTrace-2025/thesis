### Epic 5: Product Registration

**Priority:** 🔴 Must Have
**Estimated Time:** 12-15 hours (Smart Contract 4h + Backend 4-5h + Frontend 4-6h)
**Assigned:** Sam (Smart Contract), TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 3-5
**Dependencies:** Epic 2 (Company Wallets), Epic 3 Tier 1 (Wallet Encryption), Epic 4 (Component Library)

#### Epic Description

Enable producers to register harvested products on the blockchain with metadata (name, origin, harvest date, certification, photos). System automatically generates unique Product ID and QR code for product packaging. Uses company's custodial wallet to sign blockchain transactions server-side (no MetaMask required).

#### Business Value

- **Start of Supply Chain:** First step in food traceability journey
- **Proof of Authenticity:** Blockchain timestamp + immutable record
- **Producer Trust:** Build reputation through verified products
- **Consumer Value:** Foundation for consumer query interface

#### User Stories (High-Level)

- As a **producer**, I want to **register harvested products** with name, origin, harvest date
- As a **producer**, I want to **upload product photos** so consumers can see what I harvested
- As a **producer**, I want to **specify organic certification** so consumers trust my claims
- As a **producer**, I want to **get unique Product ID** automatically assigned
- As a **producer**, I want to **download QR code** to print and attach to packaging
- As a **producer**, I want to **see blockchain confirmation** so I know it's permanent

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This epic depends on Epic 2 (company wallets exist), Epic 3 Tier 1 (wallet encryption working), and Epic 4 (form components available). Verify:

```bash
# Epic 3 Tier 1: Wallet encryption functions exist
src/lib/crypto/wallet-encryption.ts (encryptWalletKey, decryptWalletKey)

# Epic 4: Component Library components available
src/components/ui/Input.tsx
src/components/ui/Button.tsx
src/components/forms/ValidationWrapper.tsx
```

**Team Setup Required (30 minutes together - BEFORE starting Epic 5):**

- ✅ **Create Supabase Storage bucket for product images**:
  - Go to Supabase Dashboard → Storage → Create new bucket
  - Bucket name: `product-images`
  - Public bucket: `true` (images need to be publicly accessible for consumer query)
  - File size limit: 5 MB (prevent abuse)
  - Allowed MIME types: `image/jpeg, image/png, image/webp`
  - Copy bucket URL pattern: `https://[project-id].supabase.co/storage/v1/object/public/product-images/`
  - Add bucket name to .env.local: `SUPABASE_STORAGE_BUCKET=product-images`
- ✅ **Deploy ProductRegistry.sol contract to Sepolia testnet**:
  - Sam deploys contract using `npx hardhat run scripts/deploy-product-registry.ts --network sepolia`
  - Verify contract on Etherscan using `npx hardhat verify CONTRACT_ADDRESS --network sepolia`
  - Add contract address to .env.local: `PRODUCT_REGISTRY_CONTRACT=0x...`
  - Share contract address and ABI with TaiSheng for backend integration
- ✅ **Test QR code generation library**:
  - Install react-qr-code: `npm install react-qr-code`
  - Verify QR code generates correctly with test Product ID
  - QR code format: `https://foodtrace.app/trace/{productId}` (Epic 9 consumer query URL)

**Developer Setup (After Prerequisites):**

- No additional external accounts needed (uses Epic 1 Supabase/Alchemy credentials)
- ProductRegistry contract ABI copied to `src/contracts/ProductRegistry.json`

#### Acceptance Criteria (Epic Level)

**Smart Contract (ProductRegistry.sol):**

- ✅ `ProductRegistry.sol` contract deployed to Sepolia testnet
- ✅ Contract verified on Etherscan (source code published)
- ✅ `registerProduct()` function accepts (name, origin, harvestDate) parameters
- ✅ ProductRegistered event emitted with (productId, producer address, name, timestamp)
- ✅ Role-based access control implemented (only PRODUCER_ROLE can register products)
- ✅ Product struct stores (id, name, origin, harvestDate, producer, timestamp, exists)
- ✅ Input validation: name length > 0, harvestDate <= block.timestamp
- ✅ Unit tests achieve >70% code coverage (Hardhat + Chai)
- ✅ Gas cost optimized: <100k gas per product registration
- ✅ Function returns productId (auto-incremented uint256)

**Backend API (POST /api/products/register):**

- ✅ NextAuth.js session validation (user must be authenticated)
- ✅ User role validation (only users with PRODUCER role can register)
- ✅ Company wallet decryption using Epic 3 Tier 1 encryption (decryptWalletKey)
- ✅ Wallet decryption error handling (return 500 error with audit log entry)
- ✅ Server-side transaction signing using company custodial wallet
- ✅ Gas estimation before transaction submission (prevent out-of-gas errors)
- ✅ Nonce management for concurrent transaction handling
- ✅ Blockchain transaction submission with retry logic (3 attempts on network failure)
- ✅ Transaction receipt verification (wait for 1 block confirmation)
- ✅ Product metadata saved to Supabase Product table (off-chain)
- ✅ Image upload to Supabase Storage `product-images` bucket
- ✅ QR code SVG generated (react-qr-code) with URL `https://foodtrace.app/trace/{productId}`
- ✅ QR code saved to Supabase Storage for download
- ✅ Transaction hash and productId returned to frontend
- ✅ Audit log entry created (action: PRODUCT_REGISTERED, userId, companyId, productId)

**Frontend (Producer Dashboard):**

- ✅ Product registration form rendered using Epic 4 components (Input, Button, ValidationWrapper)
- ✅ Form validation: name required, origin required, harvest date cannot be future
- ✅ Image upload component with drag-and-drop and file preview
- ✅ Image file size validation (<5 MB, show error if exceeded)
- ✅ Loading states shown during transaction submission (spinner + "Submitting to blockchain...")
- ✅ Gas cost estimation displayed before submission (estimated cost in ETH)
- ✅ Success confirmation modal with Product ID and QR code download button
- ✅ QR code displayed visually for user verification
- ✅ Error handling: wallet decryption failure (show "Contact admin" message)
- ✅ Error handling: blockchain rejection (show transaction error details)
- ✅ Error handling: image upload failure (allow retry without resubmitting form)
- ✅ Mobile-responsive form layout (works on phone/tablet/desktop)

#### Technical Approach

**Smart Contract (`contracts/ProductRegistry.sol`):**

```solidity
contract ProductRegistry is AccessControl {
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
}
```

**Backend API (`src/app/api/products/register/route.ts`):**

```typescript
export async function POST(req: Request) {
  const session = await getServerSession();
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: { company: true },
  });

  // Decrypt company wallet (custodial)
  const privateKey = decrypt(
    user.company.encryptedPrivateKey,
    process.env.ENCRYPTION_KEY
  );
  const wallet = new ethers.Wallet(privateKey, provider);

  // Sign transaction server-side
  const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);
  const tx = await contract.registerProduct(
    productData.name,
    productData.origin,
    Math.floor(new Date(productData.harvestDate).getTime() / 1000)
  );

  const receipt = await tx.wait();
  const productId = receipt.events.ProductRegistered.productId;

  // Save metadata to database
  await db.product.create({
    data: {
      blockchainId: productId,
      name: productData.name,
      imageUrl: uploadedImageUrl,
      companyId: user.companyId,
      createdByUserId: user.id,
      transactionHash: receipt.transactionHash,
    },
  });

  return Response.json({ success: true, productId });
}
```

**Frontend Form (`src/app/producer/register/page.tsx`):**

```typescript
<form onSubmit={handleRegisterProduct}>
  <Input name="name" label="Product Name" required />
  <Input name="origin" label="Origin Location" required />
  <Input
    type="date"
    name="harvestDate"
    label="Harvest Date"
    max={today}
    required
  />
  <Textarea name="certification" label="Organic Certification" />
  <ImageUpload name="photo" label="Product Photo" />
  <Button type="submit" loading={isPending}>
    Register Product
  </Button>
</form>
```

#### Dependencies

**Requires:**
- Epic 2 (Company Wallets) - Company custodial wallets must exist for transaction signing
- Epic 3 Tier 1 (Wallet Encryption) - Wallet decryption functions must work before product registration
- Epic 4 (Component Library) - Form components (Input, Button, ValidationWrapper) needed for frontend

**Blocks:**
- Epic 6 (Product Transfer) - Cannot transfer products until products exist
- Epic 7 (Supply Chain Tracking) - Cannot track products until products registered
- Epic 8 (IoT Simulator) - Cannot attach sensor data until products exist
- Epic 9 (Consumer Query) - Cannot query products until products registered

**Epic 11 Clarification (QR Code Functionality):**
- **Epic 5 generates QR codes** - QR code SVG created when product is registered (react-qr-code library)
- **Epic 11 handles QR scanning** - Consumer scans QR code with phone camera to view product trace
- QR code URL format: `https://foodtrace.app/trace/{productId}` (Epic 9 consumer query route)

#### Team Assignment

**Sam (4 hours - Smart Contract Lead):**

- ProductRegistry.sol contract implementation (2.5 hours)
  - Write Product struct, registerProduct() function, ProductRegistered event
  - Implement role-based access control (PRODUCER_ROLE)
  - Add input validation (name length, harvest date validation)
- Smart contract unit tests (1 hour)
  - Test registerProduct() success cases
  - Test role-based access control (non-producer cannot register)
  - Test input validation (future dates rejected, empty names rejected)
  - Achieve >70% code coverage
- Contract deployment to Sepolia and Etherscan verification (0.5 hours)

**TaiSheng (4-5 hours - Backend Lead):**

- Product registration API endpoint (3 hours)
  - POST /api/products/register route implementation
  - NextAuth.js session validation and role checking
  - Company wallet decryption using Epic 3 Tier 1 functions
  - Server-side transaction signing with ethers.js
  - Gas estimation and nonce management
  - Transaction submission with retry logic (3 attempts)
- Supabase integration (1.5 hours)
  - Product metadata save to database
  - Image upload to Supabase Storage `product-images` bucket
  - QR code generation using react-qr-code
  - QR code save to Supabase Storage
- Error handling and audit logging (0.5 hours)

**YiLing (4-6 hours - Frontend Lead):**

- Producer dashboard page scaffold (1 hour)
  - Create /producer/register page route
  - Add navigation link in producer dashboard
- Product registration form (2-3 hours)
  - Build form using Epic 4 components (Input, Button, ValidationWrapper)
  - Implement client-side validation (name required, date validation)
  - Add image upload component with drag-and-drop
  - Add file size validation (<5 MB)
- Transaction flow UI (2 hours)
  - Loading states during transaction submission
  - Gas cost estimation display
  - Success modal with Product ID and QR code
  - QR code download button
  - Error handling UI (wallet errors, blockchain errors, upload errors)

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Wallet decryption fails | Error handling returns 500 with audit log entry, show "Contact admin" message to user |
| Blockchain transaction rejected | Gas estimation before submission, nonce management, retry logic (3 attempts), show transaction error details to user |
| Image upload to Supabase fails | Make image upload optional field, allow retry without resubmitting entire form, show warning but allow product registration |
| Form validation bypassed (client-side) | Server-side validation in API route enforces all rules (name length, date validation, role checking) |
| Gas cost exceeds budget (>100k gas) | Optimize contract (remove unnecessary storage, use events for logs), benchmark tests verify gas usage |
| QR code generation fails | Error handling with fallback: save product but mark QR as "pending", allow regeneration later |
| Supabase Storage bucket not created | User prerequisite checklist ensures bucket created before Epic 5 starts, fail fast with clear error message |
| Contract not deployed to Sepolia | User prerequisite checklist ensures Sam deploys contract before TaiSheng/YiLing start backend/frontend |
| Epic 4 components not ready | Epic 4 runs parallel with Epic 3 and completes by end of Week 4, Epic 5 starts Week 5 after Epic 4 done |
| Concurrent transactions (nonce conflict) | Ethers.js nonce management (getTransactionCount), transaction queue if needed |
| Image file too large (>5 MB) | Client-side file size validation before upload, server-side validation rejects files >5 MB |
| Producer uploads inappropriate images | Manual moderation by platform admin (defer to post-MVP), acceptable for thesis POC |
