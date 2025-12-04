// src/components/producer/RegistrationSuccessModal.tsx
// Story 5.6: Registration Success Modal with QR Code

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  Text,
  Box,
  Link as ChakraLink,
  useBreakpointValue,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import QRCode from 'react-qr-code';

interface ProductData {
  id: string;
  blockchainId: number;
  name: string;
  origin: string;
  harvestDate: string;
  transactionHash: string;
  qrCodeUrl: string;
}

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductData;
  onRegisterAnother: () => void;
}

export function RegistrationSuccessModal({
  isOpen,
  onClose,
  product,
  onRegisterAnother,
}: RegistrationSuccessModalProps) {
  // Responsive QR code size: 150px on mobile, 200px on desktop
  const qrSize = useBreakpointValue({ base: 150, md: 200 }) || 200;

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent mx={4}>
        <ModalHeader color="brand.primary">Product Registered!</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="center">
            {/* Product Info */}
            <Box textAlign="center">
              <Text fontWeight="bold" fontSize="lg" color="brand.dark">
                {product.name}
              </Text>
              <Text color="brand.muted" fontSize="sm">
                Blockchain ID: #{product.blockchainId}
              </Text>
            </Box>

            {/* QR Code */}
            <Box
              p={4}
              bg="white"
              borderRadius="md"
              border="1px solid"
              borderColor="brand.border"
            >
              <QRCode value={product.qrCodeUrl} size={qrSize} level="M" />
            </Box>
            <Text fontSize="sm" color="brand.muted">
              Scan to view product journey
            </Text>

            {/* Transaction Hash */}
            <Box textAlign="center">
              <Text fontSize="sm" color="brand.muted">
                Transaction:
              </Text>
              <ChakraLink
                href={`https://sepolia.etherscan.io/tx/${product.transactionHash}`}
                isExternal
                color="brand.accent"
                fontSize="sm"
              >
                {product.transactionHash.slice(0, 10)}...
                {product.transactionHash.slice(-8)}
              </ChakraLink>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <VStack spacing={2} width="100%">
            <Button onClick={onRegisterAnother} width="100%">
              Register Another Product
            </Button>
            <Button
              as={NextLink}
              href="/producer/dashboard"
              variant="outline"
              width="100%"
            >
              Go to Dashboard
            </Button>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
