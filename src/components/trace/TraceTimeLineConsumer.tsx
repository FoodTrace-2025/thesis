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
  Flex,
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


const ACTION_COLORS: Record<string, string> = {
  RECEIVED: "blue",
  QUALITY_CHECK: "purple",
  SHIPPED: "orange",
  STOCKED: "green",
  SOLD: "teal",
};

const ACTION_LABELS: Record<string, string> = {
  RECEIVED: "Received at facility",
  QUALITY_CHECK: "Quality checked",
  SHIPPED: "Shipped to next location",
  STOCKED: "Placed on shelf",
  SOLD: "Sold to customer",
};


interface TraceTimelineProps {
  productId: string;
}

export function TraceTimelineConsumer({ productId }: TraceTimelineProps) {
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
          maxW="320px"
          mt={1}
        >
          Trace records will appear here as the product moves through the supply
          chain.
        </Text>
      </Center>
    );
  }

  return (
    <Box>
      <Text
        fontSize="sm"
        fontWeight="semibold"
        color="brand.dark"
        mb={1}
      >
        Product journey
      </Text>
      <Text fontSize="sm" color="brand.muted" mb={4}>
        Each step below shows what happened to this batch before it reached you.
      </Text>

      <VStack spacing={0} align="stretch" position="relative">
        {records.map((record, index) => {
          const colorScheme = ACTION_COLORS[record.action] || 'gray';
          const label = ACTION_LABELS[record.action] || record.action;

          return (
            <Box key={record.id} position="relative" pl={8} pb={4}>
              {/* Vertical connector line */}
              {index < records.length - 1 && (
                <Box
                  position="absolute"
                  left="16px"
                  top="28px"
                  bottom="0"
                  width="2px"
                  bg="brand.border"
                />
              )}

              {/* Timeline dot */}
              <Box
                position="absolute"
                left="8px"
                top="20px"
                w="16px"
                h="16px"
                borderRadius="full"
                borderWidth="3px"
                borderColor={`${colorScheme}.500`}
                bg="brand.surface"
              />

              {/* Card */}
              {/* Card content */}
                <Box
                  flex={1}
                  bg="brand.surface"
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor="brand.surfaceAlt"
                  boxShadow="sm"
                  p={4}
                >
                  <HStack justify="space-between" align="center" mb={2}>
                    <Badge colorScheme={colorScheme} borderRadius="full" px={3}>
                      {label}
                    </Badge>
                    <HStack spacing={1} color="brand.muted" fontSize="xs">
                      <Icon as={TimeIcon} boxSize={3} />
                      <Text>
                        {new Date(record.createdAt).toLocaleString()}
                      </Text>
                    </HStack>
                  </HStack>

                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="brand.dark"
                    mb={1}
                  >
                    {record.location}
                  </Text>

                  <Text fontSize="sm" color="brand.muted">
                    Handled by {record.actor.company} ({record.actor.role})
                  </Text>

                  {record.notes && (
                    <Text fontSize="sm" color="brand.muted" mt={2}>
                      {record.notes}
                    </Text>
                  )}

                  <Link
                    href={record.etherscanLink}
                    isExternal
                    fontSize="xs"
                    color="brand.accent"
                    mt={3}
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                  >
                    View blockchain record
                    <ExternalLinkIcon boxSize={3} />
                  </Link>
                </Box>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}
