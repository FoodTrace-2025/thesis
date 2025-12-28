// src/pages/retailer/receive.tsx
// Retailer Receive Product workflow with incoming list and manual lookup

import { useCallback, useEffect, useMemo, useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Center,
  SimpleGrid,
  Badge,
  Icon,
  IconButton,
  Tooltip,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, InfoIcon, CopyIcon } from '@chakra-ui/icons';
import { Layout } from '@/components/layout';
import { TraceRecordForm } from '@/components/trace';
import { QRScanner } from '@/components/scanner';
import { StatusBadge } from '@/components/product';

interface Product {
  id: string;
  name: string;
  origin: string;
  blockchainId: number;
  harvestDate: string;
  currentOwner: { name: string } | null;
  status: string;
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

interface RetailerReceiveProps {
  userName: string;
  userRole: string;
  companyId: string | null;
  companyName: string;
}

export default function RetailerReceivePage({ userRole }: RetailerReceiveProps) {
  const [blockchainIdInput, setBlockchainIdInput] = useState('');
  const [lookupProduct, setLookupProduct] = useState<Product | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  const [incomingProducts, setIncomingProducts] = useState<IncomingProduct[]>([]);
  const [incomingError, setIncomingError] = useState<string | null>(null);
  const [incomingLoading, setIncomingLoading] = useState(true);
  const [acceptProductId, setAcceptProductId] = useState<string | null>(null);

  const toast = useToast();
  const {
    isOpen: isScannerOpen,
    onOpen: onScannerOpen,
    onClose: onScannerClose,
  } = useDisclosure();
  const {
    isOpen: isAcceptOpen,
    onOpen: onAcceptOpen,
    onClose: onAcceptClose,
  } = useDisclosure();

  const fetchIncomingProducts = useCallback(async () => {
    setIncomingLoading(true);
    setIncomingError(null);
    try {
      const response = await fetch('/api/products?incoming=me');
      const data = await response.json();
      if (!response.ok) {
        setIncomingError(data.error || 'Failed to fetch incoming shipments');
        return;
      }
      setIncomingProducts(data.products as IncomingProduct[]);
    } catch {
      setIncomingError('Network error. Please try again.');
    } finally {
      setIncomingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomingProducts();
  }, [fetchIncomingProducts]);

  const handleLookup = useCallback(
    async (idOverride?: string) => {
      const idToLookup = idOverride || blockchainIdInput.trim();
      if (!idToLookup) return;
      setIsLookingUp(true);
      setLookupError('');
      setLookupProduct(null);

      const match =
        incomingProducts.find(
          (p) =>
            p.id === idToLookup ||
            p.blockchainId.toString() === idToLookup
        ) || null;

      if (!match) {
        setLookupError('Product not found in incoming shipments');
        setIsLookingUp(false);
        return;
      }

      setLookupProduct(match);
      setIsLookingUp(false);
    },
    [blockchainIdInput, incomingProducts]
  );

  const handleScan = useCallback(
    (productId: string) => {
      onScannerClose();
      setBlockchainIdInput(productId);
      handleLookup(productId);
    },
    [onScannerClose, handleLookup]
  );

  const handleReceiveSuccess = () => {
    setLookupProduct(null);
    setBlockchainIdInput('');
    fetchIncomingProducts();
    toast({
      title: 'Product received',
      description: 'The product is now in your custody.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  const handleAcceptClick = (productId: string) => {
    setAcceptProductId(productId);
    onAcceptOpen();
  };

  const handleAcceptSuccess = () => {
    onAcceptClose();
    setAcceptProductId(null);
    fetchIncomingProducts();
  };

  const acceptProduct = useMemo(
    () => incomingProducts.find((p) => p.id === acceptProductId) || null,
    [incomingProducts, acceptProductId]
  );

  const handleCopy = async (value: string, label: string) => {
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
  };

  const renderProductId = (id: string) =>
    id ? `${id.slice(0, 6)}...${id.slice(-4)}` : 'N/A';

  return (
    <Layout>
      <VStack align="stretch" spacing={6} py={6}>
        <Heading size="lg" color="brand.dark">
          Receive Product
        </Heading>

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

          {incomingLoading && (
            <Center py={6}>
              <Spinner size="md" color="brand.primary" />
            </Center>
          )}

          {incomingError && !incomingLoading && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box flex="1">{incomingError}</Box>
              <Button size="sm" onClick={fetchIncomingProducts}>
                Retry
              </Button>
            </Alert>
          )}

          {!incomingLoading && !incomingError && incomingProducts.length === 0 && (
            <Center py={6} flexDirection="column">
              <Icon as={InfoIcon} boxSize={6} color="brand.muted" mb={2} />
              <Text color="brand.muted" fontSize="sm">
                No incoming shipments
              </Text>
            </Center>
          )}

          {!incomingLoading && !incomingError && incomingProducts.length > 0 && (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {incomingProducts.map((product) => (
                <Box
                  key={product.id}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor="brand.border"
                  bg="brand.surfaceAlt"
                  p={4}
                  maxW="360px"
                >
                  <HStack justify="space-between" mb={2}>
                    <Heading size="sm" color="brand.dark">
                      {product.name}
                    </Heading>
                    <StatusBadge status="IN_TRANSIT" />
                  </HStack>
                  <HStack spacing={2} mb={2}>
                    <Tooltip label={product.id}>
                      <Text fontSize="sm" color="brand.muted">
                        Product ID: {renderProductId(product.id)}
                      </Text>
                    </Tooltip>
                    <IconButton
                      aria-label="Copy product ID"
                      icon={<CopyIcon />}
                      size="xs"
                      variant="ghost"
                      minW="32px"
                      minH="32px"
                      onClick={() => handleCopy(product.id, 'Product ID')}
                    />
                  </HStack>
                  {product.shippedBy && (
                    <Text fontSize="sm" color="brand.muted" mb={2}>
                      Shipped by: {product.shippedBy.name}
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
              placeholder="Enter Product ID or Blockchain ID"
              value={blockchainIdInput}
              onChange={(e) => setBlockchainIdInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              maxW="300px"
            />
            <Button
              onClick={() => handleLookup()}
              isLoading={isLookingUp}
              loadingText="Looking up..."
            >
              Look Up
            </Button>
            <Button variant="outline" leftIcon={<ViewIcon />} onClick={onScannerOpen}>
              Scan QR
            </Button>
          </HStack>

          {lookupError && (
            <Alert status="error" borderRadius="md" mb={4}>
              <AlertIcon />
              {lookupError}
            </Alert>
          )}

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
                defaultAction="RECEIVED"
                lockedAction="RECEIVED"
                requireAcknowledgement
              />
            </Box>
          )}
        </Box>
      </VStack>

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

      {/* Receive Modal for incoming cards */}
      <Modal isOpen={isAcceptOpen} onClose={onAcceptClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Receive Incoming Shipment</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {acceptProduct && (
              <Box
                mb={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor="brand.border"
                p={3}
                bg="brand.surfaceAlt"
              >
                <Text fontWeight="semibold" color="brand.dark">
                  {acceptProduct.name}
                </Text>
                <Text fontSize="sm" color="brand.muted">
                  Product ID: {acceptProduct.id}
                </Text>
              </Box>
            )}
            {acceptProductId && (
              <TraceRecordForm
                productId={acceptProductId}
                userRole={userRole}
                onSuccess={handleAcceptSuccess}
                defaultAction="RECEIVED"
                lockedAction="RECEIVED"
                requireAcknowledgement
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
}
