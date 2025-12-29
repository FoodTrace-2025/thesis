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
  Heading,
  Text,
  VStack,
  Box,
  SimpleGrid,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Layout } from '@/components/layout';
import { type ProductStatus } from '@/components/product';
import { ProductTrendCard } from '@/components/analytics/ProductTrendCard';
import { TrendRange } from '@/components/analytics/trend';

// Product type matching API response (Story 7.12: Added status field)
type OnChainStatus =
  | 'REGISTERED'
  | 'RECEIVED'
  | 'QUALITY_CHECK'
  | 'SHIPPED'
  | 'STOCKED'
  | 'SOLD'
  | 'REJECTED';

const PENDING_STATUS_SET = new Set<OnChainStatus>(['REGISTERED', 'RECEIVED', 'QUALITY_CHECK', 'SHIPPED']);

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

  const normalizeStatus = (status: ProductStatus | OnChainStatus | string | null | undefined) => {
    const raw = (status || '').toString().trim().toUpperCase();
    if (!raw) return '' as OnChainStatus;
    const key = raw.replace(/[\s_-]+/g, '');

    const aliases: Record<string, OnChainStatus> = {
      INSTOCK: 'STOCKED',
      INTRANSIT: 'SHIPPED',
      QUALITYCHECKED: 'QUALITY_CHECK',
      QUALITYCHECK: 'QUALITY_CHECK',
      QUALITYFAIL: 'REJECTED',
      REJECT: 'REJECTED',
    };

    return aliases[key] || (raw as OnChainStatus);
  };

  const { totalProducts, onChainRecords, pendingVerifications, rejectedProducts } = useMemo(() => {
    let pending = 0;
    let rejected = 0;

    for (const product of products) {
      const status = normalizeStatus(product.status);
      if (PENDING_STATUS_SET.has(status as OnChainStatus)) pending += 1;
      if (status === 'REJECTED') rejected += 1;
    }

    return {
      totalProducts: products.length,
      onChainRecords: products.length,
      pendingVerifications: pending,
      rejectedProducts: rejected,
    };
  }, [products]);

  return (
    <Layout>
      <VStack align="stretch" spacing={6} py={6}>
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={3}
          wrap="wrap"
        >
          <Heading size="lg" color="brand.dark">
            Producer Dashboard
          </Heading>
          <Button
            type="button"
            onClick={() => router.push("/producer/register")}
            leftIcon={<AddIcon />}
            width={{ base: "100%", sm: "auto" }}
          >
            Create Batch
          </Button>
        </Flex>

        {/* KPIs */}
        {!isLoading && !error && (
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <KpiCard label="Total Batches" value={totalProducts.toString()} />
            <KpiCard label="On-chain Records" value={onChainRecords.toString()} />
            <KpiCard label="Pending Verifications" value={pendingVerifications.toString()} />
            <KpiCard label="Rejected Products" value={rejectedProducts.toString()} valueSize="2xl" />
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
          <ProductTrendCard
            products={products}
            range={range}
            onRangeChange={setRange}
          />
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
