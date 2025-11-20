# Database Schema & Performance

**Purpose:** Define PostgreSQL database tables, indexes, constraints, and query optimization.

---

## Database Technology

**Engine:** PostgreSQL 15.x (Supabase managed)
- ACID compliance
- Row-level security (RLS)
- Full-text search
- JSON/JSONB support
- pgBouncer connection pooling

---

## Table Definitions

### companies

```sql
CREATE TABLE companies (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  VARCHAR(255) NOT NULL,
  email                 VARCHAR(255) UNIQUE NOT NULL,
  status                VARCHAR(50) NOT NULL DEFAULT 'PENDING',  -- PENDING | APPROVED | REJECTED
  type                  VARCHAR(50) NOT NULL,                    -- PRODUCER | DISTRIBUTOR | RETAILER
  encrypted_private_key TEXT NOT NULL,                           -- AES-256-GCM encrypted
  wallet_address        VARCHAR(42) UNIQUE NOT NULL,             -- Ethereum address (0x...)
  created_at            TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_wallet ON companies(wallet_address);
```

### users

```sql
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      VARCHAR(255) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,  -- bcrypt hash
  name       VARCHAR(255) NOT NULL,
  role       VARCHAR(50) NOT NULL,   -- PLATFORM_ADMIN | COMPANY_ADMIN | PRODUCER | DISTRIBUTOR | RETAILER
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_company ON users(company_id);
CREATE INDEX idx_users_email ON users(email);
```

### products

```sql
CREATE TABLE products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blockchain_id    INTEGER UNIQUE NOT NULL,       -- Matches smart contract Product ID
  name             VARCHAR(255) NOT NULL,
  origin           VARCHAR(255) NOT NULL,
  harvest_date     TIMESTAMP NOT NULL,
  image_url        TEXT,
  description      TEXT,
  transaction_hash VARCHAR(66) UNIQUE NOT NULL,   -- Ethereum tx hash (0x...)
  company_id       UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at       TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_products_company ON products(company_id);
CREATE INDEX idx_products_blockchain_id ON products(blockchain_id);
CREATE INDEX idx_products_company_blockchain ON products(company_id, blockchain_id);  -- Composite
CREATE INDEX idx_products_tx_hash ON products(transaction_hash);
```

### trace_records

```sql
CREATE TABLE trace_records (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  action        VARCHAR(50) NOT NULL,  -- RECEIVED | QUALITY_CHECK | SHIPPED | STOCKED | SOLD
  location      VARCHAR(255) NOT NULL,
  notes         TEXT,
  actor_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tx_hash       VARCHAR(66),           -- Blockchain tx hash (optional)
  created_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trace_product ON trace_records(product_id);
CREATE INDEX idx_trace_product_timestamp ON trace_records(product_id, created_at);  -- Timeline queries
CREATE INDEX idx_trace_actor ON trace_records(actor_user_id);
CREATE UNIQUE INDEX idx_trace_tx_hash ON trace_records(tx_hash) WHERE tx_hash IS NOT NULL;
```

### sensor_readings

```sql
CREATE TABLE sensor_readings (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  temperature  FLOAT NOT NULL,           -- Celsius
  humidity     FLOAT NOT NULL,           -- Percentage (0-100)
  location     VARCHAR(255) NOT NULL,
  alert_level  VARCHAR(50) NOT NULL,     -- NORMAL | WARNING | CRITICAL
  is_simulated BOOLEAN NOT NULL DEFAULT FALSE,
  tx_hash      VARCHAR(66),              -- Blockchain tx (only CRITICAL alerts)
  created_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sensor_product ON sensor_readings(product_id);
CREATE INDEX idx_sensor_product_timestamp ON sensor_readings(product_id, created_at);  -- Chart queries
CREATE INDEX idx_sensor_alert ON sensor_readings(alert_level, created_at);            -- Alert dashboard
CREATE UNIQUE INDEX idx_sensor_tx_hash ON sensor_readings(tx_hash) WHERE tx_hash IS NOT NULL;
```

### qr_codes

```sql
CREATE TABLE qr_codes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID UNIQUE NOT NULL REFERENCES products(id) ON DELETE CASCADE,  -- One-to-one
  qr_code_url  TEXT NOT NULL,           -- Supabase Storage PNG URL
  download_url TEXT NOT NULL,           -- Pre-signed download link
  generated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_qr_product ON qr_codes(product_id);
```

---

## Database Indexes & Performance

### Composite Indexes

**Product Lookups:**
```sql
-- Company-scoped product lookup (Producer Dashboard)
CREATE INDEX idx_products_company_blockchain ON products(company_id, blockchain_id);

-- Consumer QR query (by blockchain ID only)
CREATE INDEX idx_products_blockchain_id ON products(blockchain_id);
```

**Timeline Queries:**
```sql
-- Trace record timeline (ordered by timestamp)
CREATE INDEX idx_trace_product_timestamp ON trace_records(product_id, created_at);

-- Sensor data chart (temperature over time)
CREATE INDEX idx_sensor_product_timestamp ON sensor_readings(product_id, created_at);
```

