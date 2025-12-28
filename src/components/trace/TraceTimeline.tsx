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
  REGISTERED: "status.registered",
  RECEIVED: "status.received",
  QUALITY_CHECK: "status.qualityChecked",
  QUALITY_FAIL: "status.rejected", // Story 7.18: Red color for failed quality check
  SHIPPED: "status.shipped",
  STOCKED: "status.stocked",
  SOLD: "status.sold",
};

// Story 7.18: Human-readable action labels (consistency with ConsumerTraceTimeline)
const ACTION_LABELS: Record<string, string> = {
  REGISTERED: "Registered",
  RECEIVED: "Received",
  QUALITY_CHECK: "Quality Check",
  QUALITY_FAIL: "Quality Fail",
  SHIPPED: "Shipped",
  STOCKED: "Stocked",
  SOLD: "Sold",
};

function getActionColor(action: string): string {
  return ACTION_COLORS[action] || "status.default";
}

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
        <Text color="brand.error">{error}</Text>
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
      {records.map((record, index) => {
        const actionColor = getActionColor(record.action);
        // Story 7.18: Use ACTION_LABELS for consistent formatting (not string replace)
        const label = ACTION_LABELS[record.action] || record.action;
        return (
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
                bg={actionColor}
                flexShrink={0}
                mt={1}
              />

              {/* Content */}
              <Box flex={1}>
                <HStack spacing={2} mb={1} flexWrap="wrap">
                  <Badge
                    borderRadius="full"
                    px={3}
                    borderWidth="1px"
                    borderColor={actionColor}
                    color={actionColor}
                    bg="brand.surface"
                  >
                    {label}
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
        );
      })}
    </VStack>
  );
}
