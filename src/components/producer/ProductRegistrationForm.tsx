// src/components/producer/ProductRegistrationForm.tsx
// Story 5.5: Product Registration Form Component
// Story 5.6: Updated to use success modal with QR code

import { useState, FormEvent, useRef, type RefObject } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Text,
  Alert,
  AlertIcon,
  useDisclosure,
  SimpleGrid,
  Flex,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { z } from 'zod';
import { RegistrationSuccessModal } from './RegistrationSuccessModal';
import { InfoIcon } from '@chakra-ui/icons';

// Validation schema matching API (Story 5.3)
const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(100, 'Name too long (max 100 characters)'),
  origin: z
    .string()
    .min(1, 'Origin is required')
    .max(100, 'Origin too long (max 100 characters)'),
  harvestDate: z
    .string()
    .min(1, 'Harvest date is required')
    .refine(
      (date) => new Date(date) <= new Date(),
      'Harvest date cannot be in the future'
    ),
});

interface ProductData {
  id: string;
  blockchainId: number;
  name: string;
  origin: string;
  harvestDate: string;
  transactionHash: string;
  qrCodeUrl: string;
}

export function ProductRegistrationForm() {
  // Form state
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expireDate, setExpireDate] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [successData, setSuccessData] = useState<ProductData | null>(null);

  // Modal state (Story 5.6)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const certInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (fileList: FileList | null) => {
    // Placeholder for future upload integration
    if (!fileList || fileList.length === 0) return;
    // We purposely do nothing except avoid unused warnings.
  };

  const validateForm = (): boolean => {
    const result = registerSchema.safeParse({ name, origin, harvestDate });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/products/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, origin, harvestDate }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from API
        if (data.code === 'VALIDATION_ERROR' && data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((issue: { path: string[]; message: string }) => {
            const field = issue.path[0];
            fieldErrors[field] = issue.message;
          });
          setErrors(fieldErrors);
        } else {
          setApiError(data.error || 'Registration failed');
        }
        return;
      }

      // Success - open modal (Story 5.6)
      setSuccessData(data.product);
      onOpen();
    } catch (err) {
      console.error('Product registration failed:', err);
      setApiError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterAnother = () => {
    setName('');
    setOrigin('');
    setHarvestDate('');
    setQuantity('');
    setExpireDate('');
    setErrors({});
    setApiError('');
    setSuccessData(null);
    onClose(); // Close modal (Story 5.6)
  };

  // Form with modal (Story 5.6 - replaced inline success state with modal)
  return (
    <>
      {/* Success Modal (Story 5.6) */}
      {successData && (
        <RegistrationSuccessModal
          isOpen={isOpen}
          onClose={onClose}
          product={successData}
          onRegisterAnother={handleRegisterAnother}
        />
      )}

      {/* Registration Form */}
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg="brand.surface"
        p={6}
        borderRadius="md"
        borderWidth="1px"
        borderColor="brand.border"
      >
        {apiError && (
          <Alert status="error" borderRadius="md" mb={4}>
            <AlertIcon />
            {apiError}
          </Alert>
        )}

        <VStack spacing={4} align="stretch">
          <Text fontWeight="semibold" color="brand.dark" fontSize="lg">
            Product Information
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isInvalid={!!errors.name}>
              <FormLabel color="brand.dark">Product Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="e.g., Organic Milk"
                isDisabled={isLoading}
              />
              <FormErrorMessage>{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel color="brand.dark">Quantity (optional)</FormLabel>
              <Input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 500 units"
                isDisabled={isLoading}
              />
            </FormControl>

            <FormControl isInvalid={!!errors.harvestDate}>
              <FormLabel color="brand.dark">Product Date</FormLabel>
              <Input
                type="date"
                value={harvestDate}
                onChange={(e) => {
                  setHarvestDate(e.target.value);
                  if (errors.harvestDate)
                    setErrors((prev) => ({ ...prev, harvestDate: '' }));
                }}
                max={new Date().toISOString().split('T')[0]}
                isDisabled={isLoading}
              />
              <FormErrorMessage>{errors.harvestDate}</FormErrorMessage>
            </FormControl>

            <FormControl>
              <FormLabel color="brand.dark">Expire Date (optional)</FormLabel>
              <Input
                type="date"
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
                isDisabled={isLoading}
              />
            </FormControl>
          </SimpleGrid>

          <FormControl isInvalid={!!errors.origin}>
            <FormLabel color="brand.dark">Origin</FormLabel>
            <Flex gap={3} direction={{ base: 'column', md: 'row' }}>
              <Input
                flex="1"
                value={origin}
                onChange={(e) => {
                  setOrigin(e.target.value);
                  if (errors.origin) setErrors((prev) => ({ ...prev, origin: '' }));
                }}
                placeholder="Automatically loaded: City, Province"
                isDisabled={isLoading}
              />
              <Button variant="outline" minW={{ base: '100%', md: '160px' }} isDisabled>
                Select on Map
              </Button>
            </Flex>
            <FormErrorMessage>{errors.origin}</FormErrorMessage>
            <Text fontSize="xs" color="brand.muted" mt={1}>
              Lat: — &nbsp; Lng: —
            </Text>
          </FormControl>

          <Divider />

          <Text fontWeight="semibold" color="brand.dark" fontSize="lg">
            Upload Files
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <UploadCard
              title="Upload Product Image"
              description="Upload PNG/JPG, max 5MB."
              inputRef={imageInputRef}
              onFileChange={(files) => handleFileChange(files)}
              isDisabled={isLoading}
            />
            <UploadCard
              title="Upload Certificate"
              description="Upload PDF/JPG, max 5MB."
              inputRef={certInputRef}
              onFileChange={(files) => handleFileChange(files)}
              isDisabled={isLoading}
            />
          </SimpleGrid>

          <Flex gap={3} justify="flex-end" flexWrap="wrap">
            <Button variant="outline" type="button" onClick={handleRegisterAnother} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Registering on blockchain..."
              isDisabled={isLoading}
            >
              Create Batch & Upload to Blockchain
            </Button>
          </Flex>

          {isLoading && (
            <Text fontSize="sm" color="brand.muted" textAlign="center">
              This may take 15-30 seconds while the transaction is confirmed on the blockchain.
            </Text>
          )}
        </VStack>
      </Box>
    </>
  );
}

function UploadCard({
  title,
  description,
  inputRef,
  onFileChange,
  isDisabled,
}: {
  title: string;
  description: string;
  inputRef: RefObject<HTMLInputElement>;
  onFileChange: (files: FileList | null) => void;
  isDisabled?: boolean;
}) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      borderColor="brand.border"
      bg="brand.surface"
      p={4}
    >
      <Text fontWeight="semibold" color="brand.dark" mb={1}>
        {title}
      </Text>
      <Text fontSize="sm" color="brand.muted" mb={4}>
        {description}
      </Text>
      <Box
        borderWidth="1px"
        borderColor="brand.border"
        borderRadius="md"
        bg="brand.surfaceAlt"
        p={6}
        textAlign="center"
      >
        <Icon as={InfoIcon} color="brand.muted" boxSize={6} mb={2} />
        <Text fontSize="sm" color="brand.muted" mb={3}>
          Drop file or Browse
        </Text>
        <Button
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          isDisabled={isDisabled}
        >
          Browse
        </Button>
        <Input
          ref={inputRef}
          type="file"
          display="none"
          onChange={(e) => onFileChange(e.target.files)}
        />
      </Box>
    </Box>
  );
}
