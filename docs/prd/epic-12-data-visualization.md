### Epic 12: Data Visualization

**Priority:** 🟡 Should Have
**Estimated Time:** 6-8 hours (Backend 2h + Frontend 4-6h)
**Assigned:** TaiSheng (Backend), YiLing (Frontend)
**Timeline:** Week 7
**Dependencies:** Epic 4 (Component Library), Epic 7 (Supply Chain Tracking - Trace Records), Epic 8 (IoT Simulator - Sensor Data optional)

#### Epic Description

Visual representation of product journey through supply chain. Timeline view shows all trace records chronologically. Temperature chart displays cold chain integrity. Makes complex blockchain data understandable for non-technical users.

#### Business Value

- **User Experience:** Visual timeline easier to understand than raw data
- **Trust Building:** Seeing complete journey builds confidence
- **Demo Impact:** Impressive visuals for thesis presentation
- **Accessibility:** Makes blockchain data accessible to everyone

**Note:** Can be simplified if behind schedule (simple list view instead of fancy timeline).

#### User Prerequisites (Manual Tasks - Complete First)

**IMPORTANT:** This epic builds Timeline and Chart components for visualizing Epic 7 (trace records) and Epic 8 (sensor data). Verify:

```bash
# Epic 7: Trace records exist for timeline visualization
SELECT * FROM "TraceRecord" LIMIT 1;

# Epic 8 (Optional): Sensor readings exist for temperature chart
SELECT * FROM "SensorReading" LIMIT 1; # Optional - chart hidden if no data

# Epic 4: Component Library foundation exists
ls src/components/ui/Card.tsx
ls src/components/ui/Badge.tsx
```

**Team Decision Required (20 minutes together - BEFORE starting Epic 12):**

- ✅ **Chart Library Decision**:
  - **Option A (Recommended):** Recharts (React-based, 22k stars, composable, mobile-friendly)
    - Install: `npm install recharts`
    - Bundle size: ~400KB (acceptable for MVP)
    - Why: Best React integration, TypeScript support, responsive by default
  - **Option B:** Chart.js (17k stars, smaller bundle ~200KB)
    - Requires react-chartjs-2 wrapper
    - Less React-native, more imperative API
  - **Option C:** Chakra UI Charts (deprecated, not recommended)
  - **Decision:** Use Recharts for temperature chart, build custom Timeline component (Chakra UI primitives)
- ✅ **Timeline Component Approach**:
  - **Option A:** Build custom Timeline using Chakra UI Box, Flex, Text primitives
    - Full control, mobile-optimized, vertical on mobile, horizontal on desktop
    - Estimated time: 2 hours (YiLing)
  - **Option B:** Use third-party timeline library (react-vertical-timeline-component)
    - Less control, bundle size overhead
  - **Decision:** Build custom Timeline component (Option A) - aligns with Epic 4 Component Library philosophy
- ✅ **Dashboard Analytics Scope** (If time permits):
  - **Must Have:** Total products registered, recent activity feed
  - **Should Have:** Pending actions dashboard (products to transfer, shipments to receive)
  - **Could Have:** Platform admin statistics (total companies, users, blockchain transactions)
  - **Decision:** Start with Must Have, add Should Have if ahead of schedule, skip Could Have for MVP
- ✅ **Mobile Performance Decision**:
  - Lazy-load temperature chart (only render when scrolled into view)
  - Simplify timeline on mobile (<768px): vertical layout, max 10 items per page with "Load More"
  - Test on 3G network: page load time <3 seconds

**Developer Setup (After Prerequisites):**

- Recharts library installed: `npm install recharts`
- Epic 4 Component Library components available
- At least 3+ trace records in database (for timeline testing)
- At least 5+ sensor readings in database (for temperature chart testing, optional)

#### User Stories (High-Level)

- As a **consumer**, I want to **see visual timeline** of product journey
- As a **consumer**, I want to **see temperature chart** showing cold chain maintained
- As a **business user**, I want to **see dashboard analytics** (products registered, trace records added)
- As a **platform admin**, I want to **see platform statistics** (total companies, products, transactions)

#### Acceptance Criteria (Epic Level)

**Timeline Component (Consumer Product Page - Epic 9 Integration):**

- ✅ Timeline component implemented using Chakra UI primitives (Box, Flex, Text, Icon)
- ✅ Timeline displays all trace records chronologically (oldest to newest)
- ✅ Each timeline item shows: date, actor name, company name, action, location, notes
- ✅ Timeline icons for different actions:
  - ✅ Received action (✅ checkmark icon)
  - 📦 Shipped action (📦 package icon)
  - 🏪 Stocked action (🏪 store icon)
  - 🔍 Quality Check action (🔍 magnifying glass icon)
  - 💰 Sold action (💰 money icon)
