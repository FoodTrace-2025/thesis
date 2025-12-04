### Epic 8: IoT Sensor Simulator

**Priority:** 🟡 Should Have
**Estimated Time:** 6-8 hours (Smart Contract 2h + Backend 2h + Frontend 3-4h)
**Assigned:** Sam (Smart Contract), TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 5-6
**Dependencies:** Epic 4 (Component Library - Buttons), Epic 5 (Product Registration), Epic 7 (Sensor data linked to trace records)

#### Epic Description

Platform admin interface to simulate IoT sensor data (temperature, humidity, GPS) for products during transport. Three preset scenarios with realistic cold-chain ranges: Normal (2-4°C safe), Warning (8-10°C approaching threshold), Critical (>10°C spoilage risk). Software simulator eliminates need for hardware (€150-200 savings). Data recorded to blockchain with immutable timestamps for tamper-proof audit trail.

#### Business Value

- **Cost Savings:** €150-200 saved vs buying Raspberry Pi + sensors
- **Reliable Demo:** No sensor failures during thesis presentation
- **Reproducible Testing:** Can test edge cases (extreme temps) easily
- **Academic Validity:** Standard practice in POC development (IBM Food Trust uses test harnesses)
- **Future-Ready:** Same data structure as real IoT sensors

#### User Stories (High-Level)

- As an **admin**, I want to **select a product** to attach sensor data
- As an **admin**, I want to **click "Normal" scenario button** to generate safe temperature data (2-4°C)
- As an **admin**, I want to **click "Warning" scenario** to simulate approaching threshold (8-10°C)
- As an **admin**, I want to **click "Critical" scenario** to simulate spoilage risk (>10°C)
- As an **admin**, I want to **see real-time data preview** before submitting to blockchain
- As an **admin**, I want **alerts triggered automatically** when temperature exceeds threshold

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This is a software-only epic (no hardware required). Verify:

```bash
# Epic 5: At least one product registered
SELECT * FROM "Product" WHERE status != 'DRAFT' LIMIT 1;

# Epic 4: Chakra UI theme configured (Button used directly from @chakra-ui/react)
# TemperatureChart will be created using Recharts library (npm install recharts)

# Epic 7 (Optional): Sensor data can be linked to trace records
# If Epic 7 skipped, sensor data standalone (not linked to trace records)
```

**Team Decision Required (5 minutes together - BEFORE starting Epic 8):**

- ✅ **Simulation Algorithm Validation**:
  - Normal scenario: 2-4°C (safe cold chain for perishable food)
  - Warning scenario: 8-10°C (approaching spoilage threshold)
  - Critical scenario: >10°C (spoilage risk, alert required)
  - Decision: Confirm temperature ranges match thesis requirements for Finnish food products
- ✅ **Alert Notification Decision**:
  - Alerts sent to product owner company (email or dashboard notification)
  - Rate limiting: Max 1 alert per hour per product (prevent spam)
  - Alert types: WARNING (8-10°C), CRITICAL (>10°C)
- ✅ **Auto-Mode Decision** (Optional):
  - Auto-mode generates sensor data every N seconds (e.g., every 30 seconds)
  - Max readings per product: 10 (prevent blockchain spam)
  - Decision: Implement auto-mode or manual-only for MVP?

**Developer Setup (After Prerequisites):**

- No external accounts needed (software simulator only)
- No hardware setup required (pure software simulation)
- SensorReading model added to Prisma schema (see Technical Approach)

#### Acceptance Criteria (Epic Level)

**Smart Contract (addSensorData function):**

- ✅ `addSensorData()` function accepts (productId, temperature, humidity, gpsLat, gpsLng)
- ✅ SensorDataRecorded event emitted with (productId, temperature, humidity, timestamp)
- ✅ Temperature stored as int256 * 100 for precision (gas optimization: 3.2°C = 320)
- ✅ Product existence validation (require products[productId].exists)
- ✅ Role-based access control (only PLATFORM_ADMIN can add simulated data)
- ✅ Gas cost optimized: <60k gas per sensor reading
- ✅ Automatic blockchain timestamp (block.timestamp)
- ✅ Cannot modify past sensor readings (append-only array)

**Backend API (POST /api/iot/simulate):**

- ✅ Platform admin authentication validation (NextAuth.js session)
- ✅ Simulation algorithm generates realistic data based on scenario:
  - Normal: temperature 2-4°C, humidity 70-75%, GPS random within Finland
  - Warning: temperature 8-10°C, humidity 75-85%, GPS random
  - Critical: temperature 10-15°C, humidity 85-95%, GPS random
