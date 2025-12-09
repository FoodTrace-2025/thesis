// src/pages/retailer/dashboard.tsx
// Story 7.8: Retailer Dashboard
// Story 7.15: Dashboard Tabs - In Stock + Product History
// Story 7.17: Incoming Shipments section with Accept workflow
// Same pattern as Distributor Dashboard (Story 7.7, 7.14)
// RETAILER role only - displays products in company's custody

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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
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

export default function RetailerDashboard({
  userName,
  userRole,
  companyName,
}: RetailerDashboardProps) {
  // Product list state (Story 7.8, 7.15: Tabs)
  const [inStockProducts, setInStockProducts] = useState<Product[]>([]);
  const [inStockLoading, setInStockLoading] = useState(true);
  const [inStockError, setInStockError] = useState<string | null>(null);

  // Story 7.15: Product History tab state
  const [historyProducts, setHistoryProducts] = useState<Product[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Story 7.17: Incoming Shipments state
  const [incomingProducts, setIncomingProducts] = useState<IncomingProduct[]>([]);
  const [incomingLoading, setIncomingLoading] = useState(true);
  const [incomingError, setIncomingError] = useState<string | null>(null);

  // Modal state for Add Trace Record
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const toast = useToast();

  // Story 7.17: Accept modal state for incoming shipments
  const {
    isOpen: isAcceptOpen,
    onOpen: onAcceptOpen,
    onClose: onAcceptClose,
  } = useDisclosure();
  const [acceptProductId, setAcceptProductId] = useState<string | null>(null);

  // Timeline expand state
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);

  // Receive Product state
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

  // Fetch in-stock products (owner=me) - callable for retry functionality
  const fetchInStockProducts = async () => {
    setInStockLoading(true);
    setInStockError(null);
    try {
      const response = await fetch('/api/products?owner=me');
      const data = await response.json();
      if (!response.ok) {
        setInStockError(data.error || 'Failed to fetch products');
        return;
      }
      setInStockProducts(data.products);
    } catch {
      setInStockError('Network error. Please try again.');
    } finally {
      setInStockLoading(false);
    }
  };

  // Story 7.15: Fetch history products (history=me) - lazy loaded on tab switch
  const fetchHistoryProducts = async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const response = await fetch('/api/products?history=me');
      const data = await response.json();
      if (!response.ok) {
        setHistoryError(data.error || 'Failed to fetch history');
        return;
      }
      setHistoryProducts(data.products);
      setHistoryLoaded(true);
    } catch {
      setHistoryError('Network error. Please try again.');
    } finally {
      setHistoryLoading(false);
    }
  };

  // Story 7.17: Fetch incoming shipments (incoming=me)
  const fetchIncomingProducts = async () => {
    setIncomingLoading(true);
    setIncomingError(null);
    try {
      const response = await fetch('/api/products?incoming=me');
      const data = await response.json();
      if (!response.ok) {
        setIncomingError(data.error || 'Failed to fetch incoming shipments');
        return;
      }
      setIncomingProducts(data.products);
    } catch {
      setIncomingError('Network error. Please try again.');
    } finally {
      setIncomingLoading(false);
    }
  };

  // Story 7.15: Handle tab change - lazy load history on first click
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    if (index === 1 && !historyLoaded) {
      fetchHistoryProducts();
    }
  };

  // Fetch in-stock and incoming products on mount
  useEffect(() => {
    fetchInStockProducts();
    fetchIncomingProducts(); // Story 7.17
  }, []);

  // Handle Add Trace button click
  const handleAddTrace = (productId: string) => {
    setSelectedProductId(productId);
    onOpen();
  };

  // Handle trace record success (Story 7.8, 7.15: Refetch both lists)
  const handleTraceSuccess = () => {
    onClose();
    setSelectedProductId(null);
    fetchInStockProducts(); // Refetch in-stock list
    if (historyLoaded) {
      fetchHistoryProducts(); // Refetch history if already loaded
    }
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

  // Lookup product by blockchainId (Story 7.10 enhancement)
  const handleLookup = useCallback(
    async (idOverride?: string) => {
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
    },
    [blockchainIdInput]
  );

  // Handle QR scan success (Story 7.10)
  const handleScan = useCallback(
    (productId: string) => {
      onScannerClose();
      setBlockchainIdInput(productId);
      handleLookup(productId);
    },
    [onScannerClose, handleLookup]
  );

  // Handle receive success (Story 7.8, 7.15: Refetch both lists)
  const handleReceiveSuccess = () => {
    setLookupProduct(null);
    setBlockchainIdInput('');
    fetchInStockProducts(); // Refetch in-stock list
    if (historyLoaded) {
      fetchHistoryProducts(); // Refetch history if already loaded
    }
    toast({
      title: 'Product received',
      description: 'The product is now in your custody.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  // Story 7.17: Handle Accept button click
  const handleAcceptClick = (productId: string) => {
    setAcceptProductId(productId);
    onAcceptOpen();
  };

  // Story 7.17: Handle Accept success - product moves from incoming to in-stock
  const handleAcceptSuccess = () => {
    onAcceptClose();
    setAcceptProductId(null);
    fetchIncomingProducts(); // Refetch incoming (product should disappear)
    fetchInStockProducts(); // Refetch in-stock (product should appear)
    if (historyLoaded) {
      fetchHistoryProducts(); // Refetch history if already loaded
    }
    toast({
      title: 'Shipment accepted',
      description: 'The product is now in your stock.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Heading color="brand.primary">Retailer Dashboard</Heading>
        <Text color="brand.muted">Welcome, {userName}</Text>

        {/* Story 7.17: Incoming Shipments Section */}
        <Box
          borderWidth="1px"
          borderRadius="lg"
          borderColor="brand.border"
          bg="brand.surface"
          p={4}
        >
          <HStack justify="space-between" mb={4}>
            <HStack>
              <Heading size="md" color="brand.dark">
                Incoming Shipments
              </Heading>
              <Badge colorScheme="orange" borderRadius="full" fontSize="sm">
                {incomingProducts.length}
              </Badge>
            </HStack>
            <Button size="sm" variant="ghost" onClick={fetchIncomingProducts}>
              Refresh
            </Button>
          </HStack>

          {/* Loading state */}
          {incomingLoading && (
            <Center py={6}>
              <Spinner size="md" color="brand.primary" />
            </Center>
          )}

          {/* Error state */}
          {incomingError && !incomingLoading && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box flex="1">{incomingError}</Box>
              <Button size="sm" onClick={fetchIncomingProducts}>
                Retry
              </Button>
            </Alert>
          )}

          {/* Empty state */}
          {!incomingLoading && !incomingError && incomingProducts.length === 0 && (
            <Center py={6} flexDirection="column">
              <Icon as={InfoIcon} boxSize={6} color="brand.muted" mb={2} />
              <Text color="brand.muted" fontSize="sm">
                No incoming shipments
              </Text>
            </Center>
          )}

          {/* Incoming products list */}
          {!incomingLoading && !incomingError && incomingProducts.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {incomingProducts.map((product) => (
                <Box
                  key={product.id}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor="orange.200"
                  bg="orange.50"
                  p={4}
                >
                  <HStack justify="space-between" mb={2}>
                    <Heading size="sm" color="brand.dark">
                      {product.name}
                    </Heading>
                    <StatusBadge status="IN_TRANSIT" />
                  </HStack>
                  <Text fontSize="sm" color="brand.muted">
                    Product #{product.blockchainId}
                  </Text>
                  <Text fontSize="sm" color="brand.muted">
                    Origin: {product.origin}
                  </Text>
                  {product.shippedBy && (
                    <Text fontSize="sm" color="brand.muted">
                      Shipped by: {product.shippedBy.name}
                    </Text>
                  )}
                  {product.shippedAt && (
                    <Text fontSize="sm" color="brand.muted" mb={3}>
                      Shipped: {new Date(product.shippedAt).toLocaleDateString()}
                    </Text>
                  )}
                  <Button
                    size="sm"
                    colorScheme="orange"
                    onClick={() => handleAcceptClick(product.id)}
                    mt={2}
                  >
                    Accept Shipment
                  </Button>
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>

        {/* Receive New Product Section */}
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

        {/* Story 7.15: Tabs for In Stock and Product History */}
        <Box>
          <Tabs
            index={activeTab}
            onChange={handleTabChange}
            colorScheme="green"
            variant="enclosed"
          >
            <TabList>
              <Tab>
                In Stock
                <Badge ml={2} colorScheme="green" borderRadius="full">
                  {inStockProducts.length}
                </Badge>
              </Tab>
              <Tab>
                Product History
                <Badge ml={2} colorScheme="gray" borderRadius="full">
                  {historyProducts.length}
                </Badge>
              </Tab>
            </TabList>

            <TabPanels>
              {/* In Stock Tab */}
              <TabPanel px={0}>
                {/* Loading state */}
                {inStockLoading && (
                  <Center py={8}>
                    <Spinner size="lg" color="brand.primary" />
                  </Center>
                )}

                {/* Error state with retry */}
                {inStockError && !inStockLoading && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box flex="1">{inStockError}</Box>
                    <Button size="sm" onClick={fetchInStockProducts}>
                      Retry
                    </Button>
                  </Alert>
                )}

                {/* Empty state */}
                {!inStockLoading && !inStockError && inStockProducts.length === 0 && (
                  <Center py={8} flexDirection="column">
                    <Icon as={InfoIcon} boxSize={8} color="brand.muted" mb={3} />
                    <Text color="brand.muted" fontWeight="medium">
                      No products in stock yet
                    </Text>
                    <Text color="brand.muted" fontSize="sm" mt={1}>
                      Products will appear here when you receive them.
                    </Text>
                  </Center>
                )}

                {/* Products grid */}
                {!inStockLoading && !inStockError && inStockProducts.length > 0 && (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {inStockProducts.map((product) => (
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

                          {/* Action buttons - Add Trace always visible in stock tab */}
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
              </TabPanel>

              {/* Product History Tab */}
              <TabPanel px={0}>
                {/* Loading state */}
                {historyLoading && (
                  <Center py={8}>
                    <Spinner size="lg" color="brand.primary" />
                  </Center>
                )}

                {/* Error state with retry */}
                {historyError && !historyLoading && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box flex="1">{historyError}</Box>
                    <Button size="sm" onClick={fetchHistoryProducts}>
                      Retry
                    </Button>
                  </Alert>
                )}

                {/* Empty state */}
                {!historyLoading && !historyError && historyProducts.length === 0 && (
                  <Center py={8} flexDirection="column">
                    <Icon as={InfoIcon} boxSize={8} color="brand.muted" mb={3} />
                    <Text color="brand.muted" fontWeight="medium">
                      No product history yet
                    </Text>
                    <Text color="brand.muted" fontSize="sm" mt={1}>
                      Products you&apos;ve handled will appear here.
                    </Text>
                  </Center>
                )}

                {/* Products grid */}
                {!historyLoading && !historyError && historyProducts.length > 0 && (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {historyProducts.map((product) => (
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

                          {/* Action buttons - Add Trace only if still owned */}
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
              </TabPanel>
            </TabPanels>
          </Tabs>
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

      {/* Story 7.17: Accept Shipment Modal */}
      <Modal isOpen={isAcceptOpen} onClose={onAcceptClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Accept Incoming Shipment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {acceptProductId && (
              <TraceRecordForm
                productId={acceptProductId}
                userRole={userRole}
                onSuccess={handleAcceptSuccess}
                defaultAction="RECEIVED"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
}
