// src/pages/distributor/dashboard.tsx
// Story 7.6: Distributor Dashboard - Product List & Layout
// DISTRIBUTOR role only - displays products in company's custody

import { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import {
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
  Icon,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { Layout } from '@/components/layout';

// Product type matching API response (Story 7.4)
interface Product {
  id: string;
  name: string;
  origin: string;
  blockchainId: number;
  harvestDate: string;
  currentOwner: { name: string } | null;
  createdAt: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  if (session.user.role !== 'DISTRIBUTOR') {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }

  return {
    props: {
      userName: session.user.name || session.user.email,
      userRole: session.user.role,
      companyId: session.user.companyId,
    },
  };
}

interface DistributorDashboardProps {
  userName: string;
  userRole: string;
  companyId: string | null;
}

export default function DistributorDashboard({
  userName,
}: DistributorDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products - callable for retry functionality
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/products?owner=me');
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

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Heading color="brand.primary">Distributor Dashboard</Heading>
        <Text color="brand.muted">Welcome, {userName}</Text>

        <Box>
          <Heading size="md" color="brand.dark" mb={4}>
            Products in Custody
          </Heading>

          {/* Loading state */}
          {isLoading && (
            <Center py={8}>
              <Spinner size="lg" color="brand.primary" />
            </Center>
          )}

          {/* Error state with retry */}
          {error && !isLoading && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box flex="1">{error}</Box>
              <Button size="sm" onClick={fetchProducts}>
                Retry
              </Button>
            </Alert>
          )}

          {/* Empty state */}
          {!isLoading && !error && products.length === 0 && (
            <Center py={8} flexDirection="column">
              <Icon as={InfoIcon} boxSize={8} color="brand.muted" mb={3} />
              <Text color="brand.muted" fontWeight="medium">
                No products in custody yet
              </Text>
              <Text color="brand.muted" fontSize="sm" mt={1}>
                Products will appear here when you receive them.
              </Text>
            </Center>
          )}

          {/* Products grid */}
          {!isLoading && !error && products.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {products.map((product) => (
                <Box
                  key={product.id}
                  borderWidth="1px"
                  borderRadius="lg"
                  borderColor="brand.border"
                  bg="brand.surface"
                  p={4}
                >
                  <Heading size="sm" color="brand.dark" mb={2}>
                    {product.name}
                  </Heading>
                  <Text fontSize="sm" color="brand.muted">
                    Product #{product.blockchainId}
                  </Text>
                  <Text fontSize="sm" color="brand.muted">
                    Origin: {product.origin}
                  </Text>
                  <Text fontSize="sm" color="brand.muted">
                    Harvested: {new Date(product.harvestDate).toLocaleDateString()}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>
    </Layout>
  );
}