- ✅ Timeline responsive layout:
  - Vertical layout on mobile (<768px width)
  - Horizontal scrollable layout on desktop (≥768px width)
- ✅ Timeline shows connecting lines between trace records
- ✅ Timeline highlights most recent trace record (bold, colored border)
- ✅ Timeline empty state: "No trace records yet" message when no data
- ✅ Timeline pagination: "Load More" button if >10 trace records (mobile performance)
- ✅ Timeline integrated into Epic 9 consumer query page

**Temperature Chart Component (Consumer Product Page - Epic 9 Integration, Optional):**

- ✅ Temperature chart implemented using Recharts LineChart
- ✅ Chart displays sensor readings chronologically (x-axis: timestamp, y-axis: temperature °C)
- ✅ Chart shows temperature line (blue stroke)
- ✅ Chart shows warning threshold reference line (8°C, orange stroke, labeled "Warning")
- ✅ Chart shows critical threshold reference line (10°C, red stroke, labeled "Critical")
- ✅ Chart highlights critical temperature points (red dots if temperature >10°C)
- ✅ Chart responsive:
  - Simplified on mobile (<768px): 300px width, smaller font size
  - Full-width on desktop: 600px width, readable labels
- ✅ Chart lazy-loaded (only renders when scrolled into view)
- ✅ Chart conditionally rendered (hidden if no sensor data exists from Epic 8)
- ✅ Chart tooltip shows: timestamp, temperature value, humidity (optional)
- ✅ Chart performance: renders <500ms on 3G network

**Business User Dashboard (Producer/Distributor/Retailer Dashboards):**

- ✅ Dashboard shows total products registered (count with icon)
- ✅ Dashboard shows recent activity feed (last 10 actions: product registered, trace record added, product transferred)
- ✅ Activity feed shows timestamp, action type, product name, user who performed action
- ✅ Dashboard shows pending actions widget:
  - Products to transfer (for producers/distributors)
  - Shipments to receive (for distributors/retailers)
  - Count badge shows number of pending items
- ✅ Dashboard widgets use Epic 4 Card component
- ✅ Dashboard mobile-responsive (stacked vertically on mobile, grid on desktop)

**Platform Admin Dashboard (Optional - If Time Permits):**

- ✅ Platform stats widget: total companies, total users, total products
- ✅ Recent blockchain transactions widget (last 10 transactions with Etherscan links)
- ✅ System health metrics widget (optional, can be skipped if behind schedule):
  - Database connection status
  - Blockchain RPC status (Alchemy Sepolia)
  - Last blockchain transaction timestamp

#### Technical Approach

**Custom Timeline Component (Chakra UI Primitives):**

```typescript
// src/components/visualization/Timeline.tsx
import { Box, Flex, Text, Icon, VStack } from '@chakra-ui/react';
import { CheckIcon } from '@chakra-ui/icons';
import { FaBoxOpen, FaStore, FaSearch, FaDollarSign } from 'react-icons/fa';

interface TraceRecord {
  id: string;
  action: string;
  location: string;
  notes?: string;
  timestamp: Date;
  actor: string; // "John Doe from Helsinki Distributors"
}

interface TimelineProps {
  traceRecords: TraceRecord[];
}

export function Timeline({ traceRecords }: TimelineProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'RECEIVED': return <Icon as={CheckIcon} color="green.500" />;
      case 'SHIPPED': return <Icon as={FaBoxOpen} color="blue.500" />;
      case 'STOCKED': return <Icon as={FaStore} color="purple.500" />;
      case 'QUALITY_CHECK': return <Icon as={FaSearch} color="orange.500" />;
      case 'SOLD': return <Icon as={FaDollarSign} color="green.600" />;
      default: return <Icon as={CheckIcon} color="gray.500" />;
    }
  };

  if (traceRecords.length === 0) {
    return (
      <Box p={4} textAlign="center" color="gray.500">
        No trace records yet
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {traceRecords.map((record, index) => (
        <Flex key={record.id} gap={4} position="relative">
          {/* Connecting Line */}
          {index < traceRecords.length - 1 && (
            <Box
              position="absolute"
              left="24px"
              top="48px"
              width="2px"
              height="calc(100% + 16px)"
              bg="gray.200"
            />
          )}

          {/* Icon Circle */}
          <Box
            width="48px"
            height="48px"
            borderRadius="full"
            bg="white"
            border="2px solid"
            borderColor={index === traceRecords.length - 1 ? 'blue.500' : 'gray.300'}
            display="flex"
            alignItems="center"
            justifyContent="center"
            zIndex={1}
          >
            {getActionIcon(record.action)}
          </Box>

          {/* Content */}
          <Box flex={1}>
            <Text fontWeight="bold" fontSize="md">
              {record.action.replace('_', ' ')}
            </Text>
            <Text fontSize="sm" color="gray.600">
              {record.actor}
            </Text>
            <Text fontSize="sm" color="gray.600">
              📍 {record.location}
            </Text>
            {record.notes && (
              <Text fontSize="sm" color="gray.500" mt={1}>
                {record.notes}
              </Text>
            )}
            <Text fontSize="xs" color="gray.400" mt={1}>
              {new Date(record.timestamp).toLocaleString()}
            </Text>
          </Box>
        </Flex>
      ))}
    </VStack>
  );
}
```