- ✅ Server-side wallet decryption using Epic 3 Tier 1 encryption
- ✅ Blockchain transaction submission (addSensorData smart contract call)
- ✅ Database save to SensorReading table (off-chain metadata)
- ✅ Alert triggering logic: if temperature > 8°C → WARNING, if > 10°C → CRITICAL
- ✅ Alert notification sent to product owner company (email or dashboard)
- ✅ Alert rate limiting: max 1 alert per hour per product
- ✅ Audit log entry created (action: SENSOR_DATA_SIMULATED, productId, temperature, status)
- ✅ Transaction hash returned to frontend

**Frontend (IoT Simulator Admin Page):**

- ✅ Platform admin role check (redirect non-admins with error message)
- ✅ Product selector dropdown (shows all registered products)
- ✅ Three scenario buttons rendered using Epic 4 Button component:
  - ✅ Normal button (green color, checkmark icon, "2-4°C")
  - ⚠️ Warning button (orange color, warning icon, "8-10°C")
  - 🚨 Critical button (red color, alert icon, ">10°C")
- ✅ Real-time data preview shows generated values before blockchain submission
- ✅ Data preview includes temperature (°C), humidity (%), GPS coordinates (lat/lng)
- ✅ Submit button records data to blockchain with loading state
- ✅ Success toast notification shown when sensor data added
- ✅ Error handling: wallet decryption failure shows "Contact admin" message
- ✅ Optional auto-mode checkbox (generate data every 30 seconds, max 10 readings per product)
- ✅ Mobile-responsive layout (works on tablet/desktop, not optimized for phone)

#### Technical Approach

**SensorReading Model (Prisma Schema):**

```prisma
model SensorReading {
  id                String   @id @default(cuid())
  productId         String
  temperature       Float    // Celsius (2.5, 8.3, 12.7)
  humidity          Float    // Percentage (72.5, 80.1)
  gpsLat            Float?   // Latitude (60.1695, 24.9354 for Helsinki)
  gpsLng            Float?   // Longitude
  status            String   // "SAFE", "WARNING", "CRITICAL"
  scenario          String   // "normal", "warning", "critical"
  transactionHash   String   // Blockchain transaction hash
  blockchainIndex   Int?     // Index in blockchain array
  createdAt         DateTime @default(now())

  product Product @relation(fields: [productId], references: [id])

  @@index([productId, createdAt])
  @@index([status])
}
```

**Simulation Algorithm (Scenario Presets):**

```typescript
// src/lib/iot/simulation-algorithms.ts
const FINLAND_GPS_BOUNDS = {
  latMin: 60.0,
  latMax: 70.0,
  lngMin: 20.0,
  lngMax: 31.0,
};

export const scenarios = {
  normal: {
    name: "Normal (Safe Cold Chain)",
    temperature: () => 2 + Math.random() * 2, // 2-4°C
    humidity: () => 70 + Math.random() * 5, // 70-75%
    gps: () => ({
      lat: FINLAND_GPS_BOUNDS.latMin + Math.random() * (FINLAND_GPS_BOUNDS.latMax - FINLAND_GPS_BOUNDS.latMin),
      lng: FINLAND_GPS_BOUNDS.lngMin + Math.random() * (FINLAND_GPS_BOUNDS.lngMax - FINLAND_GPS_BOUNDS.lngMin),
    }),
    status: "SAFE",
  },
  warning: {
    name: "Warning (Approaching Threshold)",
    temperature: () => 8 + Math.random() * 2, // 8-10°C
    humidity: () => 75 + Math.random() * 10, // 75-85%
    gps: () => ({
      lat: FINLAND_GPS_BOUNDS.latMin + Math.random() * (FINLAND_GPS_BOUNDS.latMax - FINLAND_GPS_BOUNDS.latMin),
      lng: FINLAND_GPS_BOUNDS.lngMin + Math.random() * (FINLAND_GPS_BOUNDS.lngMax - FINLAND_GPS_BOUNDS.lngMin),
    }),
    status: "WARNING",
  },
  critical: {
    name: "Critical (Spoilage Risk)",
    temperature: () => 10 + Math.random() * 5, // 10-15°C
    humidity: () => 85 + Math.random() * 10, // 85-95%
    gps: () => ({
      lat: FINLAND_GPS_BOUNDS.latMin + Math.random() * (FINLAND_GPS_BOUNDS.latMax - FINLAND_GPS_BOUNDS.latMin),
      lng: FINLAND_GPS_BOUNDS.lngMin + Math.random() * (FINLAND_GPS_BOUNDS.lngMax - FINLAND_GPS_BOUNDS.lngMin),
    }),
    status: "CRITICAL",
  },
};

// Generate sensor data based on scenario
export function generateSensorData(scenario: 'normal' | 'warning' | 'critical') {
  const preset = scenarios[scenario];
  return {
    temperature: Number(preset.temperature().toFixed(2)),
    humidity: Number(preset.humidity().toFixed(2)),
    gps: preset.gps(),
    status: preset.status,
    scenario: scenario,
  };
}
```

