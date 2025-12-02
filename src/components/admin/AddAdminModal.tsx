// src/components/admin/AddAdminModal.tsx
// Story 2.10: Add Company Admin form modal

import { useState, useEffect } from 'react';
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
  VStack,
  Alert,
  AlertIcon,
  Text,
  useToast,
} from '@chakra-ui/react';

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: {
    id: string;
    name: string;
    domain: string;
  } | null;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  email: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
};

export function AddAdminModal({ isOpen, onClose, company, onSuccess }: AddAdminModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setError(null);
    }
  }, [isOpen]);

  const isFormValid = formData.name.trim() !== '' && formData.email.trim() !== '';

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null); // Clear error when user types
  };

  const handleSubmit = async () => {
    if (!isFormValid || !company) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: 'admin123', // Hard-coded for POC
          companyId: company.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create company admin');
      }

      toast({
        title: 'Company admin created',
        description: 'Default password: admin123',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      setFormData(initialFormData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create company admin');
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
        <ModalHeader>Add Company Admin</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <FormControl>
              <FormLabel>Company</FormLabel>
              <Input value={company?.name || ''} isReadOnly bg="gray.50" />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., John Smith"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder={`e.g., admin@${company?.domain || 'company.com'}`}
              />
              {company && (
                <Text fontSize="sm" color="gray.600" mt={1}>
                  Must end with @{company.domain}
                </Text>
              )}
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            colorScheme="teal"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Creating..."
            isDisabled={!isFormValid}
          >
            Create Admin
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
