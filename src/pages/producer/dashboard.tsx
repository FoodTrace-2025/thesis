// src/pages/producer/dashboard.tsx
// Story 5.4: Producer Dashboard with Product Registration
// Story 7.7 Enhancement: Add trace features for complete supply chain demo
// PRODUCER role only - shows registered products with trace capabilities

import { useState, useEffect, useMemo } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { useRouter } from "next/router";
import {
  Flex,
  Text,
  VStack,
  Box,
  SimpleGrid,
  Spinner,
  Center,
  HStack,
  Alert,
  AlertIcon,
  Button,
  Select,
  useToken,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Layout } from '@/components/layout';
import { type ProductStatus } from '@/components/product';

// Product type matching API response (Story 7.12: Added status field)
type OnChainStatus =
  | 'REGISTERED'
  | 'RECEIVED'
  | 'QUALITY_CHECK'
  | 'SHIPPED'
  | 'STOCKED'
  | 'SOLD'
  | 'REJECTED';

interface Product {
  id: string;
  name: string;
  origin: string;
  blockchainId: number;
  harvestDate: string;
  currentOwner: { name: string } | null;
  status: ProductStatus | OnChainStatus;
  createdAt: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  if (session.user.role !== 'PRODUCER') {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }

  // Get company name for ownership comparison
  let companyName = '';
  if (session.user.companyId) {
    const company = await prisma.company.findUnique({
      where: { id: session.user.companyId },
      select: { name: true },
    });
    companyName = company?.name || '';
  }

  return {
    props: {
      userName: session.user.name || session.user.email,
      userRole: session.user.role,
      companyId: session.user.companyId,
      companyName,
    },
  };
}

interface ProducerDashboardProps {
  userName: string;
  userRole: string;
  companyId: string | null;
  companyName: string;
}