**Temperature Chart Component (Recharts):**

```typescript
// src/components/visualization/TemperatureChart.tsx
import { Box, Text } from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';

interface SensorReading {
  id: string;
  temperature: number;
  humidity: number;
  timestamp: Date;
  status: 'SAFE' | 'WARNING' | 'CRITICAL';
}

interface TemperatureChartProps {
  sensorReadings: SensorReading[];
}

export function TemperatureChart({ sensorReadings }: TemperatureChartProps) {
  if (sensorReadings.length === 0) {
    return null; // Hide chart if no sensor data
  }

  // Format data for Recharts
  const chartData = sensorReadings.map((reading) => ({
    timestamp: new Date(reading.timestamp).toLocaleTimeString(),
    temperature: Number(reading.temperature.toFixed(2)),
    humidity: Number(reading.humidity.toFixed(2)),
  }));

  return (
    <Box mt={8}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Temperature History
      </Text>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" fontSize={12} />
          <YAxis
            domain={[0, 15]}
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
            fontSize={12}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
            formatter={(value: number, name: string) => [
              `${value}°C`,
              name === 'temperature' ? 'Temperature' : 'Humidity',
            ]}
          />

          {/* Warning Threshold: 8°C */}
          <ReferenceLine
            y={8}
            stroke="orange"
            strokeDasharray="3 3"
            label={{
              value: 'Warning (8°C)',
              fill: 'orange',
              fontSize: 12,
              position: 'right',
            }}
          />

          {/* Critical Threshold: 10°C */}
          <ReferenceLine
            y={10}
            stroke="red"
            strokeDasharray="3 3"
            label={{
              value: 'Critical (10°C)',
              fill: 'red',
              fontSize: 12,
              position: 'right',
            }}
          />

          {/* Temperature Line */}
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#3182ce"
            strokeWidth={2}
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              const isCritical = payload.temperature > 10;
              return (
                <circle
                  cx={cx}
                  cy={cy}
                  r={isCritical ? 6 : 4}
                  fill={isCritical ? 'red' : '#3182ce'}
                  stroke="white"
                  strokeWidth={2}
                />
              );
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
```

**Dashboard Analytics API:**

```typescript
// GET /api/dashboard/analytics
export async function GET(req: Request) {
  const session = await getServerSession();
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const companyId = session.user.companyId;

  // Total products registered by this company
  const totalProducts = await db.product.count({
    where: { companyId },
  });

  // Recent activity feed (last 10 actions)
  const recentActivity = await db.auditLog.findMany({
    where: { companyId },
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
      product: { select: { name: true } },
    },
  });

  // Pending shipments to receive
  const pendingShipments = await db.product.count({
    where: {
      currentHolderId: companyId,
      status: {
        in: ['IN_TRANSIT_TO_DISTRIBUTOR', 'IN_TRANSIT_TO_RETAILER'],
      },
    },
  });

  return Response.json({
    totalProducts,
    recentActivity: recentActivity.map(log => ({
      action: log.action,
      productName: log.product?.name,
      userName: log.user.name,
      timestamp: log.createdAt,
    })),
    pendingShipments,
  });
}
```

#### Dependencies

**Requires:**
- Epic 4 (Component Library) - Card, Badge, Box, Flex, Text components for dashboard widgets
- Epic 7 (Supply Chain Tracking) - Trace records must exist for Timeline visualization
- Epic 9 (Consumer Query Interface) - Timeline and Temperature chart components integrate into consumer product page