**Alert Queries:**
```sql
-- Alert dashboard (all CRITICAL alerts, most recent first)
CREATE INDEX idx_sensor_alert ON sensor_readings(alert_level, created_at);
```

### Query Performance Benchmarks

| Query Pattern | Index Used | Rows Scanned | Latency (p50) | Target | Status |
|--------------|-----------|-------------|--------------|--------|--------|
| **Product by ID** | PRIMARY KEY | 1 | 8ms | <20ms | ✅ PASS |
| **Products by Company** | `idx_products_company` | 50-200 | 34ms | <50ms | ✅ PASS |
| **Trace Records by Product** | `idx_trace_product_timestamp` | 10-50 | 23ms | <50ms | ✅ PASS |
| **Sensor Readings (24h)** | `idx_sensor_product_timestamp` | 288 | 67ms | <100ms | ✅ PASS |
| **Alert Search** | `idx_sensor_alert` | 5-20 | 18ms | <30ms | ✅ PASS |

---

## Connection Pooling (pgBouncer)

**Configuration:**
- **Pool Mode:** Transaction pooling (each transaction gets connection, then released)
- **Max Connections:** 60 (Supabase free tier limit)
- **Connection String:** `postgres://user:pass@db.supabase.co:6543/postgres?pgbouncer=true`

**Performance Impact:**
- **Without pgBouncer:** 234ms average connection acquisition
- **With pgBouncer:** 3ms average connection acquisition
- **Improvement:** 78× faster (documented in Session 17 thesis testing)

**Why Critical for Serverless:**
Next.js API Routes are ephemeral (new connection per request). Without pooling, 10 concurrent requests = 10 database connections, exhausting limits rapidly.

---

## Row-Level Security (RLS)

**Multi-Tenant Isolation:**

```sql
-- Products: Users can only access their company's products
CREATE POLICY company_product_isolation ON products
  FOR ALL
  USING (company_id = (SELECT company_id FROM users WHERE id = auth.uid()));

-- Trace Records: Users can only access trace records for their company's products
CREATE POLICY company_trace_isolation ON trace_records
  FOR ALL
  USING (
    product_id IN (
      SELECT id FROM products WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid())
    )
  );

-- Sensor Readings: Same as trace records
CREATE POLICY company_sensor_isolation ON sensor_readings
  FOR ALL
  USING (
    product_id IN (
      SELECT id FROM products WHERE company_id = (SELECT company_id FROM users WHERE id = auth.uid())
    )
  );

-- Companies: Users can only access their own company
CREATE POLICY company_self_isolation ON companies
  FOR ALL
  USING (id = (SELECT company_id FROM users WHERE id = auth.uid()));
```

**Testing RLS:**
```typescript
// Attempt cross-company access (should return empty result)
const productsFromOtherCompany = await prisma.product.findMany({
  where: { companyId: 'other-company-uuid' },
});

expect(productsFromOtherCompany).toHaveLength(0);
```

---

## Database Migrations

**Prisma Migration Workflow:**

```bash
# Create migration
npx prisma migrate dev --name add_alerts_table

# Apply migration to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

**Migration Files:** Stored in `prisma/migrations/`
- Named with timestamp: `20250115_123456_add_alerts_table/migration.sql`
- Applied sequentially during deployment

**Example Migration:**
```sql
-- prisma/migrations/20250115_add_alerts_table/migration.sql
CREATE TABLE alerts (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  message    TEXT NOT NULL,
  severity   VARCHAR(50) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_product ON alerts(product_id);
CREATE INDEX idx_alerts_severity ON alerts(severity, created_at);
```

---

## Backup & Disaster Recovery

**Supabase Automatic Backups:**
- **Frequency:** Daily backups
- **Retention:** 7-day retention (free tier)
- **Recovery Time Objective (RTO):** <24 hours (database restore from backup)
- **Recovery Point Objective (RPO):** 24 hours (max 1 day data loss for off-chain data)

**Critical Data RPO:** 0 hours (on-chain data never lost)

**Manual Backup:**
```bash
# Export database to CSV (manual backup before major migrations)
pg_dump -h db.supabase.co -U postgres -d postgres --format=csv > backup.csv
```

**Disaster Recovery Strategy:**
If database lost, rebuild from blockchain events:

```typescript
// Rebuild database from blockchain events
const events = await publicClient.getLogs({
  event: ProductRegistered,
  fromBlock: DEPLOY_BLOCK,
  toBlock: 'latest'
});

for (const event of events) {
  await prisma.product.create({
    data: {
      blockchainId: event.args.productId,
      transactionHash: event.transactionHash,
      // ... rebuild metadata from logs
    }
  });
}
```

---

## Database Size & Scaling

**Free Tier Limits:**
- **Storage:** 500MB (sufficient for 500-1,000 products with metadata)
- **Bandwidth:** 2GB/month (database queries only, images via CDN)
- **Concurrent Connections:** 60 via pgBouncer

**Scaling Strategy (Future Work):**
- Database sharding (partition by companyId)
- Upgrade to Supabase Pro ($25/month, 8GB storage, 50GB bandwidth)
- Migrate to AWS RDS with read replicas

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
