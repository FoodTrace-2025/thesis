// src/pages/producer/batches.tsx
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Select,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { SearchIcon, RepeatIcon, AddIcon } from "@chakra-ui/icons";
import { Layout } from "@/components/layout";
import { type ProductStatus } from "@/components/product";
import { useToast } from "@chakra-ui/react";
import { BatchTable, type BatchTableRow } from "@/components/product/BatchTable";

type BatchRow = BatchTableRow & { harvestDate?: string };

type OnChainStatus =
  | "REGISTERED"
  | "RECEIVED"
  | "QUALITY_CHECK"
  | "SHIPPED"
  | "STOCKED"
  | "SOLD"
  | "REJECTED";

type ApiProduct = {
  id: string;
  name: string;
  blockchainId: number;
  harvestDate?: string;
  createdAt: string;
  status: ProductStatus | string;
};

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
        const mapped: BatchRow[] = (data.products as ApiProduct[]).map((p) => ({
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
          <BatchTable
            rows={filteredRows}
            onCopy={handleCopy}
            detailBasePath="/product"
          />
        )}
      </VStack>
    </Layout>
  );
}
