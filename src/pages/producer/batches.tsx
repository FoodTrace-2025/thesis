// src/pages/producer/batches.tsx
import { useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
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
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon, RepeatIcon, AddIcon } from "@chakra-ui/icons";
import { Layout } from "@/components/layout";
import { type ProductStatus } from "@/components/product";
import { useToast } from "@chakra-ui/react";
import { BatchTable, type BatchTableRow } from "@/components/product/BatchTable";
import { TraceRecordForm } from "@/components/trace";

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
  origin?: string;
  currentOwner?: { name: string } | null;
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  if (session.user.role !== "PRODUCER") {
    return { redirect: { destination: "/dashboard", permanent: false } };
  }

  let companyName = "";
  if (session.user.companyId) {
    const company = await prisma.company.findUnique({
      where: { id: session.user.companyId },
      select: { name: true },
    });
    companyName = company?.name || "";
  }

  return {
    props: {
      userName: session.user.name || session.user.email,
      companyName,
    },
  };
}

interface ProducerBatchesProps {
  userName: string;
  companyName: string;
}

export default function ProducerBatchesPage({ companyName }: ProducerBatchesProps) {
  const router = useRouter();
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [status, setStatus] = useState<OnChainStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const filteredRows = useMemo(() => {
    const base = activeTab === 0
      ? rows.filter((row) => (row.currentOwner?.name || "").toLowerCase() === companyName.toLowerCase())
      : rows;
    return base.filter((row) => {
      const matchesQuery =
        !query ||
        row.id.toLowerCase().includes(query.toLowerCase()) ||
        row.name.toLowerCase().includes(query.toLowerCase());
      const canonical = toOnChainStatus(row.status);
      const matchesStatus =
        status === "ALL" || (canonical !== null && canonical === status);
      return matchesQuery && matchesStatus;
    });
  }, [rows, query, status, activeTab, companyName]);

  const fetchRows = useCallback(async () => {
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
        origin: p.origin,
        currentOwner: p.currentOwner,
        status: p.status,
      }));
      setRows(mapped);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

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

  const handleAddTrace = (productId: string) => {
    setSelectedProductId(productId);
    onOpen();
  };

  const handleTraceSuccess = () => {
    onClose();
    setSelectedProductId(null);
    // Refresh data to reflect new trace status
    fetchRows();
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

        <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
          <TabList>
            <Tab>
              In Custody
              <Badge ml={2} colorScheme="green" borderRadius="full">
                {rows.filter((r) => (r.currentOwner?.name || "").toLowerCase() === companyName.toLowerCase()).length}
              </Badge>
            </Tab>
            <Tab>
              All
              <Badge ml={2} colorScheme="gray" borderRadius="full">
                {rows.length}
              </Badge>
            </Tab>
          </TabList>
          <TabPanels>
            {[0, 1].map((tabIndex) => (
              <TabPanel key={tabIndex} px={0}>
                <Filters
                  query={query}
                  status={status}
                  onQueryChange={setQuery}
                  onStatusChange={(value) => setStatus(value)}
                  onReset={() => {
                    setQuery("");
                    setStatus("ALL");
                  }}
                />

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
                    showOrigin
                    showOwner
                    actionsHeader="Actions"
                    renderActions={tabIndex === 0 ? (row) => actionButtons(row, companyName, handleAddTrace) : undefined}
                    showDetail
                  />
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>

      </VStack>

      <Modal isOpen={isOpen} onClose={() => { setSelectedProductId(null); onClose(); }} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Trace Record</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedProductId && (
              <TraceRecordForm
                productId={selectedProductId}
                userRole="PRODUCER"
                onSuccess={handleTraceSuccess}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Layout>
  );
}

function Filters({
  query,
  status,
  onQueryChange,
  onStatusChange,
  onReset,
}: {
  query: string;
  status: OnChainStatus | "ALL";
  onQueryChange: (value: string) => void;
  onStatusChange: (value: OnChainStatus | "ALL") => void;
  onReset: () => void;
}) {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      gap={3}
      align={{ base: "stretch", md: "center" }}
      mb={3}
      mt={4}
    >
      <HStack flex="1">
        <Input
          placeholder="Search product name or product ID"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
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
        onChange={(e) => onStatusChange(e.target.value as OnChainStatus | "ALL")}
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
        onClick={onReset}
        maxW={{ base: "100%", md: "140px" }}
      >
        Reset
      </Button>
    </Flex>
  );
}

function actionButtons(
  row: BatchTableRow,
  companyName: string,
  onAddTrace: (productId: string) => void
): ReactNode {
  const inCustody = (row.currentOwner?.name || "").toLowerCase() === companyName.toLowerCase();
  if (!inCustody) return null;
  return (
    <HStack spacing={2}>
      <Button size="sm" colorScheme="green" onClick={() => onAddTrace(row.id)}>
        Add Trace
      </Button>
    </HStack>
  );
}
