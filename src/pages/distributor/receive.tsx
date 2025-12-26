// src/pages/distributor/receive.tsx
// Distributor Receive Product workflow (scan/lookup + RECEIVED form)

import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { prisma } from '@/lib/prisma';
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
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
import { ViewIcon } from '@chakra-ui/icons';
import { Layout } from '@/components/layout';
import { TraceRecordForm } from '@/components/trace';
import { QRScanner } from '@/components/scanner';

// Product type matching API response
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

interface DistributorReceiveProps {
  userName: string;
  userRole: string;
  companyId: string | null;
  companyName: string;
}

export default function DistributorReceivePage({ userRole }: DistributorReceiveProps) {
  const [blockchainIdInput, setBlockchainIdInput] = useState('');
  const [lookupProduct, setLookupProduct] = useState<Product | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  const [incomingCount, setIncomingCount] = useState(0);
  const [incomingError, setIncomingError] = useState<string | null>(null);
  const [incomingLoading, setIncomingLoading] = useState(true);

  const toast = useToast();
  const {
    isOpen: isScannerOpen,
    onOpen: onScannerOpen,
    onClose: onScannerClose,
  } = useDisclosure();

  const fetchIncomingCount = useCallback(async () => {
    setIncomingLoading(true);
    setIncomingError(null);
    try {
      const response = await fetch('/api/products?incoming=me');
      const data = await response.json();
      if (!response.ok) {
        setIncomingError(data.error || 'Failed to fetch incoming shipments');
        return;
      }
      setIncomingCount((data.products as Product[]).length);
    } catch {
      setIncomingError('Network error. Please try again.');
    } finally {
      setIncomingLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncomingCount();
  }, [fetchIncomingCount]);

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
    fetchIncomingCount();
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
      <VStack align="stretch" spacing={6} py={6}>
        <Heading size="lg" color="brand.dark">
          Receive Product
        </Heading>

        <Flex
          borderWidth="1px"
          borderRadius="lg"
          borderColor="brand.border"
          bg="brand.surface"
          p={4}
          align="center"
          justify="space-between"
          wrap="wrap"
          gap={3}
        >
          <Box>
            <Text fontWeight="semibold" color="brand.dark">
              Incoming Shipments
            </Text>
            <Text color="brand.muted" fontSize="sm">
              Products awaiting acceptance
            </Text>
          </Box>
          {incomingLoading ? (
            <Spinner size="sm" color="brand.primary" />
          ) : incomingError ? (
            <Text color="brand.error" fontSize="sm">
              {incomingError}
            </Text>
          ) : (
            <Text fontSize="2xl" fontWeight="bold" color="brand.primary">
              {incomingCount}
            </Text>
          )}
          <Button as={NextLink} href="/distributor/products" colorScheme="green" variant="outline">
            Go to My Products
          </Button>
        </Flex>

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
              <TraceRecordForm productId={lookupProduct.id} userRole={userRole} onSuccess={handleReceiveSuccess} />
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
    </Layout>
  );
}
