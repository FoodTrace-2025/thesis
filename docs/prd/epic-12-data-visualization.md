### Epic 12: Data Visualization

**Priority:** 🟡 Should Have
**Estimated Time:** 6-8 hours
**Assigned:** TaiSheng (Backend 2h), YiLing (Frontend 4-6h)
**Timeline:** Week 7
**Dependencies:** Epic 2 (Trace Records), Epic 3 (Sensor Data)

#### Epic Description

Visual representation of product journey through supply chain. Timeline view shows all trace records chronologically. Temperature chart displays cold chain integrity. Makes complex blockchain data understandable for non-technical users.

#### Business Value

- **User Experience:** Visual timeline easier to understand than raw data
- **Trust Building:** Seeing complete journey builds confidence
- **Demo Impact:** Impressive visuals for thesis presentation
- **Accessibility:** Makes blockchain data accessible to everyone

**Note:** Can be simplified if behind schedule (simple list view instead of fancy timeline).

#### User Stories (High-Level)

- As a **consumer**, I want to **see visual timeline** of product journey
- As a **consumer**, I want to **see temperature chart** showing cold chain maintained
- As a **business user**, I want to **see dashboard analytics** (products registered, trace records added)
- As a **platform admin**, I want to **see platform statistics** (total companies, products, transactions)

#### Acceptance Criteria (Epic Level)

**Consumer View:**

- ✅ Product journey timeline (vertical, mobile-optimized)
- ✅ Each trace record shows: date, actor, location, notes
- ✅ Icons for different actions (✅ Received, 📦 Shipped, 🏪 Stocked)
- ✅ Temperature chart (line chart, red zone >8°C)
- ⚠️ Optional: Map view showing product movement

**Business User Dashboard:**

- ✅ Total products registered (count)
- ✅ Recent activity feed
- ✅ Pending actions (products to transfer, shipments to receive)

**Platform Admin Dashboard:**

- ✅ Total companies, users, products
- ✅ Recent blockchain transactions
- ✅ System health metrics

#### Technical Approach

**Timeline Component:**

```typescript
<Timeline>
  {traceRecords.map((record) => (
    <TimelineItem key={record.id}>
      <TimelineIcon action={record.action} />
      <TimelineContent>
        <Text fontWeight="bold">{record.action}</Text>
        <Text fontSize="sm">{record.company.name}</Text>
        <Text fontSize="sm">{record.location}</Text>
        <Text fontSize="xs" color="gray">
          {formatDate(record.timestamp)}
        </Text>
      </TimelineContent>
    </TimelineItem>
  ))}
</Timeline>
```

**Temperature Chart:**

```typescript
import { LineChart, Line, XAxis, YAxis, ReferenceLine } from "recharts";

<LineChart data={sensorReadings}>
  <XAxis dataKey="timestamp" />
  <YAxis domain={[0, 15]} label="Temperature (°C)" />
  <ReferenceLine y={8} stroke="orange" label="Warning" />
  <ReferenceLine y={10} stroke="red" label="Critical" />
  <Line dataKey="temperature" stroke="blue" />
</LineChart>;
```

#### Dependencies

**Requires:** Epic 2 (trace records), Epic 3 (sensor data)

#### Team Assignment

**TaiSheng (2 hours):**

- Dashboard analytics API (1 hour)
- Data aggregation queries (1 hour)

**YiLing (4-6 hours):**

- Timeline component (2 hours)
- Temperature chart (2 hours)
- Dashboard widgets (2 hours if time permits)

#### Risks & Mitigations

| Risk                      | Mitigation                                        |
| ------------------------- | ------------------------------------------------- |
| Chart library too complex | Use simple Chakra UI charts or Chart.js           |
| Mobile performance poor   | Lazy load charts, simplify for mobile             |
| Behind schedule           | Cut to simple list view instead of fancy timeline |
