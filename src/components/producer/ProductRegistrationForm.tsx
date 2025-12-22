// src/components/producer/ProductRegistrationForm.tsx
// Story 5.5: Product Registration Form Component
// Story 5.6: Updated to use success modal with QR code

import { useState, FormEvent, useRef, type RefObject, useEffect } from 'react';
import dynamic from 'next/dynamic';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
  IconButton,
} from '@chakra-ui/react';
import { z } from 'zod';
import { RegistrationSuccessModal } from './RegistrationSuccessModal';
import { InfoIcon, CloseIcon,  } from '@chakra-ui/icons';
import { FiMapPin } from "react-icons/fi";
type SelectorMapProps = {
  latLng: { lat: number | null; lng: number | null } | null;
  onSelect: (coords: { lat: number; lng: number }) => void;
  isOpen: boolean;
};

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
  const [latLng, setLatLng] = useState<{ lat: number | null; lng: number | null }>({
    lat: null,
    lng: null,
  });
  const [isLocating, setIsLocating] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [successData, setSuccessData] = useState<ProductData | null>(null);

  // Modal state (Story 5.6)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const certInputRef = useRef<HTMLInputElement | null>(null);
  const mapDisclosure = useDisclosure();
  const [mapSelection, setMapSelection] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<{
    image?: File;
    cert?: File;
  }>({});
  const [isLocatingInModal, setIsLocatingInModal] = useState(false);
  const toast = useToast();

  const SelectorMap = dynamic<SelectorMapProps>(
    async () => (await import('./SelectorMap')).SelectorMap,
    { ssr: false }
  );

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
        body: JSON.stringify({
          name,
          origin,
          harvestDate,
          quantity,
          expireDate,
          lat: latLng.lat,
          lng: latLng.lng,
          // File uploads are disabled in this JSON-only submission
          productImage: null,
          certificate: null,
        }),
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
    setLatLng({ lat: null, lng: null });
    setSelectedFiles({});
    setErrors({});
    setApiError('');
    setSuccessData(null);
    onClose(); // Close modal (Story 5.6)
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`
      );
      const data = await res.json();
      const city =
        data?.address?.city || data?.address?.town || data?.address?.village || data?.address?.hamlet;
      const state = data?.address?.state;
      const country = data?.address?.country;
      const displayName = data?.display_name;
      const formatted =
        city || state || country
          ? `${city ?? ''}${state ? `${city ? ', ' : ''}${state}` : ''}${
              country ? `${city || state ? ', ' : ''}${country}` : ''
            }`
          : displayName || '';
      if (formatted) setOrigin(formatted);
      return formatted;
    } catch {
      // silent fallback
      return '';
    }
  };

  useEffect(() => {
    if (!navigator?.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLatLng({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
        setIsLocating(false);
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

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
              <Button
                variant="outline"
                minW={{ base: '100%', md: '160px' }}
                leftIcon={<FiMapPin />}
                onClick={mapDisclosure.onOpen}
              >
                Select on Map
              </Button>
              </Flex>
              <FormErrorMessage>{errors.origin}</FormErrorMessage>
              <Text fontSize="xs" color="brand.muted" mt={1}>
                {isLocating
                  ? 'Detecting location...'
                  : `Lat: ${latLng.lat ?? '—'}  Lng: ${latLng.lng ?? '—'}`}
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
              file={selectedFiles.image}
              accept="image/png,image/jpeg"
              onFileChange={(files) => {
                if (files && files[0]) setSelectedFiles((prev) => ({ ...prev, image: files[0] }));
              }}
              onRemove={() => {
                setSelectedFiles((prev) => ({ ...prev, image: undefined }));
                if (imageInputRef.current) imageInputRef.current.value = '';
              }}
              isDisabled={isLoading}
            />
            <UploadCard
              title="Upload Certificate"
              description="Upload PDF/JPG, max 5MB."
              inputRef={certInputRef}
              accept="application/pdf,image/png,image/jpeg"
              file={selectedFiles.cert}
              onFileChange={(files) => {
                if (files && files[0]) setSelectedFiles((prev) => ({ ...prev, cert: files[0] }));
              }}
              onRemove={() => {
                setSelectedFiles((prev) => ({ ...prev, cert: undefined }));
                if (certInputRef.current) certInputRef.current.value = '';
              }}
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

      {/* Map Modal */}
      <Modal isOpen={mapDisclosure.isOpen} onClose={mapDisclosure.onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SelectorMap
              latLng={mapSelection || latLng}
              onSelect={(coords) => setMapSelection(coords)}
              isOpen={mapDisclosure.isOpen}
            />
            <Text fontSize="sm" color="brand.muted" mt={2}>
              Click on the map to set a location.
            </Text>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="outline" onClick={mapDisclosure.onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              isLoading={isLocatingInModal}
              isDisabled={isLocatingInModal}
              onClick={() => {
                if (!navigator?.geolocation) {
                  toast({ title: 'Failed to get current location', status: 'error', duration: 2000, isClosable: true });
                  return;
                }
                setIsLocatingInModal(true);
                navigator.geolocation.getCurrentPosition(
                  async (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setMapSelection({ lat: latitude, lng: longitude });
                    setLatLng({ lat: latitude, lng: longitude });
                    await reverseGeocode(latitude, longitude);
                    setIsLocatingInModal(false);
                  },
                  () => {
                    setIsLocatingInModal(false);
                    toast({ title: 'Failed to get current location', status: 'error', duration: 2000, isClosable: true });
                  },
                  { enableHighAccuracy: true, timeout: 8000 }
                );
              }}
            >
              Use current location
            </Button>
            <Button
              onClick={async () => {
                if (mapSelection) {
                  setLatLng(mapSelection);
                  await reverseGeocode(mapSelection.lat, mapSelection.lng);
                }
                mapDisclosure.onClose();
              }}
            >
              Use this location
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function UploadCard({
  title,
  description,
  inputRef,
  onFileChange,
  file,
  accept,
  onRemove,
  isDisabled,
}: {
  title: string;
  description: string;
  inputRef: RefObject<HTMLInputElement>;
  onFileChange: (files: FileList | null) => void;
  file?: File;
  accept?: string;
  onRemove?: () => void;
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
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const files = e.dataTransfer.files;
          if (!files || files.length === 0) return;
          onFileChange(files);
        }}
      >
        {file ? (
          <Flex
            align="center"
            justify="space-between"
            bg="brand.surface"
            borderWidth="1px"
            borderColor="brand.border"
            borderRadius="md"
            p={2}
            mb={3}
            gap={3}
          >
            <Flex align="center" gap={2}>
              <Icon as={InfoIcon} color="brand.primary" boxSize={5} />
              <Text fontSize="sm" color="brand.dark">
                {file.name}
              </Text>
            </Flex>
            <IconButton
              aria-label="Remove file"
              icon={<CloseIcon />}
              size="sm"
              variant="ghost"
              color="brand.error"
              onClick={onRemove}
              isDisabled={isDisabled}
            />
          </Flex>
        ) : (
          <>
            <Icon as={InfoIcon} color="brand.muted" boxSize={6} mb={2} />
            <Text fontSize="sm" color="brand.muted" mb={3}>
              Drop file or Browse
            </Text>
          </>
        )}
        <Flex justify="center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            isDisabled={isDisabled}
          >
            Browse
          </Button>
        </Flex>
        <Input
          ref={inputRef}
          type="file"
          display="none"
          accept={accept}
          onChange={(e) => onFileChange(e.target.files)}
        />
      </Box>
    </Box>
  );
}
