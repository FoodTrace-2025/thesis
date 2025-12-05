// src/pages/distributor/dashboard.tsx
// Story 7.6: Distributor Dashboard - Product List & Layout
// Story 7.7: Trace Features - Modal, Timeline, Receive Product
// Story 7.7 Enhancement: Only show Add Trace when distributor owns the product
// DISTRIBUTOR role only - displays products in company's custody

import { useState, useEffect, useCallback } from 'react';
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
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { InfoIcon, ViewIcon } from '@chakra-ui/icons';
import { Layout } from '@/components/layout';
import { TraceRecordForm, TraceTimeline } from '@/components/trace';
import { StatusBadge, type ProductStatus } from '@/components/product';
import { QRScanner } from '@/components/scanner';

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

export default function DistributorDashboard({
  userName,
  userRole,
  companyName,
}: DistributorDashboardProps) {
  // Product list state (Story 7.6)
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state for Add Trace Record (Story 7.7 Task 1)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const toast = useToast();

  // Timeline expand state (Story 7.7 Task 2)
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // Receive Product state (Story 7.7 Task 3)
  const [blockchainIdInput, setBlockchainIdInput] = useState('');
  const [lookupProduct, setLookupProduct] = useState<Product | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  // QR Scanner state (Story 7.10)
  const {
    isOpen: isScannerOpen,
    onOpen: onScannerOpen,
    onClose: onScannerClose,
  } = useDisclosure();

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

  // Handle Add Trace button click (Story 7.7 Task 1)
  const handleAddTrace = (productId: string) => {
    setSelectedProductId(productId);
    onOpen();
  };

  // Handle trace record success (Story 7.7 Task 1)
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

  // Toggle timeline visibility (Story 7.7 Task 2)
  const toggleTimeline = (productId: string) => {
    setExpandedProductId((prev) => (prev === productId ? null : productId));
  };

  // Lookup product by blockchainId (Story 7.7 Task 3, Story 7.10 enhancement)
  const handleLookup = async (idOverride?: string) => {
    const idToLookup = idOverride || blockchainIdInput.trim();
    if (!idToLookup) return;
    setIsLookingUp(true);
    setLookupError('');
    setLookupProduct(null);

    try {
      const response = await fetch(`/api/products/${idToLookup}`);
      const data = await response.json();
      if (!response.ok) {
        setLookupError(data.error || 'Product not found');
        return;
      }
      setLookupProduct(data.product);
    } catch {
      setLookupError('Network error. Please try again.');
    } finally {
      setIsLookingUp(false);
    }
  };

  // Handle QR scan success (Story 7.10)
  const handleScan = useCallback(
    (productId: string) => {
      onScannerClose();
      setBlockchainIdInput(productId);
      handleLookup(productId);
    },
    [onScannerClose]
  );

  // Handle receive success (Story 7.7 Task 3)
  const handleReceiveSuccess = () => {
    setLookupProduct(null);
    setBlockchainIdInput('');
    fetchProducts(); // Refetch to show new product in custody
    toast({
      title: 'Product received',
      description: 'The product is now in your custody.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Heading color="brand.primary">Distributor Dashboard</Heading>
        <Text color="brand.muted">Welcome, {userName}</Text>

        {/* Receive New Product Section (Story 7.7 Task 3) */}
        <Box
          borderWidth="1px"
          borderRadius="lg"
          borderColor="brand.border"
          bg="brand.surface"
          p={4}
        >
          <Heading size="md" color="brand.dark" mb={4}>
            Receive New Product
          </Heading>
          <HStack spacing={4} mb={4} flexWrap="wrap">
            <Input
              placeholder="Enter Blockchain ID (e.g., 1)"
              value={blockchainIdInput}
              onChange={(e) => setBlockchainIdInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              maxW="300px"
            />
            <Button
              colorScheme="green"
              onClick={() => handleLookup()}
              isLoading={isLookingUp}
              loadingText="Looking up..."
            >
              Look Up
            </Button>
            <Button
              variant="outline"
              leftIcon={<ViewIcon />}
              onClick={onScannerOpen}
            >
              Scan QR
            </Button>
          </HStack>

          {/* Lookup error */}
          {lookupError && (
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              {lookupError}
            </Alert>
          )}

          {/* Lookup result */}
          {lookupProduct && (
            <Box
              borderWidth="1px"
              borderRadius="md"
              borderColor="brand.accent"
              p={4}
              bg="brand.surfaceAlt"
            >
              <Heading size="sm" color="brand.dark" mb={2}>
                {lookupProduct.name}
              </Heading>
              <Text fontSize="sm" color="brand.muted" mb={1}>
                Product #{lookupProduct.blockchainId}
              </Text>
              <Text fontSize="sm" color="brand.muted" mb={4}>
                Origin: {lookupProduct.origin}
              </Text>

              <Heading size="xs" color="brand.dark" mb={2}>
                Add RECEIVED Trace Record
              </Heading>
              <TraceRecordForm
                productId={lookupProduct.id}
                userRole={userRole}
                onSuccess={handleReceiveSuccess}
              />
            </Box>
          )}
        </Box>

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
                    {/* Story 7.12: Name + Status Badge */}
                    <HStack justify="space-between" mb={2}>
                      <Heading size="sm" color="brand.dark">
                        {product.name}
                      </Heading>
                      <StatusBadge status={product.status} />
                    </HStack>
                    <Text fontSize="sm" color="brand.muted">
                      Product #{product.blockchainId}
                    </Text>
                    <Text fontSize="sm" color="brand.muted">
                      Origin: {product.origin}
                    </Text>
                    <Text fontSize="sm" color="brand.muted">
                      Harvested:{' '}
                      {new Date(product.harvestDate).toLocaleDateString()}
                    </Text>
                    <Text fontSize="sm" color="brand.muted" mb={3}>
                      Current Owner: {product.currentOwner?.name || 'Sold to Consumer'}
                    </Text>

                    {/* Action buttons (Story 7.7 Task 1 & 2) */}
                    {/* Only show Add Trace if distributor still owns the product */}
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

                  {/* Timeline display (Story 7.7 Task 2) */}
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

      {/* Add Trace Record Modal (Story 7.7 Task 1) */}
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

      {/* QR Scanner Modal (Story 7.10) */}
      <Modal isOpen={isScannerOpen} onClose={onScannerClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scan Product QR Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <QRScanner onScan={handleScan} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
}
