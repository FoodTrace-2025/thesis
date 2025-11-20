# Testing Strategy

**Purpose:** Define testing approach, coverage targets, test types, and quality assurance processes.

---

## Test Pyramid

FoodTrace follows the **Test Pyramid** principle (Cohn, 2009) with most tests at the unit level for fast feedback and lower maintenance costs.

```
        /\
       /  \        E2E Tests (10%)
      /────\       - Complete user workflows
     /      \      - Cross-browser testing
    /────────\     - QR code scanning scenarios
   /          \
  /────────────\   Integration Tests (20%)
 /              \  - Smart contract + Database sync
/────────────────\ - API endpoint validation
──────────────────────────────────────────────────
                   Unit Tests (70%)
                   - Smart contract functions
                   - React components
                   - API route handlers
                   - Utility functions
```

---

## Testing Framework Breakdown

| Layer | Framework | Target Coverage | Test Count (Estimate) |
|-------|-----------|----------------|----------------------|
| **Smart Contracts** | Hardhat + Chai/Mocha | >70% statement | 100+ tests |
| **Frontend Components** | React Testing Library + Jest | >80% component | 150+ tests |
| **API Routes** | Jest + Supertest | >70% endpoint | 50+ tests |
| **E2E Workflows** | Playwright | 100% critical paths | 21 scenarios |

---

## Smart Contract Testing

### Security Testing (CRITICAL)

**Test Cases:**
- Reentrancy attack prevention (4 test cases)
- Access control validation (8 test cases - PRODUCER_ROLE, DISTRIBUTOR_ROLE, RETAILER_ROLE)
- Integer overflow/underflow (6 test cases)
- Gas limit DoS prevention (2 test cases)
- Timestamp manipulation (4 test cases)

**Example:**
```typescript
describe('ProductRegistry Security', () => {
  it('prevents non-producers from registering products', async () => {
    const [_, nonProducer] = await ethers.getSigners();

    await expect(
      productRegistry.connect(nonProducer).registerProduct("Test", "Oulu", 1699920000)
    ).to.be.revertedWith("AccessControl: account is missing role");
  });

  it('prevents future-dated harvest dates', async () => {
    const futureDate = Math.floor(Date.now() / 1000) + 86400;

    await expect(
      productRegistry.registerProduct("Test", "Oulu", futureDate)
    ).to.be.revertedWith("Future date not allowed");
  });
});
```

### Functional Testing (CRITICAL)

**Test Cases:**
- Product registration (12 test cases - valid inputs, boundary conditions, error cases)
- Ownership transfers (8 test cases)
- Trace record validation (10 test cases)
- Sensor data recording (8 test cases)
- Event emission verification (10 test cases)

### Gas Optimization Validation (HIGH)

**Tools:** hardhat-gas-reporter

**Metrics:**
- Gas cost benchmarks per function
- Struct packing efficiency validation
- Storage vs memory usage analysis

**Target Gas Costs:**
- `registerProduct()`: <100k gas
- `addTraceRecord()`: <80k gas
- `recordSensorData()`: <60k gas

---

## Frontend Testing

### Component Isolation Tests (70% of frontend tests)

**Key Components:**
- `ProductRegistrationForm` (15 test cases - input validation, file upload, wallet connection)
- `QRCodeDisplay` (8 test cases - generation, download, responsive display)
- `ProductJourneyTimeline` (12 test cases - data rendering, blockchain verification links)
- `TemperatureChart` (10 test cases - sensor data visualization, alert highlighting)
- `IoTSimulator` (10 test cases - scenario selection, data generation, real-time preview)

**Example:**
```typescript
describe('ProductRegistrationForm', () => {
  it('validates required fields', async () => {
    const { getByRole, getByText } = render(<ProductRegistrationForm />);

    const submitButton = getByRole('button', { name: /register/i });
    fireEvent.click(submitButton);

    expect(getByText('Name is required')).toBeInTheDocument();
    expect(getByText('Origin is required')).toBeInTheDocument();
  });

  it('prevents future harvest dates', async () => {
    const { getByLabelText, getByRole, findByText } = render(<ProductRegistrationForm />);

    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    fireEvent.change(getByLabelText('Harvest Date'), { target: { value: futureDate.toISOString().split('T')[0] } });
    fireEvent.click(getByRole('button', { name: /register/i }));

    expect(await findByText('Harvest date cannot be in the future')).toBeInTheDocument();
  });
});
```

### Integration Tests (20% of frontend tests)

**Test Cases:**
- Wallet connection flow (MetaMask simulation)
- Blockchain transaction signing + confirmation
- Database query + display synchronization
- QR code scan → product query flow

### E2E User Workflows (10% of frontend tests)

**Critical Paths:**
1. **Producer:** Register product → Generate QR → Download
2. **Distributor:** Scan QR → Add trace record → Record temperature
3. **Retailer:** Scan QR → Update status → Mark sold
4. **Consumer:** Scan QR → View journey (NO wallet required)
5. **Admin:** IoT Simulator → Generate Critical alert → Verify notification

