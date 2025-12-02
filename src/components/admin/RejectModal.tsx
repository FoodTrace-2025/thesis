// src/components/admin/RejectModal.tsx
// Story 2.8 Task 5: Reject modal with required reason

import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Textarea,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';

interface Company {
  id: string;
  name: string;
}

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onSuccess: () => void;
}

export function RejectModal({ isOpen, onClose, company, onSuccess }: RejectModalProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const isReasonEmpty = reason.trim() === '';

  const handleReject = async () => {
    if (!company || isReasonEmpty) return;

    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/companies/${company.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reject company');
      }

      toast({
        title: 'Company rejected',
        description: `${company.name} has been rejected.`,
        status: 'info',
        duration: 5000,
        isClosable: true,
      });

      setReason('');
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Rejection failed',
        description: error instanceof Error ? error.message : 'Failed to reject company',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Reject Company</ModalHeader>
        <ModalBody>
          <Text mb={4}>
            Are you sure you want to reject <strong>{company?.name}</strong>?
          </Text>
          <FormControl isRequired isInvalid={isReasonEmpty && reason !== ''}>
            <FormLabel>Rejection Reason</FormLabel>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
              rows={3}
            />
            {isReasonEmpty && reason !== '' && (
              <FormErrorMessage>Reason is required</FormErrorMessage>
            )}
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            onClick={handleReject}
            isLoading={isLoading}
            loadingText="Rejecting..."
            isDisabled={isReasonEmpty}
          >
            Reject
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