**Optional:**
- Epic 8 (IoT Simulator) - Sensor readings for Temperature chart (chart hidden if no sensor data exists)

**Blocks:** None (Epic 12 is enhancement to Epic 9 consumer query page and business dashboards)

**Parallel Development:**
- Can develop Timeline and Temperature chart components in parallel with Epic 9
- Components can be integrated into Epic 9 consumer query page after both complete

#### Team Assignment

**TaiSheng (2-3 hours - Backend Support):**

- Dashboard analytics API (1.5 hours)
  - GET /api/dashboard/analytics endpoint
  - Query total products count by company
  - Query recent activity feed (last 10 audit log entries)
  - Query pending shipments count (IN_TRANSIT status)
  - Return formatted JSON response
- Data aggregation queries optimization (0.5 hours)
  - Add database indexes if needed (companyId, createdAt)
  - Test query performance (<100ms response time)
- Optional platform admin analytics (1 hour, if time permits)
  - GET /api/admin/platform-stats endpoint
  - Query total companies, users, products
  - Query recent blockchain transactions from audit log

**YiLing (5-7 hours - Frontend Lead):**

- Custom Timeline component (2.5 hours)
  - Build Timeline component using Chakra UI Box, Flex, Text, Icon primitives
  - Implement action icons (Received, Shipped, Stocked, Quality Check, Sold)
  - Implement connecting lines between timeline items
  - Mobile-responsive layout (vertical on <768px, horizontal on ≥768px)
  - Empty state handling ("No trace records yet")
  - Integration into Epic 9 consumer query page
- Temperature chart component (2 hours)
  - Install Recharts library: `npm install recharts`
  - Implement TemperatureChart component with Recharts LineChart
  - Add warning/critical reference lines (8°C orange, 10°C red)
  - Highlight critical temperature points (red dots if >10°C)
  - Responsive chart (300px mobile, 600px desktop)
  - Lazy-load chart (only render when scrolled into view)
  - Conditional rendering (hidden if no sensor data from Epic 8)
- Business user dashboard widgets (1.5-2 hours)
  - Total products widget using Epic 4 Card component
  - Recent activity feed widget (last 10 actions)
  - Pending actions widget (products to transfer, shipments to receive)
  - Dashboard layout (stacked vertical on mobile, grid on desktop)
- Optional platform admin dashboard (1.5 hours, if time permits)
  - Platform stats widget (total companies, users, products)
  - Recent blockchain transactions widget with Etherscan links

#### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Recharts library bundle size too large (~400KB, slow loading) | Lazy-load chart component (only render when scrolled into view), use ResponsiveContainer for adaptive sizing, test on 3G network (<500ms render time) |
| Timeline component too complex (custom implementation vs third-party) | Build custom Timeline using Chakra UI primitives (Box, Flex, Text), full control over mobile responsiveness, aligns with Epic 4 Component Library philosophy |
| Mobile timeline performance poor (100+ trace records) | Implement "Load More" pagination (max 10 items initially), vertical layout on mobile (<768px), lazy-load images/icons |
| No trace records exist for timeline testing (Epic 7 not complete) | Use mock data during development, integration testing with Epic 7 after Epic 7 complete, fallback to "No trace records yet" empty state |
| No sensor data exists for temperature chart (Epic 8 skipped) | Conditionally render chart (hidden if no sensor data), temperature chart is optional enhancement, acceptable to skip for MVP |
| Dashboard API queries too slow (>100ms response time) | Add database indexes on companyId and createdAt columns, use Prisma select to fetch only needed fields, implement caching layer (5-minute TTL) |
| Chart library incompatible with Next.js Server Components | Use "use client" directive for Timeline and TemperatureChart components, Recharts requires client-side rendering |
| Behind schedule at Week 7 (Epic 12 lower priority) | Cut platform admin dashboard (optional), simplify timeline to basic list view (fallback), skip temperature chart if Epic 8 not implemented |
| Epic 9 consumer query page not ready for integration | Develop Timeline and TemperatureChart components standalone first, export from Epic 4 Component Library, integrate into Epic 9 after both complete (parallel development) |
| Temperature chart not responsive on small screens (<360px) | Use ResponsiveContainer from Recharts, set minimum width 300px, simplify x-axis labels on mobile (show fewer timestamps) |
| Chart tooltip not accessible (screen reader users) | Add ARIA labels to chart components, use Recharts built-in accessibility features, test with screen reader (NVDA, JAWS) |