**Example Playwright Test:**
```typescript
test('Producer registers product and downloads QR code', async ({ page }) => {
  // Login as producer
  await page.goto('/producer/login');
  await page.fill('[name="email"]', 'producer@hirsimakifarm.fi');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Navigate to registration form
  await page.goto('/producer/register');

  // Fill product details
  await page.fill('[name="name"]', 'Organic Milk');
  await page.fill('[name="origin"]', 'Oulu, Finland');
  await page.fill('[name="harvestDate"]', '2025-11-15');
  await page.setInputFiles('[name="image"]', 'test-fixtures/milk.jpg');

  // Submit registration
  await page.click('button:has-text("Register Product")');

  // Wait for blockchain confirmation
  await page.waitForSelector('text=Product registered successfully', { timeout: 30000 });

  // Verify QR code displayed
  const qrCode = await page.locator('svg[data-testid="qr-code"]');
  await expect(qrCode).toBeVisible();

  // Download QR code
  const downloadPromise = page.waitForEvent('download');
  await page.click('button:has-text("Download QR Code")');
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain('.png');
});
```

---

## API Route Testing

**Test Structure:**
```typescript
describe('POST /api/products/register', () => {
  it('registers product with valid data', async () => {
    const response = await request(app)
      .post('/api/products/register')
      .set('Cookie', authCookie)
      .send({
        name: 'Organic Milk',
        origin: 'Oulu',
        harvestDate: '2025-11-15',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('productId');
    expect(response.body).toHaveProperty('transactionHash');
  });

  it('rejects unauthenticated requests', async () => {
    const response = await request(app)
      .post('/api/products/register')
      .send({ name: 'Test', origin: 'Test', harvestDate: '2025-11-15' });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  it('validates future harvest dates', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const response = await request(app)
      .post('/api/products/register')
      .set('Cookie', authCookie)
      .send({
        name: 'Test',
        origin: 'Test',
        harvestDate: futureDate.toISOString(),
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('future');
  });
});
```

---

## Coverage Targets

**Smart Contracts:**
- **Statement Coverage:** >70%
- **Branch Coverage:** >60%
- **Function Coverage:** >80%

**Frontend:**
- **Component Coverage:** >80%
- **Line Coverage:** >70%

**Backend API:**
- **Endpoint Coverage:** >70%
- **Critical Path Coverage:** 100%

---

## Static Analysis

**Smart Contracts (Slither):**
```bash
pip install slither-analyzer
slither contracts/ --print human-summary

# Target: Zero critical or high-severity issues
```

**Common Vulnerabilities Checked:**
- ✅ Reentrancy attacks
- ✅ Integer overflow/underflow
- ✅ Unprotected selfdestruct
- ✅ Uninitialized storage pointers
- ✅ Access control issues
- ✅ Gas limit DoS

**TypeScript (ESLint + Prettier):**
```bash
npm run lint      # ESLint checks
npm run format    # Prettier formatting
```

---

## Continuous Integration Testing

**GitHub Actions Workflow:**

```yaml
name: Test Suite
on:
  pull_request:
    branches: [main]

jobs:
  smart-contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx hardhat compile
      - run: npx hardhat test
      - run: npx hardhat coverage
      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.statements.pct')
          if (( $(echo "$COVERAGE < 70" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 70% threshold"
            exit 1
          fi

  frontend-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run test
      - run: npm run build

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm audit --production
      - run: pip install slither-analyzer
      - run: slither contracts/ --exclude-dependencies
```

---

## Testing Schedule (Weeks 3-9)

**Week 3-4 (Smart Contracts):**
- Write contract tests alongside implementation (TDD approach)
- Target 70% coverage by Week 4 end

**Week 5-7 (Frontend/Backend):**
- Component tests during development
- Integration tests at sprint end

**Week 8 (Testing Sprint):**
- E2E scenarios
- Cross-browser validation
- Performance benchmarking

**Week 9 (Polish):**
- Bug fixes
- Regression testing
- Final coverage validation

---

## Security Testing Checklist

| Test | Status | Validation Method |
|------|--------|------------------|
| SQL injection fails | ✅ | Prisma ORM (parameterized queries) |
| XSS fails | ✅ | React auto-escape |
| CSRF fails | ✅ | SameSite cookies |
| Unauthorized access returns 401/403 | ✅ | NextAuth session checks |
| Cross-company access returns 403 | ✅ | Multi-tenant RLS validation |
| Weak passwords rejected | ✅ | bcrypt + password policy |
| Session expires after 24 hours | ✅ | JWT expiry validation |
| Wallet decryption requires key | ✅ | AES-256 encryption tests |
| Private keys never logged | ✅ | Log output inspection |
| Smart contract access control enforced | ✅ | Role-based unit tests |

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
