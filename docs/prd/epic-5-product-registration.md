### Epic 5: Product Registration

**Priority:** 🔴 Must Have
**Estimated Time:** 12-15 hours (Smart Contract 4h + Backend 4-5h + Frontend 4-6h)
**Assigned:** Sam (Smart Contract), TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 3-5
**Dependencies:** Epic 2 (Company Management), Epic 3 Tier 1 (Security)

#### Epic Description

Enable producers to register harvested products on the blockchain with metadata (name, origin, harvest date, certification, photos). System automatically generates unique Product ID and QR code. Uses company's custodial wallet to sign blockchain transactions server-side (no MetaMask required).

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

#### Acceptance Criteria (Epic Level)

**Smart Contract:**

- ✅ `ProductRegistry.sol` contract deployed to Sepolia
- ✅ `registerProduct()` function accepts (name, origin, harvestDate, certification)
- ✅ ProductRegistered event emitted with productId, producer address, timestamp
- ✅ Role-based access control (only PRODUCER role can register)
- ✅ Product struct stores blockchain data
- ✅ Unit tests >70% coverage
- ✅ Gas cost <100k gas per registration

**Backend API:**

- ✅ `POST /api/products/register` endpoint
- ✅ Server-side wallet decryption and transaction signing
- ✅ Product metadata saved to Supabase (off-chain)
- ✅ Image upload to Supabase Storage
- ✅ QR code auto-generated (Epic 11 integration)
- ✅ Transaction hash returned to frontend

**Frontend:**

- ✅ Product registration form (simple, mobile-responsive)
- ✅ Form validation (harvest date cannot be future, name required)
- ✅ Image upload component with preview
- ✅ Loading states (transaction pending)
- ✅ Success confirmation with Product ID
- ✅ Error handling (wallet decryption failure, blockchain rejection)

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

**Requires:** Epic 3 Tier 1 (wallet encryption), Epic 2 (company wallets exist)
**Blocks:** Epic 6, 7, 8, 11 (all depend on products existing)

#### Team Assignment

**Sam (4 hours):**

- ProductRegistry.sol contract (3 hours)
- Unit tests with Hardhat (1 hour)

**TaiSheng (3 hours):**

- Product registration API (2 hours)
- Wallet decryption + transaction signing (1 hour)

**YiLing (2-3 hours):**

- Producer dashboard page (1 hour)
- Product registration form (1-2 hours)

#### Risks & Mitigations

| Risk                            | Mitigation                                           |
| ------------------------------- | ---------------------------------------------------- |
| Wallet decryption fails         | Error handling, retry logic, log to audit trail      |
| Blockchain transaction rejected | Gas estimation, nonce management, show error to user |
| Image upload fails              | Optional field, show warning, allow retry            |
| Form validation bypassed        | Server-side validation in API route                  |
