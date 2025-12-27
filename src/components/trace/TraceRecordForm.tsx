// src/components/trace/TraceRecordForm.tsx
// Story 7.5: TraceRecordForm Component
// Story 7.17: Added defaultAction prop for Accept workflow
// Form for adding trace records to products on the blockchain

import { useState, useEffect, FormEvent } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Textarea,
  VStack,
  Text,
  Alert,
  AlertIcon,
  useToast,
  Link,
  Spinner,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { z } from 'zod';

// Company type for recipient selection (Story 7.16)
interface Company {
  id: string;
  name: string;
  type: string;
}

// Role-action mapping (UX best practice: show only relevant options per role)
// Reference: https://formsort.com/article/how-to-design-a-dropdown-field-in-a-form/
const ROLE_ACTIONS: Record<string, string[]> = {
  PRODUCER: ['QUALITY_CHECK', 'SHIPPED'],
  DISTRIBUTOR: ['RECEIVED', 'QUALITY_CHECK', 'SHIPPED'],
  RETAILER: ['RECEIVED', 'QUALITY_CHECK', 'STOCKED', 'SOLD'],
};

// Human-readable action labels
const ACTION_LABELS: Record<string, string> = {
  RECEIVED: 'Received',
  QUALITY_CHECK: 'Quality Check',
  SHIPPED: 'Shipped',
  STOCKED: 'Stocked',
  SOLD: 'Sold',
};

// Validation schema matching API (Story 7.2)
const traceSchema = z.object({
  action: z.string().min(1, 'Action is required'),
  location: z
    .string()
    .min(1, 'Location is required')
    .max(100, 'Location too long (max 100 characters)'),
  notes: z
    .string()
    .max(500, 'Notes too long (max 500 characters)')
    .optional()
    .default(''),
});

interface TraceRecordFormProps {
  productId: string;
  userRole: string;
  onSuccess?: () => void;
  defaultAction?: string; // Story 7.17: Pre-select action (e.g., 'RECEIVED' for Accept workflow)
  requireAcknowledgement?: boolean;
}

