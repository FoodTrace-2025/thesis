// src/pages/distributor/dashboard.tsx
// Story 7.6: Distributor Dashboard - Product List & Layout
// Story 7.7: Trace Features - Modal, Timeline, Receive Product
// Story 7.7 Enhancement: Only show Add Trace when distributor owns the product
// Story 7.14: Dashboard Tabs - In Custody + Product History
// Story 7.17: Incoming Shipments section with Accept workflow
// DISTRIBUTOR role only - displays products in company's custody

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import {
  Heading,
  Text,
  VStack,
  Box,
  SimpleGrid,
} from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { type ProductStatus } from '@/components/product';
import { ProductTrendCard } from '@/components/analytics/ProductTrendCard';
import { TrendRange } from '@/components/analytics/trend';

// Product type matching API response (Story 7.4, 7.12: Added status field)
interface Product {
  id: string;
  name: string;
  origin: string;
  blockchainId: number;
  harvestDate: string;
  currentOwner: { name: string } | null;
  status: ProductStatus;
  createdAt: string;
}

// Story 7.17: Incoming product with shipping info
interface IncomingProduct extends Product {
  shippedBy?: { name: string };
  shippedAt?: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  if (session.user.role !== 'DISTRIBUTOR') {
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

interface DistributorDashboardProps {
  userName: string;
  userRole: string;
  companyId: string | null;
  companyName: string;
}

export default function DistributorDashboard({}: DistributorDashboardProps) {
  // Product list state (Story 7.6, 7.14: Tabs)
  const [custodyProducts, setCustodyProducts] = useState<Product[]>([]);

  // Story 7.14: Product History tab state
  const [historyProducts, setHistoryProducts] = useState<Product[]>([]);

  // Story 7.17: Incoming Shipments state
  const [incomingProducts, setIncomingProducts] = useState<IncomingProduct[]>([]);


  // Trend range state
  const [range, setRange] = useState<TrendRange>('7d');

  // Fetch custody products (owner=me) - callable for retry functionality
  const fetchCustodyProducts = async () => {
    try {
      const response = await fetch('/api/products?owner=me');
      const data = await response.json();
      if (!response.ok) {
        return;
      }
      setCustodyProducts(data.products);
    } catch {
    }
  };

  // Story 7.14: Fetch history products (history=me) - lazy loaded on tab switch
  const fetchHistoryProducts = async () => {
    try {
      const response = await fetch('/api/products?history=me');
      const data = await response.json();
      if (!response.ok) {
        return;
      }
      setHistoryProducts(data.products);
    } catch {
    }
  };

  // Story 7.17: Fetch incoming shipments (incoming=me)
  const fetchIncomingProducts = async () => {
    try {
      const response = await fetch('/api/products?incoming=me');
      const data = await response.json();
      if (!response.ok) {
        return;
      }
      setIncomingProducts(data.products);
    } catch {
    }
  };


  const filterByRange = useCallback(
    <T extends { createdAt: string }>(items: T[]): T[] => {
      const now = new Date();
      const rangeDays = range === '7d' ? 7 : range === '30d' ? 30 : 365;
      const start = new Date(now);
      start.setDate(now.getDate() - (rangeDays - 1));
      return items.filter((item) => {
        const created = new Date(item.createdAt);
        return created >= start && created <= now;
      });
    },
    [range]
  );

  // Range applies only to historical/handled products (not current snapshots)
  const filteredHistory = useMemo(() => filterByRange(historyProducts), [filterByRange, historyProducts]);

  const allProductsForTrend = useMemo(
    () => [...filteredHistory],
    [filteredHistory]
  );

  const custodyIds = useMemo(() => new Set(custodyProducts.map((p) => p.id)), [custodyProducts]);
  const incomingIds = useMemo(() => new Set(incomingProducts.map((p) => p.id)), [incomingProducts]);

  const totalShipments = useMemo(() => {
    const ids = new Set<string>();
    historyProducts.forEach((p) => ids.add(p.id));
    return ids.size;
  }, [historyProducts]);

  const inCustody = custodyProducts.length;
  const incomingCount = incomingProducts.length;

  const completedCount = useMemo(() => {
    let count = 0;
    historyProducts.forEach((p) => {
      if (!custodyIds.has(p.id) && !incomingIds.has(p.id)) {
        count += 1;
      }
    });
    return count;
  }, [historyProducts, custodyIds, incomingIds]);

  // Fetch custody and incoming products on mount
  useEffect(() => {
    fetchCustodyProducts();
    fetchIncomingProducts(); // Story 7.17
  }, []);

  // Ensure history data is available for KPIs/trend
  useEffect(() => {
    fetchHistoryProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout>
      <VStack align="stretch" spacing={6} py={6}>
        <Heading size="lg" color="brand.dark">
          Distributor Dashboard
        </Heading>

        {/* KPI Row */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <KpiCard label="Total Shipments" value={totalShipments.toString()} />
          <KpiCard label="In Custody" value={inCustody.toString()} />
          <KpiCard label="Incoming Shipments" value={incomingCount.toString()} />
          <KpiCard label="Completed" value={completedCount.toString()} />
        </SimpleGrid>

        {/* Trend */}
        <ProductTrendCard
          title="Shipments Trend Overview"
          products={allProductsForTrend}
          range={range}
          onRangeChange={setRange}
          footerText="Data source: Sepolia (counts per created date)"
        />
      </VStack>
    </Layout>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
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
      <Text fontSize="2xl" fontWeight="semibold" color="brand.primary">
        {value}
      </Text>
    </Box>
  );
}
