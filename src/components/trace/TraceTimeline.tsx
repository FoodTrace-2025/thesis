// src/components/trace/TraceTimeline.tsx
// Story 7.5: TraceTimeline Component
// Displays product trace history in a vertical timeline

import { useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Link,
  Spinner,
  Center,
  Icon,
} from '@chakra-ui/react';
import { ExternalLinkIcon, TimeIcon } from '@chakra-ui/icons';

interface TraceRecord {
  id: string;
  action: string;
  location: string;
  notes: string | null;
  actor: {
    name: string;
    role: string;
    company: string;
  };
  transactionHash: string;
  etherscanLink: string;
  createdAt: string;
}

// Action badge colors for visual distinction
const ACTION_COLORS: Record<string, string> = {
  RECEIVED: 'blue',
  QUALITY_CHECK: 'purple',
  SHIPPED: 'orange',
  STOCKED: 'green',
  SOLD: 'teal',
};

interface TraceTimelineProps {
  productId: string;
}

export function TraceTimeline({ productId }: TraceTimelineProps) {
  const [records, setRecords] = useState<TraceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `/api/products/${productId}/trace-history`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Failed to load trace history');
          return;
        }

        setRecords(data.traceRecords);
      } catch (err) {
        console.error('Fetch trace history failed:', err);
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [productId]);

  if (isLoading) {
    return (
      <Center py={8}>
        <Spinner size="lg" color="brand.primary" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center py={8}>
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  // Empty state with helpful message (UX best practice: NN/g guidelines)
  if (records.length === 0) {
    return (
      <Center py={8} flexDirection="column">
        <Icon as={TimeIcon} boxSize={8} color="brand.muted" mb={3} />
        <Text color="brand.muted" fontWeight="medium">
          No trace records yet
        </Text>
        <Text
          color="brand.muted"
          fontSize="sm"
          textAlign="center"
          maxW="300px"
          mt={1}
        >
          Trace records will appear here as the product moves through the supply
          chain.
        </Text>
      </Center>
    );
  }

  return (
    <VStack spacing={0} align="stretch">
      {records.map((record, index) => (
        <Box key={record.id} position="relative">
          {/* Timeline connector line */}
          {index < records.length - 1 && (
            <Box
              position="absolute"
              left="12px"
              top="24px"
              bottom="-12px"
              width="2px"
              bg="brand.border"
            />
          )}

          <HStack align="flex-start" spacing={4} py={3}>
            {/* Timeline dot with action-specific color */}
            <Box
              w="24px"
              h="24px"
              borderRadius="full"
              bg={`${ACTION_COLORS[record.action] || 'gray'}.500`}
              flexShrink={0}
              mt={1}
            />

            {/* Content */}
            <Box flex={1}>
              <HStack spacing={2} mb={1} flexWrap="wrap">
                <Badge colorScheme={ACTION_COLORS[record.action] || 'gray'}>
                  {record.action.replace('_', ' ')}
                </Badge>
                <Text fontSize="sm" color="brand.muted">
                  {new Date(record.createdAt).toLocaleString()}
                </Text>
              </HStack>

              <Text fontWeight="medium" color="brand.dark">
                {record.location}
              </Text>

              <Text fontSize="sm" color="brand.muted">
                {record.actor.name} from {record.actor.company}
              </Text>

              {record.notes && (
                <Text fontSize="sm" color="brand.muted" mt={1}>
                  {record.notes}
                </Text>
              )}

              <Link
                href={record.etherscanLink}
                isExternal
                fontSize="xs"
                color="brand.accent"
                mt={1}
                display="inline-flex"
                alignItems="center"
              >
                Verify on Etherscan <ExternalLinkIcon mx="2px" />
              </Link>
            </Box>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}
