// src/pages/producer/batches.tsx
import { useEffect, useMemo, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Link,
  Select,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ExternalLinkIcon, SearchIcon, RepeatIcon, CopyIcon, AddIcon } from "@chakra-ui/icons";
import { Layout } from "@/components/layout";
import { StatusBadge, type ProductStatus } from "@/components/product";
import { useToast } from "@chakra-ui/react";

type BatchRow = {
  id: string; // product ID (internal)
  name: string;
  blockchainId: number;
  harvestDate?: string;
  createdAt: string;
  status: ProductStatus | string;
};

type OnChainStatus =
  | "REGISTERED"
  | "RECEIVED"
  | "QUALITY_CHECK"
  | "SHIPPED"
  | "STOCKED"
  | "SOLD"
  | "REJECTED";

const STATUS_OPTIONS: { value: OnChainStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All statuses" },
  { value: "REGISTERED", label: "Registered" },
  { value: "RECEIVED", label: "Received" },
  { value: "QUALITY_CHECK", label: "Quality Check" },
  { value: "SHIPPED", label: "Shipped" },
  { value: "STOCKED", label: "Stocked" },
  { value: "SOLD", label: "Sold" },
  { value: "REJECTED", label: "Rejected" },
];

const toOnChainStatus = (
  status: ProductStatus | OnChainStatus | string | null | undefined
): OnChainStatus | null => {
  const raw = (status || "").toString().trim().toUpperCase();
  if (!raw) return null;

  const aliases: Record<string, OnChainStatus> = {
    IN_STOCK: "STOCKED",
    INTRANSIT: "SHIPPED",
    IN_TRANSIT: "SHIPPED",
    QUALITYCHECKED: "QUALITY_CHECK",
    QUALITYCHECK: "QUALITY_CHECK",
    REJECT: "REJECTED",
  };

  const canonical = aliases[raw] || (raw as OnChainStatus);
  const valid = new Set<OnChainStatus>([
    "REGISTERED",
    "RECEIVED",
    "QUALITY_CHECK",
    "SHIPPED",
    "STOCKED",
    "SOLD",
    "REJECTED",
  ]);
  return valid.has(canonical) ? canonical : null;
};

export default function ProducerBatchesPage() {
  const router = useRouter();
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [status, setStatus] = useState<OnChainStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      const matchesQuery =
        !query ||
        row.id.toLowerCase().includes(query.toLowerCase()) ||
        row.name.toLowerCase().includes(query.toLowerCase());
      const canonical = toOnChainStatus(row.status);
      const matchesStatus =
        status === "ALL" || (canonical !== null && canonical === status);
      return matchesQuery && matchesStatus;
    });
  }, [rows, query, status]);

  useEffect(() => {
    const fetchRows = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/products?company=me");
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Failed to fetch batches");
          return;
        }
        const mapped: BatchRow[] = data.products.map((p: any) => ({
          id: p.id,
          name: p.name,
          blockchainId: p.blockchainId,
          harvestDate: p.harvestDate,
          createdAt: p.createdAt,
          status: p.status,
        }));
        setRows(mapped);
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRows();
  }, []);

  const renderDate = (row: BatchRow) =>
    row.harvestDate
      ? new Date(row.harvestDate).toLocaleDateString()
      : new Date(row.createdAt).toLocaleDateString();

  const renderProductId = (id: string) =>
    id ? `${id.slice(0, 6)}...${id.slice(-4)}` : "N/A";

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: `${label} copied`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch {
      toast({
        title: `Failed to copy ${label}`,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Layout>
      <VStack align="stretch" spacing={4} py={6}>
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={3}
          wrap="wrap"
        >
          <Text fontSize="xl" fontWeight="semibold" color="brand.dark">
            My Batches
          </Text>
          <Button
            type="button"
            onClick={() => router.push("/producer/register")}
            leftIcon={<AddIcon />}
            width={{ base: "100%", sm: "auto" }}
          >
            Create Batch
          </Button>
        </Flex>

        {/* Filters */}
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={3}
          align={{ base: "stretch", md: "center" }}
        >
          <HStack flex="1">
            <Input
              placeholder="Search product name or product ID"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              onClick={() => {}}
              minW="44px"
              minH="44px"
            />
          </HStack>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as OnChainStatus | "ALL")}
            maxW={{ base: "100%", md: "220px" }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          <Button
            variant="outline"
            leftIcon={<RepeatIcon />}
            onClick={() => {
              setQuery("");
              setStatus("ALL");
            }}
            maxW={{ base: "100%", md: "140px" }}
          >
            Reset
          </Button>
        </Flex>

        {/* Table / states */}
        {isLoading && (
          <Flex justify="center" py={8}>
            <Spinner size="lg" color="brand.primary" />
          </Flex>
        )}

        {error && !isLoading && (
          <Box
            borderWidth="1px"
            borderColor="brand.error"
            borderRadius="md"
            p={4}
            color="brand.error"
          >
            {error}
          </Box>
        )}

        {!isLoading && !error && filteredRows.length === 0 && (
          <Box
            borderWidth="1px"
            borderRadius="md"
            borderColor="brand.border"
            p={6}
            textAlign="center"
            color="brand.muted"
          >
            No batches match your filters.
          </Box>
        )}

        {!isLoading && !error && filteredRows.length > 0 && (
          <Box
            borderWidth="1px"
            borderRadius="lg"
            borderColor="brand.border"
            bg="brand.surface"
            overflowX="auto"
          >
            <Table size="sm">
              <Thead bg="brand.surfaceAlt">
                <Tr>
                  <Th>Blockchain ID</Th>
                  <Th>Product</Th>
                  <Th>Date</Th>
                  <Th>Status</Th>
                  <Th>Product ID</Th>
                  <Th>Detail</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredRows.map((row) => (
                  <Tr key={row.id}>
                    <Td>
                      <HStack spacing={2}>
                        <Text>#{row.blockchainId}</Text>
                        <IconButton
                          aria-label="Copy blockchain ID"
                          icon={<CopyIcon />}
                          size="xs"
                          variant="ghost"
                          minW="32px"
                          minH="32px"
                          onClick={() => handleCopy(row.blockchainId.toString(), "Blockchain ID")}
                        />
                      </HStack>
                    </Td>
                    <Td>{row.name}</Td>
                    <Td>{renderDate(row)}</Td>
                    <Td>
                      <StatusBadge status={toOnChainStatus(row.status) ?? row.status} />
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Tooltip label={row.id}>
                          <Text as="span">{renderProductId(row.id)}</Text>
                        </Tooltip>
                        <IconButton
                          aria-label="Copy product ID"
                          icon={<CopyIcon />}
                          size="xs"
                          variant="ghost"
                          minW="32px"
                          minH="32px"
                          onClick={() => handleCopy(row.id, "Product ID")}
                        />
                      </HStack>
                    </Td>
                    <Td>
                      <Link
                        as={NextLink}
                        href={`/product/${row.id}`}
                        color="brand.accent"
                        display="inline-flex"
                        alignItems="center"
                        gap={1}
                      >
                        Detail <ExternalLinkIcon boxSize={3} />
                      </Link>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Layout>
  );
}
