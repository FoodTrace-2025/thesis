// src/components/admin/AddCompanyModal.tsx
// Story 2.9: Add Company form modal

import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Alert,
  AlertIcon,
  useToast,
} from '@chakra-ui/react';

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type CompanyType = 'PRODUCER' | 'DISTRIBUTOR' | 'RETAILER';

interface FormData {
  name: string;
  email: string;
  domain: string;
  type: CompanyType;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  domain: '',
  type: 'PRODUCER',
};

export function AddCompanyModal({ isOpen, onClose, onSuccess }: AddCompanyModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const isFormValid =
    formData.name.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.domain.trim() !== '';

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user types
  };

  // Auto-extract domain from email
  const handleEmailChange = (email: string) => {
    const domain = email.includes('@') ? email.split('@')[1] : '';
    setFormData((prev) => ({ ...prev, email, domain }));
    setError(null);
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          domain: formData.domain.trim(),
          type: formData.type,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Extract specific error message from details if available
        const errorMessage = data.details?.[0]?.message || data.error || 'Failed to create company';
        throw new Error(errorMessage);
      }

      toast({
        title: 'Company created',
        description: `${formData.name} has been created with PENDING status.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setFormData(initialFormData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Company</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <FormControl isRequired>
              <FormLabel>Company Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Hirsimaki Farm Ltd"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="e.g., contact@hirsimakifarm.fi"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Domain (auto-filled from email)</FormLabel>
              <Input
                value={formData.domain}
                isReadOnly
                bg="gray.50"
                placeholder="Extracted from email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Company Type</FormLabel>
              <Select
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
              >
                <option value="PRODUCER">Producer</option>
                <option value="DISTRIBUTOR">Distributor</option>
                <option value="RETAILER">Retailer</option>
              </Select>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Creating..."
            isDisabled={!isFormValid}
          >
            Create Company
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
