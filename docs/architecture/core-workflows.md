# Core Workflows (User Flows & Business Logic)

**Purpose:** Define key user workflows, transaction flows, and business use cases.

---

## Workflow Overview

**5 Core Workflows:**
1. **Producer Registration Workflow** - Register product on blockchain
2. **Product Transfer Workflow** - Transfer ownership (Producer → Distributor → Retailer)
3. **Consumer Query Workflow** - Scan QR code, view product journey (wallet-free)
4. **IoT Sensor Recording Workflow** - Generate/record temperature data, trigger alerts
5. **Company Onboarding Workflow** - Apply for company account, approve/reject

---

## Workflow 1: Producer Registration

**Actors:** Producer (farm manager)
**Goal:** Register new product on blockchain with QR code generation

**Steps:**

1. **Login** (NextAuth.js session check)
   - Email + password authentication
   - Role validation (PRODUCER only)

2. **Navigate to Registration Form**
   - URL: `/producer/register`
   - Multi-step form loads

3. **Fill Product Details** (5 steps)
   - Step 1: Basic info (name, origin, harvest date)
   - Step 2: Description, category
   - Step 3: Image upload (optional, max 5MB)
   - Step 4: Certification (optional, organic/fair trade)
   - Step 5: Review & confirm

4. **Submit Registration**
   - Frontend: `POST /api/products/register`
   - Backend flow:
     a. Validate input (Zod schema)
     b. Upload image to Supabase Storage (if provided)
     c. Decrypt company custodial wallet (AES-256)
     d. Sign blockchain transaction (ProductRegistry.registerProduct)
     e. Submit transaction to Sepolia testnet
     f. Wait for block confirmation (~12-15 seconds)
     g. Save metadata to PostgreSQL (Prisma)
     h. Generate QR code (react-qr-code)
     i. Upload QR code to Supabase Storage
     j. Return success response

5. **Display Confirmation**
   - Show blockchain transaction hash
   - Display QR code (256×256px, Level H error correction)
   - Download QR code buttons (PNG, SVG)
   - Link to product details page

**Success Criteria:**
- ✅ Product registered on blockchain (immutable proof)
- ✅ Metadata saved to database (fast queries)
- ✅ QR code generated and downloadable
- ✅ Producer can view product on dashboard

**Failure Scenarios:**
- ❌ Image upload fails → Show error, allow retry
- ❌ Blockchain transaction reverts → Show error, rollback database
- ❌ Transaction timeout (>30s) → Show warning, continue polling

---

## Workflow 2: Product Transfer

**Actors:** Producer → Distributor OR Distributor → Retailer
**Goal:** Transfer product ownership, trigger notification

**Steps:**

1. **Initiate Transfer** (Current owner)
   - Navigate to product details page
   - Click "Transfer Product" button
   - Enter new owner's wallet address OR scan QR code

2. **Submit Transfer**
   - Frontend: `POST /api/products/:id/transfer`
   - Backend flow:
     a. Validate current owner (session.user.companyId === product.companyId)
     b. Decrypt custodial wallet
     c. Call ProductRegistry.transferOwnership(productId, newOwnerAddress)
     d. Wait for blockchain confirmation
     e. Update database ownership (Prisma)
     f. Send email notification to new owner (SendGrid)
     g. Return success response

3. **New Owner Receives Notification**
   - Email: "Product transferred to you"
   - Click link → Navigate to `/distributor/receive`
   - Scan QR code to confirm receipt

4. **Confirm Receipt** (New owner)
   - Frontend: Scan QR code (html5-qrcode)
   - Backend: `POST /api/trace/add` (action: "RECEIVED")
   - Add trace record to blockchain + database
   - Show confirmation toast

**Success Criteria:**
- ✅ Ownership transferred on blockchain
- ✅ Database updated with new owner
- ✅ Email notification sent
- ✅ Trace record added ("RECEIVED")

**Failure Scenarios:**
- ❌ Invalid new owner address → Show error, validate address
- ❌ Blockchain transaction fails → Show error, rollback database
- ❌ Email delivery fails → Log warning, continue (email not critical)

---

## Workflow 3: Consumer Query (Wallet-Free)

**Actors:** Consumer (end customer)
**Goal:** Scan QR code, view product journey WITHOUT wallet

**Steps:**

1. **Scan QR Code**
   - Consumer sees QR code on product packaging
   - Opens camera app, scans QR code
   - Redirected to: `https://foodtrace.onrender.com/consumer/product/:id`

2. **Fetch Product Data** (Backend)
   - Frontend: `GET /api/products/:id` (no authentication required)
   - Backend flow:
     a. Query database for metadata (Prisma)
     b. Query blockchain for immutable data (Viem publicClient, read-only RPC)
     c. Merge on-chain + off-chain data
     d. Return complete product journey JSON

3. **Display Product Journey**
   - **Product Header:** Name, origin, image, producer name
   - **Journey Timeline:** Complete supply chain history
     - Product registered (Producer, Nov 15)
     - Received by distributor (Distributor, Nov 16)
     - Quality check passed (Distributor, Nov 16)
     - Shipped to retailer (Distributor, Nov 17)
     - Stocked in store (Retailer, Nov 18)
     - Sold (Retailer, Nov 19)
   - **Temperature Chart:** Sensor data over time (if available)
   - **Certifications:** Organic badge (if certified)
   - **Blockchain Verification:** Link to Etherscan transaction

