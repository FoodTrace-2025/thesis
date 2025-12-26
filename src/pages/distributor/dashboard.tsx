// src/pages/distributor/dashboard.tsx
// Story 7.6: Distributor Dashboard - Product List & Layout
// Story 7.7: Trace Features - Modal, Timeline, Receive Product
// Story 7.7 Enhancement: Only show Add Trace when distributor owns the product
// Story 7.14: Dashboard Tabs - In Custody + Product History
// Story 7.17: Incoming Shipments section with Accept workflow
// DISTRIBUTOR role only - displays products in company's custody

import { useState, useEffect, useCallback, useMemo, type ChangeEvent } from 'react';
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
  Flex,
  Select,
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
import { TraceRecordForm } from '@/components/trace';
import { StatusBadge, type ProductStatus } from '@/components/product';
import { QRScanner } from '@/components/scanner';
import { ProductTrendCard } from '@/components/analytics/ProductTrendCard';
import { TrendRange } from '@/components/analytics/trend';
import { BatchTable, type BatchTableRow } from '@/components/product/BatchTable';

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

export default function DistributorDashboard({
  userName,
  userRole,
}: DistributorDashboardProps) {
  // Product list state (Story 7.6, 7.14: Tabs)
  const [custodyProducts, setCustodyProducts] = useState<Product[]>([]);
  const [custodyLoading, setCustodyLoading] = useState(true);
  const [custodyError, setCustodyError] = useState<string | null>(null);

  // Story 7.14: Product History tab state
  const [historyProducts, setHistoryProducts] = useState<Product[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Story 7.17: Incoming Shipments state
  const [incomingProducts, setIncomingProducts] = useState<IncomingProduct[]>([]);
  const [incomingLoading, setIncomingLoading] = useState(true);
  const [incomingError, setIncomingError] = useState<string | null>(null);

  // Trend range state
  const [range, setRange] = useState<TrendRange>('7d');

  const toast = useToast();

  // Story 7.17: Accept modal state for incoming shipments
  const {
    isOpen: isAcceptOpen,
    onOpen: onAcceptOpen,
    onClose: onAcceptClose,
  } = useDisclosure();
  const [acceptProductId, setAcceptProductId] = useState<string | null>(null);

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

  // Fetch custody products (owner=me) - callable for retry functionality
  const fetchCustodyProducts = async () => {
    setCustodyLoading(true);
    setCustodyError(null);
    try {
      const response = await fetch('/api/products?owner=me');
      const data = await response.json();
      if (!response.ok) {
        setCustodyError(data.error || 'Failed to fetch products');
        return;
      }
      setCustodyProducts(data.products);
    } catch {
      setCustodyError('Network error. Please try again.');
    } finally {
      setCustodyLoading(false);
    }
  };

  // Story 7.14: Fetch history products (history=me) - lazy loaded on tab switch
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

  // Story 7.14: Handle tab change - lazy load history on first click
  const handleTabChange = (index: number) => {
    setActiveTab(index);
    if (index === 1 && !historyLoaded) {
      fetchHistoryProducts();
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
    filteredHistory.forEach((p) => ids.add(p.id));
    return ids.size;
  }, [filteredHistory]);

  const inCustody = custodyProducts.length;
  const incomingCount = incomingProducts.length;

  const handleCopy = useCallback(
    async (value: string, label: string) => {
      try {
        await navigator.clipboard.writeText(value);
        toast({
          title: `${label} copied`,
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch {
        toast({
          title: `Failed to copy ${label}`,
          status: 'error',
          duration: 2000,
          isClosable: true,
        });
      }
    },
    [toast]
  );

  const custodyRows: BatchTableRow[] = useMemo(
    () =>
      custodyProducts.map((p) => ({
        id: p.id,
        name: p.name,
        blockchainId: p.blockchainId,
        harvestDate: p.harvestDate,
        createdAt: p.createdAt,
        status: p.status,
      })),
    [custodyProducts]
  );

  const historyRows: BatchTableRow[] = useMemo(
    () =>
      historyProducts.map((p) => ({
        id: p.id,
        name: p.name,
        blockchainId: p.blockchainId,
        harvestDate: p.harvestDate,
        createdAt: p.createdAt,
        status: p.status,
      })),
    [historyProducts]
  );

  const completedCount = useMemo(() => {
    let count = 0;
    filteredHistory.forEach((p) => {
      if (!custodyIds.has(p.id) && !incomingIds.has(p.id)) {
        count += 1;
      }
    });
    return count;
  }, [filteredHistory, custodyIds, incomingIds]);

  // Fetch custody and incoming products on mount
  useEffect(() => {
    fetchCustodyProducts();
    fetchIncomingProducts(); // Story 7.17
  }, []);

  // Ensure history data is available for KPIs/trend (uses existing endpoint)
  useEffect(() => {
    if (!historyLoaded) {
      fetchHistoryProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyLoaded]);

  // Lookup product by blockchainId (Story 7.7 Task 3, Story 7.10 enhancement)
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

  // Handle receive success (Story 7.7 Task 3, 7.14: Refetch both lists)
  const handleReceiveSuccess = () => {
    setLookupProduct(null);
    setBlockchainIdInput('');
    fetchCustodyProducts(); // Refetch custody list
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

  // Story 7.17: Handle Accept success - product moves from incoming to custody
  const handleAcceptSuccess = () => {
    onAcceptClose();
    setAcceptProductId(null);
    fetchIncomingProducts(); // Refetch incoming (product should disappear)
    fetchCustodyProducts(); // Refetch custody (product should appear)
    if (historyLoaded) {
      fetchHistoryProducts(); // Refetch history if already loaded
    }
    toast({
      title: 'Shipment accepted',
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
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setRange(e.target.value as TrendRange)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="1y">Last 1 year</option>
          </Select>
        </Flex>

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

        {/* Story 7.14: Tabs for In Custody and Product History */}
        <Box>
          <Tabs
            index={activeTab}
            onChange={handleTabChange}
            colorScheme="green"
            variant="enclosed"
          >
            <TabList>
              <Tab>
                In Custody
                <Badge ml={2} colorScheme="green" borderRadius="full">
                  {custodyProducts.length}
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
              {/* In Custody Tab */}
              <TabPanel px={0}>
                {/* Loading state */}
                {custodyLoading && (
                  <Center py={8}>
                    <Spinner size="lg" color="brand.primary" />
                  </Center>
                )}

                {/* Error state with retry */}
                {custodyError && !custodyLoading && (
                  <Alert status="error" borderRadius="md">
                    <AlertIcon />
                    <Box flex="1">{custodyError}</Box>
                    <Button size="sm" onClick={fetchCustodyProducts}>
                      Retry
                    </Button>
                  </Alert>
                )}

                {/* Empty state */}
                {!custodyLoading && !custodyError && custodyProducts.length === 0 && (
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

                {/* Products table */}
                {!custodyLoading && !custodyError && custodyProducts.length > 0 && (
                  <BatchTable
                    rows={custodyRows}
                    onCopy={handleCopy}
                    detailBasePath="/product"
                  />
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

                {/* Products table */}
                {!historyLoading && !historyError && historyProducts.length > 0 && (
                  <BatchTable
                    rows={historyRows}
                    onCopy={handleCopy}
                    detailBasePath="/product"
                  />
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </VStack>

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
