// src/pages/retailer/dashboard.tsx
// Retailer dashboard showing KPI snapshots + sales trend chart

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import { Heading, Text, VStack, SimpleGrid, Box } from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { type ProductStatus } from '@/components/product';
import { ProductTrendCard } from '@/components/analytics/ProductTrendCard';
import { TrendRange } from '@/components/analytics/trend';

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

interface IncomingProduct extends Product {
  shippedBy?: { name: string };
  shippedAt?: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  if (session.user.role !== 'RETAILER') {
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

interface RetailerDashboardProps {
  userName: string;
  userRole: string;
  companyId: string | null;
  companyName: string;
}

export default function RetailerDashboard({ userName }: RetailerDashboardProps) {
  const [inStockProducts, setInStockProducts] = useState<Product[]>([]);
  const [historyProducts, setHistoryProducts] = useState<Product[]>([]);
  const [incomingProducts, setIncomingProducts] = useState<IncomingProduct[]>([]);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [range, setRange] = useState<TrendRange>('7d');

  const fetchInStockProducts = async () => {
    try {
      const response = await fetch('/api/products?owner=me');
      const data = await response.json();
      if (!response.ok) return;
      setInStockProducts(data.products);
    } catch {
      // ignore snapshot errors
    }
  };

  const fetchHistoryProducts = async () => {
    try {
      const response = await fetch('/api/products?history=me');
      const data = await response.json();
      if (!response.ok) return;
      setHistoryProducts(data.products);
      setHistoryLoaded(true);
    } catch {
      // ignore snapshot errors
    }
  };

  const fetchIncomingProducts = async () => {
    try {
      const response = await fetch('/api/products?incoming=me');
      const data = await response.json();
      if (!response.ok) return;
      setIncomingProducts(data.products);
    } catch {
      // ignore snapshot errors
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

  const soldProducts = useMemo(
    () =>
      historyProducts.filter(
        (p) => (p.status || '').toString().toUpperCase() === 'SOLD'
      ),
    [historyProducts]
  );

  const soldForTrend = useMemo(
    () => filterByRange(soldProducts),
    [filterByRange, soldProducts]
  );

  useEffect(() => {
    fetchInStockProducts();
    fetchIncomingProducts();
  }, []);

  useEffect(() => {
    if (!historyLoaded) {
      fetchHistoryProducts();
    }
  }, [historyLoaded]);

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Heading color="brand.primary">Retailer Dashboard</Heading>
        <Text color="brand.muted">Welcome, {userName}</Text>

        {/* Story 7.20: KPI snapshots (not range-filtered) */}
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
          <KpiCard label="Total Products" value={historyProducts.length.toString()} />
          <KpiCard label="In Custody" value={inStockProducts.length.toString()} />
          <KpiCard label="Incoming Shipments" value={incomingProducts.length.toString()} />
          <KpiCard label="Sold Products" value={soldProducts.length.toString()} />
        </SimpleGrid>

        {/* Story 7.20: Trend respects range selector */}
        <ProductTrendCard
          title="Sales Trend Overview"
          products={soldForTrend}
          range={range}
          onRangeChange={setRange}
          footerText="Counts of sold products over time"
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