export default function ProducerDashboard({}: ProducerDashboardProps) {
  const router = useRouter();
  type TrendRange = '7d' | '30d' | '1y';
  // Product list state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [range, setRange] = useState<TrendRange>('7d');

  // Fetch products registered by this company
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products?company=me');
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to fetch products');
        return;
      }
      setProducts(data.products);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  type TrendPoint = { label: string; value: number; raw: string };

  const filteredProducts = useMemo(() => {
    const now = new Date();
    const rangeDays = range === '7d' ? 7 : range === '30d' ? 30 : 365;
    const start = new Date(now);
    start.setDate(now.getDate() - (rangeDays - 1));

    return products.filter((p) => {
      const created = new Date(p.createdAt);
      return created >= start && created <= now;
    });
  }, [products, range]);

  const trendData = useMemo<TrendPoint[]>(() => {
    const now = new Date();

    const sameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const sameMonth = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth();

    if (range === '7d') {
      const days: TrendPoint[] = [];
      for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const raw = day.toISOString().split('T')[0];
        const count = filteredProducts.filter((p) =>
          sameDay(new Date(p.createdAt), day)
        ).length;
        days.push({
          label: raw,
          value: count,
          raw,
        });
      }
      return days;
    }

    if (range === '30d') {
      const days: TrendPoint[] = [];
      for (let i = 29; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        const raw = day.toISOString().split('T')[0];
        const count = filteredProducts.filter((p) =>
          sameDay(new Date(p.createdAt), day)
        ).length;
        days.push({
          label: raw,
          value: count,
          raw,
        });
      }
      return days;
    }

    // 1 year -> 12 months
    const months: TrendPoint[] = [];
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now);
      month.setMonth(now.getMonth() - i);
      const raw = new Date(Date.UTC(month.getFullYear(), month.getMonth(), 1))
        .toISOString()
        .split('T')[0];
      const count = filteredProducts.filter((p) =>
        sameMonth(new Date(p.createdAt), month)
      ).length;
      months.push({
        label: raw,
        value: count,
        raw,
      });
    }
    return months;
  }, [filteredProducts, range]);

  const normalizeStatus = (status: ProductStatus | OnChainStatus | string | null | undefined) =>
    (status || '').toString().toUpperCase();

  const pendingStatuses = new Set<OnChainStatus>(['REGISTERED', 'RECEIVED', 'QUALITY_CHECK', 'SHIPPED']);
  const pendingVerifications = filteredProducts.filter((p) => pendingStatuses.has(normalizeStatus(p.status) as OnChainStatus)).length;
  const rejectedBatches = filteredProducts.filter((p) => normalizeStatus(p.status) === 'REJECTED').length;
  const filteredCount = filteredProducts.length;

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={3}
          wrap="wrap"
        >
          <Text fontSize="xl" fontWeight="semibold" color="brand.dark">
            My Batches
          </Text>
          <Button
            type="button"
            onClick={() => router.push("/producer/register")}
            leftIcon={<AddIcon />}
            width={{ base: "100%", sm: "auto" }}
          >
            Create Batch
          </Button>
        </Flex>

        {/* Filters row placeholder */}
        <Flex
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          gap={3}
          wrap="wrap"
          py={2}
        >
          <Select
            maxW="200px"
            value={range}
            onChange={(e) => setRange(e.target.value as TrendRange)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="1y">Last 1 year</option>
          </Select>
        </Flex>

        {/* KPIs */}
        {!isLoading && !error && (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <KpiCard label="Total Batches" value={filteredCount.toString()} />
            <KpiCard label="On-chain Records" value={filteredCount.toString()} />
            <KpiCard label="Pending Verifications" value={pendingVerifications.toString()} />
            <KpiCard label="Rejected Batches" value={rejectedBatches.toString()} valueSize="2xl" />
          </SimpleGrid>
        )}

        {/* Loading / Error */}
        {isLoading && (
          <Center py={8}>
            <Spinner size="lg" color="brand.primary" />
          </Center>
        )}
        {error && !isLoading && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            <Box flex="1">{error}</Box>
            <Button size="sm" onClick={fetchProducts}>
              Retry
            </Button>
          </Alert>
        )}

        {/* Trend placeholder */}
        {!isLoading && !error && (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            borderColor="brand.border"
            bg="brand.surface"
            p={4}
          >
            <HStack justify="space-between" mb={3}>
              <Text fontWeight="semibold" color="brand.dark">
                Batch Trend Overview
              </Text>
              <Text fontSize="sm" color="brand.muted">
                {trendData.length
                  ? range === '7d'
                    ? 'Last 7 days'
                    : range === '30d'
                    ? 'Last 30 days'
                    : 'Last 1 year'
                  : 'No data'}
              </Text>
            </HStack>
            {trendData.length === 0 ? (
              <Center py={12} color="brand.muted">
                No batch activity yet.
              </Center>
            ) : (
              <Box
                bg="brand.surfaceAlt"
                borderRadius="md"
                borderWidth="1px"
                borderColor="brand.border"
                p={3}
              >
                <TrendChart data={trendData} range={range} />
              </Box>
            )}
            <Text fontSize="xs" color="brand.muted" mt={3}>
              Data source: Sepolia (counts per created date)
            </Text>
          </Box>
        )}
      </VStack>
    </Layout>
  );
}

function KpiCard({ label, value, valueSize = "2xl" }: { label: string; value: string; valueSize?: string }) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      borderColor="brand.border"
      bg="brand.surface"
      p={4}
    >
      <Text fontSize="sm" color="brand.muted">
        {label}
      </Text>
      <Text fontSize={valueSize} fontWeight="semibold" color="brand.primary">
        {value}
      </Text>
    </Box>
  );
}