export function TraceRecordForm({
  productId,
  userRole,
  onSuccess,
  defaultAction,
  requireAcknowledgement = false,
}: TraceRecordFormProps) {
  const toast = useToast();
  const availableActions = ROLE_ACTIONS[userRole] || [];

  // Form state - initialize with defaultAction if provided and valid for this role
  const initialAction = defaultAction && availableActions.includes(defaultAction) ? defaultAction : '';
  const [action, setAction] = useState(initialAction);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAcknowledged, setIsAcknowledged] = useState(!requireAcknowledgement);

  // Story 7.16: Company selection for SHIPPED action
  const [recipientCompanyId, setRecipientCompanyId] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState('');

  // Fetch companies when SHIPPED action is selected
  useEffect(() => {
    if (action === 'SHIPPED') {
      setCompaniesLoading(true);
      setCompaniesError('');
      fetch('/api/companies?type=DISTRIBUTOR,RETAILER&status=APPROVED')
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setCompanies(data.companies);
            if (data.companies.length === 0) {
              setCompaniesError('No companies available to ship to');
            }
          } else {
            setCompaniesError(data.error || 'Failed to load companies');
          }
        })
        .catch(() => {
          setCompaniesError('Failed to load companies');
        })
        .finally(() => {
          setCompaniesLoading(false);
        });
    } else {
      // Clear company selection when action changes
      setRecipientCompanyId('');
      setCompanies([]);
      setCompaniesError('');
    }
  }, [action]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');

    // Validate
    const result = traceSchema.safeParse({ action, location, notes });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Story 7.16: Validate recipient for SHIPPED action
    if (action === 'SHIPPED' && !recipientCompanyId) {
      setErrors((prev) => ({
        ...prev,
        recipientCompanyId: 'Recipient company is required for shipping',
      }));
      return;
    }
    setErrors({});

    setIsLoading(true);
    try {
      // Story 7.16: Include recipientCompanyId for SHIPPED
      const requestBody: { action: string; location: string; notes: string; recipientCompanyId?: string } = {
        action,
        location,
        notes,
      };
      if (action === 'SHIPPED') {
        requestBody.recipientCompanyId = recipientCompanyId;
      }

      const response = await fetch(`/api/products/${productId}/trace`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 'VALIDATION_ERROR' && data.details) {
          const fieldErrors: Record<string, string> = {};
          data.details.forEach((issue: { path: string[]; message: string }) => {
            const field = issue.path[0];
            fieldErrors[field] = issue.message;
          });
          setErrors(fieldErrors);
        } else {
          setApiError(data.error || 'Failed to add trace record');
        }
        return;
      }

      // Success toast with Etherscan link
      toast({
        title: 'Trace record added',
        description: (
          <Text>
            {ACTION_LABELS[action]} recorded.{' '}
            <Link
              href={`https://sepolia.etherscan.io/tx/${data.traceRecord.transactionHash}`}
              isExternal
              color="blue.200"
            >
              View on Etherscan <ExternalLinkIcon mx="2px" />
            </Link>
          </Text>
        ),
        status: 'success',
        duration: 8000,
        isClosable: true,
      });

      // Clear form
      setAction('');
      setLocation('');
      setNotes('');
      setRecipientCompanyId(''); // Story 7.16
      onSuccess?.();
    } catch (err) {
      console.error('Add trace record failed:', err);
      setApiError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

        <FormControl isInvalid={!!errors.action} isRequired>
          <FormLabel color="brand.dark">Action</FormLabel>
          <Select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              if (errors.action) setErrors((prev) => ({ ...prev, action: '' }));
            }}
            placeholder="Select action"
            isDisabled={isLoading}
          >
            {availableActions.map((act) => (
              <option key={act} value={act}>
                {ACTION_LABELS[act]}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{errors.action}</FormErrorMessage>
        </FormControl>

        {/* Story 7.16: Company selector for SHIPPED action */}
        {action === 'SHIPPED' && (
          <FormControl isInvalid={!!errors.recipientCompanyId} isRequired>
            <FormLabel color="brand.dark">Ship to</FormLabel>
            {companiesLoading ? (
              <Box py={2}>
                <Spinner size="sm" mr={2} />
                <Text as="span" fontSize="sm" color="brand.muted">
                  Loading companies...
                </Text>
              </Box>
            ) : companiesError && companies.length === 0 ? (
              <Alert status="warning" borderRadius="md" py={2}>
                <AlertIcon />
                <Text fontSize="sm">{companiesError}</Text>
              </Alert>
            ) : (
              <Select
                value={recipientCompanyId}
                onChange={(e) => {
                  setRecipientCompanyId(e.target.value);
                  if (errors.recipientCompanyId)
                    setErrors((prev) => ({ ...prev, recipientCompanyId: '' }));
                }}
                placeholder="Select recipient company"
                isDisabled={isLoading || companies.length === 0}
              >
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name} ({company.type})
                  </option>
                ))}
              </Select>
            )}
            <FormErrorMessage>{errors.recipientCompanyId}</FormErrorMessage>
          </FormControl>
        )}

        <FormControl isInvalid={!!errors.location} isRequired>
          <FormLabel color="brand.dark">Location</FormLabel>
          <Input
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              if (errors.location)
                setErrors((prev) => ({ ...prev, location: '' }));
            }}
            placeholder="e.g., Helsinki Distribution Center"
            isDisabled={isLoading}
            maxLength={100}
          />
          <FormErrorMessage>{errors.location}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.notes}>
          <FormLabel color="brand.dark">Notes (optional)</FormLabel>
          <Textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              if (errors.notes) setErrors((prev) => ({ ...prev, notes: '' }));
            }}
            placeholder="e.g., Product received in good condition, temperature 2.1C"
            isDisabled={isLoading}
            maxLength={500}
            rows={3}
          />
          <FormErrorMessage>{errors.notes}</FormErrorMessage>
        </FormControl>

        {requireAcknowledgement && (
          <FormControl isInvalid={!isAcknowledged}>
            <Checkbox
              isChecked={isAcknowledged}
              onChange={(e) => setIsAcknowledged(e.target.checked)}
              colorScheme="green"
            >
              I have physically received and verified this product.
            </Checkbox>
            {!isAcknowledged && (
              <FormErrorMessage>
                This confirmation is required.
              </FormErrorMessage>
            )}
          </FormControl>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          loadingText="Recording on blockchain..."
          isDisabled={isLoading || !isAcknowledged}
          mt={4}
        >
          Add Trace Record
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
