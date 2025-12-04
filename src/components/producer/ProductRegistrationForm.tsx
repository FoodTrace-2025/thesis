// src/components/producer/ProductRegistrationForm.tsx
// Story 5.5: Product Registration Form Component

import { useState, FormEvent } from 'react';
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
  Link as ChakraLink,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { z } from 'zod';

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

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [successData, setSuccessData] = useState<ProductData | null>(null);

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

      // Success
      setSuccessData(data.product);
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
    setErrors({});
    setApiError('');
    setSuccessData(null);
  };

  // Success state
  if (successData) {
    return (
      <Box
        bg="brand.surface"
        p={6}
        borderRadius="md"
        borderWidth="1px"
        borderColor="brand.border"
      >
        <VStack spacing={4} align="stretch">
          <Alert status="success" borderRadius="md">
            <AlertIcon />
            Product registered successfully!
          </Alert>

          <Box>
            <Text fontWeight="bold" color="brand.dark">
              Product ID:
            </Text>
            <Text color="brand.dark">{successData.blockchainId}</Text>
          </Box>

          <Box>
            <Text fontWeight="bold" color="brand.dark">
              Transaction Hash:
            </Text>
            <ChakraLink
              href={`https://sepolia.etherscan.io/tx/${successData.transactionHash}`}
              isExternal
              color="brand.accent"
            >
              {successData.transactionHash.slice(0, 10)}...
              {successData.transactionHash.slice(-8)}
            </ChakraLink>
          </Box>

          <Box>
            <Text fontWeight="bold" color="brand.dark">
              QR Code URL:
            </Text>
            <Text fontSize="sm" color="brand.muted">
              {successData.qrCodeUrl}
            </Text>
          </Box>

          <VStack spacing={2} pt={4}>
            <Button onClick={handleRegisterAnother} width="100%">
              Register Another Product
            </Button>
            <ChakraLink
              as={NextLink}
              href="/producer/dashboard"
              color="brand.accent"
            >
              Back to Dashboard
            </ChakraLink>
          </VStack>
        </VStack>
      </Box>
    );
  }

  // Form state
  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      bg="brand.surface"
      p={6}
      borderRadius="md"
      borderWidth="1px"
      borderColor="brand.border"
    >
      <VStack spacing={4} align="stretch">
        {apiError && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {apiError}
          </Alert>
        )}

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

        <FormControl isInvalid={!!errors.origin}>
          <FormLabel color="brand.dark">Origin</FormLabel>
          <Input
            value={origin}
            onChange={(e) => {
              setOrigin(e.target.value);
              if (errors.origin) setErrors((prev) => ({ ...prev, origin: '' }));
            }}
            placeholder="e.g., Oulu Farm, Finland"
            isDisabled={isLoading}
          />
          <FormErrorMessage>{errors.origin}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.harvestDate}>
          <FormLabel color="brand.dark">Harvest Date</FormLabel>
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

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Registering on blockchain..."
          isDisabled={isLoading}
          mt={4}
        >
          Register Product
        </Button>

        {isLoading && (
          <Text fontSize="sm" color="brand.muted" textAlign="center">
            This may take 15-30 seconds while the transaction is confirmed on
            the blockchain.
          </Text>
        )}
      </VStack>
    </Box>
  );
}