4. **Optional: Verify on Blockchain**
   - Consumer clicks "Verify on Blockchain" button
   - Opens Etherscan in new tab: `https://sepolia.etherscan.io/tx/{txHash}`
   - Consumer sees raw blockchain data (trustless verification)

**Success Criteria:**
- ✅ Consumer can view product journey WITHOUT wallet
- ✅ QR code scan takes <5 seconds (camera open → page load)
- ✅ Product data loads in <2 seconds
- ✅ Blockchain verification link works (Etherscan opens)

**Failure Scenarios:**
- ❌ QR code scan fails → Show manual product ID input
- ❌ Product not found (404) → Show error, suggest scanning again
- ❌ Blockchain query fails → Show cached database data, warning

---

## Workflow 4: IoT Sensor Recording

**Actors:** Admin (IoT simulator) OR Automated sensor
**Goal:** Record temperature data, trigger alerts if threshold exceeded

**Steps:**

1. **Generate Sensor Data**
   - Admin navigates to `/admin/iot-simulator`
   - Selects product from dropdown
   - Selects scenario (Normal, Warning, Critical)
   - Clicks "Generate Data" button

2. **Submit Sensor Data**
   - Frontend: `POST /api/iot/simulate`
   - Backend flow:
     a. Validate admin role
     b. Generate sensor data based on scenario:
        - Normal: temp 2-4°C, humidity 70-75%
        - Warning: temp 8-10°C, humidity 75-82%
        - Critical: temp >10°C, humidity 85-95%
     c. Determine alert level (temperature threshold)
     d. If CRITICAL: Call SensorData.addSensorData() (blockchain)
     e. If WARNING/CRITICAL: Send email notification to product owner
     f. Save detailed log to database (with `isSimulated: true` flag)
     g. Return sensor reading response

3. **Display Confirmation**
   - Show sensor reading (temperature, humidity, alert level)
   - Show "Email notification sent" (if WARNING/CRITICAL)
   - Show blockchain transaction hash (if CRITICAL)

4. **Product Owner Receives Alert Email**
   - Email subject: "🚨 CRITICAL Temperature Alert"
   - Email body: "Product [name] exceeded safe temperature: [temp]°C"
   - Link to product details page

**Success Criteria:**
- ✅ Sensor data recorded to database (all readings)
- ✅ CRITICAL alerts stored on blockchain (immutable proof)
- ✅ Email notifications sent for WARNING/CRITICAL
- ✅ Admin can view sensor history on dashboard

**Failure Scenarios:**
- ❌ Blockchain transaction fails → Log warning, continue (database has data)
- ❌ Email delivery fails → Log warning, continue (not critical)

---

## Workflow 5: Company Onboarding

**Actors:** New company (producer/distributor/retailer) + Platform Admin
**Goal:** Apply for company account, approve/reject, generate custodial wallet

**Steps:**

1. **Company Application**
   - Navigate to `/register`
   - Fill company details (name, email, type, contact info)
   - Submit application
   - Backend: Create company record (status: PENDING)

2. **Platform Admin Review**
   - Admin navigates to `/admin/companies`
   - Views pending applications
   - Verifies company legitimacy (business registry, contact info)
   - Clicks "Approve" or "Reject" button

3. **Approve Company**
   - Backend flow:
     a. Generate Ethereum wallet (viem: generatePrivateKey + privateKeyToAccount)
     b. Encrypt private key (AES-256-GCM via lib/crypto)
     c. Store encrypted key + wallet address in database (atomic transaction)
     d. Update company status to APPROVED
     e. Create audit log entry
     f. Send email to company admin (login credentials, next steps)

4. **Company Login**
   - Company admin logs in with email + password
   - Creates first user account (company admin role)
   - Invites team members (producer, distributor, retailer roles)

**Success Criteria:**
- ✅ Company application reviewed within 24 hours
- ✅ Custodial wallet generated securely
- ✅ Company admin receives login credentials
- ✅ Company can register products

**Failure Scenarios:**
- ❌ Company rejected → Send rejection email with reason
- ❌ Wallet generation fails → Show error, retry
- ❌ Email delivery fails → Log error, admin manually sends credentials

---

## Cross-Workflow Patterns

### Optimistic UI Updates

**Pattern:** Show pending state immediately, wait for blockchain confirmation in background

**Example:**
```typescript
// Frontend optimistic update
const [isPending, setIsPending] = useState(false);

async function registerProduct(data) {
  setIsPending(true);

  // Optimistic update: Show product in UI
  setProducts(prev => [...prev, { ...data, status: 'PENDING' }]);

  // Submit to backend
  const { txHash } = await fetch('/api/products/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }).then(r => r.json());

  // Poll for confirmation
  const confirmed = await waitForConfirmation(txHash);

  if (confirmed) {
    setProducts(prev => prev.map(p =>
      p.id === data.id ? { ...p, status: 'CONFIRMED' } : p
    ));
  } else {
    setProducts(prev => prev.filter(p => p.id !== data.id));
    showError('Transaction failed');
  }

  setIsPending(false);
}
```

### Error Recovery

**Pattern:** Retry transient errors (RPC failures), fail fast for permanent errors (validation)

**Example:**
```typescript
async function submitBlockchainTransaction(txData, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await walletClient.writeContract(txData);
    } catch (error) {
      if (isTransientError(error) && i < maxRetries - 1) {
        await sleep(1000 * Math.pow(2, i)); // Exponential backoff
        continue;
      }
      throw error; // Permanent error or max retries
    }
  }
}
```

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
