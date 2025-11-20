### Epic 8: IoT Sensor Simulator

**Priority:** 🟡 Should Have
**Estimated Time:** 6-8 hours (Smart Contract 2h + Backend 2h + Frontend 3-4h)
**Assigned:** Sam (Smart Contract), TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 4-5
**Dependencies:** Epic 5 (Product Registration)

#### Epic Description

Admin interface to simulate IoT sensor data (temperature, humidity, GPS) for products during transport. Three preset scenarios: Normal (2-4°C), Warning (8-10°C), Critical (>10°C). Demonstrates blockchain + IoT integration without requiring real hardware. Data recorded to blockchain with immutable timestamps.

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

#### Acceptance Criteria (Epic Level)

**Smart Contract:**

- ✅ `addSensorData()` function accepts (productId, temperature, humidity, location)
- ✅ SensorDataRecorded event emitted
- ✅ Temperature stored as int256 \* 100 (gas optimization: 3.2°C = 320)
- ✅ Gas cost <60k gas per reading

**Backend:**

- ✅ `POST /api/iot/simulate` endpoint
- ✅ Saves to database + blockchain
- ✅ Alert triggered if temperature > 8°C (Warning) or > 10°C (Critical)
- ✅ Alert notification sent to product owner

**Frontend:**

- ✅ IoT Simulator admin page (only platform admin access)
- ✅ Product selector dropdown
- ✅ Three scenario buttons with icons: ✅ Normal, ⚠️ Warning, 🚨 Critical
- ✅ Real-time data preview (temperature, humidity, GPS)
- ✅ Submit button records to blockchain
- ✅ Optional: Auto-mode checkbox (generate data every N seconds)

#### Technical Approach

**Scenario Presets:**

```typescript
const scenarios = {
  normal: {
    temperature: () => 2 + Math.random() * 2, // 2-4°C
    humidity: () => 70 + Math.random() * 5, // 70-75%
    status: "SAFE",
  },
  warning: {
    temperature: () => 8 + Math.random() * 2, // 8-10°C
    humidity: () => 75 + Math.random() * 10, // 75-85%
    status: "WARNING",
  },
  critical: {
    temperature: () => 10 + Math.random() * 5, // 10-15°C
    humidity: () => 85 + Math.random() * 10, // 85-95%
    status: "CRITICAL",
  },
};
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

**Requires:** Epic 1 (products must exist to attach sensor data)

#### Team Assignment

**Sam (2 hours):**

- Smart contract sensor data function (1.5 hours)
- Unit tests (0.5 hours)

**TaiSheng (2 hours):**

- IoT simulate API (1 hour)
- Alert triggering logic (1 hour)

**YiLing (3-4 hours):**

- Simulator admin page UI (2 hours)
- Scenario buttons and data preview (1-2 hours)

#### Risks & Mitigations

| Risk                              | Mitigation                                                  |
| --------------------------------- | ----------------------------------------------------------- |
| Data looks fake to reviewers      | Use realistic ranges, mention "simulator" clearly in thesis |
| Auto-mode generates too much data | Rate limiting, max 10 readings per product                  |
| Alerts spam users                 | Rate limit alerts (max 1 per hour per product)              |