function TrendChart({
  data,
  range,
}: {
  data: { label: string; value: number; raw: string }[];
  range: '7d' | '30d' | '1y';
}) {
  const width = 700;
  const height = 240;
  const [brandPrimary, brandBorder, brandMuted] = useToken("colors", [
    "brand.primary",
    "brand.border",
    "brand.muted",
  ]);
  const padding = { left: 36, right: 16, top: 12, bottom: 28 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const ySpan = plotHeight - 12;
  const xAxisY = padding.top + plotHeight;
  const yRules = {
    '7d': { max: 20, step: 2 },
    '30d': { max: 50, step: 5 },
    '1y': { max: 100, step: 10 },
  } as const;
  const { max, step } = yRules[range];
  const yTicks = Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);

  const pickXLabels = () => {
    if (range === '30d') {
      const count = data.length;
      if (count <= 6) return data.map((item, idx) => ({ idx, label: item.raw ?? item.label }));
      const slots = 5; // ~4-6 labels
      const indices = Array.from({ length: slots }, (_, i) =>
        Math.min(count - 1, Math.round((i / (slots - 1)) * (count - 1)))
      );
      const uniqueIdx = Array.from(new Set(indices));
      return uniqueIdx.map((idx) => ({
        idx,
        label: data[idx].raw ?? data[idx].label,
      }));
    }
    return data.map((item, idx) => ({ idx, label: item.raw ?? item.label }));
  };

  const xLabels = pickXLabels();

  const formatLabel = (raw: string) => {
    if (!raw || typeof raw !== 'string') return '';
    const [year, month, day] = raw.split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    if (isNaN(date.getTime())) return raw;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getUTCMonth()]} ${date.getUTCDate()}`;
  };

  const points = data.map((item, idx) => {
    const x = padding.left + (idx / Math.max(data.length - 1, 1)) * plotWidth;
    const capped = Math.min(item.value, max);
    const yPos = xAxisY - (capped / max) * ySpan;
    return { x, y: yPos };
  });

  const pathD =
    points.length > 1
      ? [
          `M ${padding.left} ${xAxisY}`,
          `L ${points[0].x} ${points[0].y}`,
          ...points.slice(1).map((p) => `L ${p.x} ${p.y}`),
          `L ${points[points.length - 1].x} ${xAxisY}`,
          'Z',
        ].join(' ')
      : `M ${padding.left} ${xAxisY} L ${padding.left + plotWidth} ${xAxisY} L ${padding.left + plotWidth} ${xAxisY - 1} Z`;

  const strokePath =
    points.length > 1
      ? [
          `M ${points[0].x} ${points[0].y}`,
          ...points.slice(1).map((p) => `L ${p.x} ${p.y}`),
        ].join(' ')
      : '';

  return (
    <Box overflow="hidden">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} role="img">
        <defs>
          <linearGradient id="trendFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={brandPrimary} stopOpacity="0.9" />
            <stop offset="100%" stopColor={brandPrimary} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        {/* Axes */}
        <line
          x1={padding.left}
          x2={padding.left}
          y1={padding.top}
          y2={xAxisY}
          stroke={brandBorder}
          strokeWidth="1"
        />
        <line
          x1={padding.left}
          x2={padding.left + plotWidth}
          y1={xAxisY}
          y2={xAxisY}
          stroke={brandBorder}
          strokeWidth="1"
        />
        {/* Y ticks */}
        {yTicks.map((tick) => {
          const yPos = xAxisY - (tick / max) * ySpan;
          return (
            <g key={tick}>
              <line
                x1={padding.left}
                x2={padding.left + plotWidth}
                y1={yPos}
                y2={yPos}
                stroke={brandBorder}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 8}
                y={yPos + 3}
                fill={brandMuted}
                fontSize="10"
                textAnchor="end"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* area */}
        <path d={pathD} fill="url(#trendFill)" />
        {/* stroke */}
        {strokePath && (
          <path
            d={strokePath}
            fill="none"
            stroke={brandPrimary}
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* X labels */}
        {xLabels.map(({ idx, label }) => {
          const x = padding.left + (idx / Math.max(data.length - 1, 1)) * plotWidth;
          return (
            <text
              key={idx}
              x={x}
              y={xAxisY + 16}
              fill={brandMuted}
              fontSize="10"
              textAnchor="middle"
            >
              {formatLabel(label)}
            </text>
          );
        })}
      </svg>
    </Box>
  );
}