**UI Simulator Page:**

```typescript
<SimulatorPage>
  <ProductSelect value={selectedProduct} onChange={setSelectedProduct} />

  <ScenarioButtons>
    <Button colorScheme="green" onClick={() => generate('normal')}>
      ✅ Normal (2-4°C)
    </Button>
    <Button colorScheme="orange" onClick={() => generate('warning')}>
      ⚠️ Warning (8-10°C)
    </Button>
    <Button colorScheme="red" onClick={() => generate('critical')}>
      🚨 Critical (>10°C)
    </Button>
  </ScenarioButtons>

  <DataPreview>
    <Text>Temperature: {data.temperature}°C</Text>
    <Text>Humidity: {data.humidity}%</Text>
    <Text>GPS: {data.gps.lat}, {data.gps.lng}</Text>
  </DataPreview>

  <Button onClick={submitToBlockchain} loading={isPending}>
    Record to Blockchain
  </Button>
</SimulatorPage>
```

#### Dependencies

**Requires:**
- Epic 4 (Component Library) - Chakra UI theme configured (Button used directly, TemperatureChart built with Recharts)
- Epic 5 (Product Registration) - Products must exist before attaching sensor data
- Epic 3 Tier 1 (Wallet Encryption) - Server-side wallet decryption for blockchain transactions
- **New dependency:** `recharts` library for temperature visualization (npm install recharts)

**Optional:**
- Epic 7 (Supply Chain Tracking) - Sensor data can be linked to trace records (enhanced visualization)
- Epic 6 (Product Transfer Workflow) - Alert notifications can use Epic 6 email/notification infrastructure

**Blocks:** None (Epic 8 is optional enhancement for quality assurance demonstration)

#### Team Assignment

**Sam (2 hours - Smart Contract Lead):**

- addSensorData() smart contract function (1.5 hours)
  - Accept (productId, temperature, humidity, gpsLat, gpsLng)
  - Temperature stored as int256 * 100 (gas optimization)
  - Role-based access control (PLATFORM_ADMIN only)
  - Gas optimization (<60k gas per reading)
- Smart contract unit tests (0.5 hours)
  - Test addSensorData() success cases
  - Test role-based access control (non-admin cannot add data)
  - Test product existence validation

**TaiSheng (2-3 hours - Backend Lead):**

- IoT simulation API endpoint (1.5 hours)
  - POST /api/iot/simulate implementation
  - Simulation algorithm (generateSensorData function)
  - Blockchain transaction submission
  - Database save with status/scenario
- Alert triggering and notification logic (1 hour)
  - Implement alert rules (>8°C WARNING, >10°C CRITICAL)
  - Rate limiting (max 1 alert per hour per product)
  - Email/dashboard notification integration
- SensorReading Prisma model (0.5 hours)

**YiLing (3-4 hours - Frontend Lead):**

- IoT Simulator admin page scaffold (1 hour)
  - Platform admin role check and redirect
  - Product selector dropdown
- Scenario buttons and data preview (2 hours)
  - Three scenario buttons (Normal, Warning, Critical) with icons
  - Real-time data preview (temperature, humidity, GPS)
  - Submit button with loading states
- Optional auto-mode implementation (1 hour)
  - Auto-mode checkbox
  - Generate data every 30 seconds
  - Max 10 readings limit

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Data looks fake to reviewers | Use realistic temperature ranges (2-4°C for perishables), GPS bounded to Finland, mention "software simulator" clearly in thesis methodology |
| Auto-mode generates too much data | Rate limiting: max 10 sensor readings per product, auto-mode disabled by default, manual approval required |
| Alerts spam users (too many notifications) | Rate limit: max 1 alert per hour per product, duplicate alert suppression, dashboard badge instead of email for minor alerts |
| Simulation algorithm unrealistic | Validate temperature ranges with Finnish food safety standards, humidity 70-95% matches refrigerated transport, GPS coordinates within Finland bounds |
| No real hardware undermines thesis validity | Justify in thesis: Industry-standard practice (IBM Food Trust uses simulators), cost-effective POC approach, future-ready data structure |
| Epic 7 not implemented (sensor data orphaned) | Sensor data stored standalone, can be visualized in Epic 9 consumer query or Epic 12 data visualization |
| Platform admin role missing | Epic 2 user management includes PLATFORM_ADMIN role, fail fast if role not configured |
