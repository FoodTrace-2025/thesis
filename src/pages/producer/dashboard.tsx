// src/pages/producer/dashboard.tsx
// Story 5.4: Producer Dashboard with Product Registration
// Story 7.7 Enhancement: Add trace features for complete supply chain demo
// PRODUCER role only - shows registered products with trace capabilities

import { useState, useEffect } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import {
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  SimpleGrid,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  Button,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { InfoIcon } from '@chakra-ui/icons';
import { Layout } from '@/components/layout';
import { TraceRecordForm, TraceTimeline } from '@/components/trace';
import NextLink from 'next/link';

// Product type matching API response
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

export default function ProducerDashboard({
  userName,
  userRole,
  companyName,
}: ProducerDashboardProps) {
  // Product list state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state for Add Trace Record
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const toast = useToast();

  // Timeline expand state
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

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

  // Handle Add Trace button click
  const handleAddTrace = (productId: string) => {
    setSelectedProductId(productId);
    onOpen();
  };

  // Handle trace record success
  const handleTraceSuccess = () => {
    onClose();
    setSelectedProductId(null);
    fetchProducts(); // Refetch to update list
    toast({
      title: 'Trace record added',
      description: 'The trace record has been recorded on the blockchain.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  // Toggle timeline visibility
  const toggleTimeline = (productId: string) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Heading color="brand.primary">Producer Dashboard</Heading>
        <Text color="brand.muted">Welcome, {userName}</Text>

        {/* Register New Product Button */}
        <Box>
          <Button as={NextLink} href="/producer/register" size="lg" colorScheme="green">
            Register New Product
          </Button>
        </Box>

        <Box>
          <Heading size="md" color="brand.dark" mb={4}>
            Registered Products
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
                No products registered yet
              </Text>
              <Text color="brand.muted" fontSize="sm" mt={1}>
                Click &quot;Register New Product&quot; to add your first product.
              </Text>
            </Center>
          )}

          {/* Products grid */}
          {!isLoading && !error && products.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {products.map((product) => (
                <Box key={product.id}>
                  <Box
                    borderWidth="1px"
                    borderRadius="lg"
                    borderColor={
                      expandedProductId === product.id
                        ? 'brand.accent'
                        : 'brand.border'
                    }
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
                    <Text fontSize="sm" color="brand.muted" mb={1}>
                      Harvested:{' '}
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </Text>
                    <Text fontSize="sm" color="brand.muted" mb={3}>
                      Current Owner: {product.currentOwner?.name || 'Unknown'}
                    </Text>

                    {/* Action buttons - only show Add Trace if still owned by producer */}
                    <HStack spacing={2}>
                      {product.currentOwner?.name === companyName && (
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleAddTrace(product.id)}
                        >
                          Add Trace
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleTimeline(product.id)}
                      >
                        {expandedProductId === product.id
                          ? 'Hide Timeline'
                          : 'View Timeline'}
                      </Button>
                    </HStack>
                  </Box>

                  {/* Timeline display */}
                  {expandedProductId === product.id && (
                    <Box
                      mt={2}
                      pl={4}
                      borderLeftWidth="2px"
                      borderColor="brand.accent"
                    >
                      <TraceTimeline productId={product.id} />
                    </Box>
                  )}
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      </VStack>

      {/* Add Trace Record Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Trace Record</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedProductId && (
              <TraceRecordForm
                productId={selectedProductId}
                userRole={userRole}
                onSuccess={handleTraceSuccess}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
}
