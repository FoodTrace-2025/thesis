// src/components/admin/ApproveModal.tsx
// Story 2.8 Task 4: Approve confirmation modal

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
  useToast,
} from '@chakra-ui/react';

interface Company {
  id: string;
  name: string;
  type: string;
}

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onSuccess: () => void;
}

export function ApproveModal({ isOpen, onClose, company, onSuccess }: ApproveModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleApprove = async () => {
    if (!company) return;

    setIsLoading(true);

    try {
      const res = await fetch(`/api/admin/companies/${company.id}/approve`, {
        method: 'POST',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to approve company');
      }

      toast({
        title: 'Company approved',
        description: `${company.name} has been approved and assigned a wallet.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Approval failed',
        description: error instanceof Error ? error.message : 'Failed to approve company',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Approve Company</ModalHeader>
        <ModalBody>
          <Text>
            Are you sure you want to approve <strong>{company?.name}</strong>?
          </Text>
          <Text mt={2} fontSize="sm" color="brand.muted">
            This will generate an Ethereum wallet for this {company?.type?.toLowerCase()} company.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} isDisabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleApprove} isLoading={isLoading} loadingText="Approving...">
            Approve
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
