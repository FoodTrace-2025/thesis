// src/pages/retailer/products.tsx
// Retailer "My Products" page using shared table layout

import { useEffect, useMemo, useState, useCallback, type ReactNode } from "react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  Center,
  Icon,
  IconButton,
  Input,
  Select,
  Spinner,
  Heading,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon, RepeatIcon, InfoIcon } from "@chakra-ui/icons";
import { Layout } from "@/components/layout";
import { type ProductStatus } from "@/components/product";
import { BatchTable, type BatchTableRow } from "@/components/product/BatchTable";
import { TraceRecordForm } from "@/components/trace";

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
  origin: string;
  blockchainId: number;
  harvestDate?: string;
  currentOwner: { name: string } | null;
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }

  if (session.user.role !== "RETAILER") {
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
      userRole: session.user.role,
      companyId: session.user.companyId,
      companyName,
    },
  };
}

interface RetailerProductsProps {
  userName: string;
  userRole: string;
  companyId: string | null;
  companyName: string;
}

export default function RetailerProductsPage({ userRole }: RetailerProductsProps) {
  const [custodyRows, setCustodyRows] = useState<BatchTableRow[]>([]);
  const [historyRows, setHistoryRows] = useState<BatchTableRow[]>([]);
  const [quarantineRows, setQuarantineRows] = useState<BatchTableRow[]>([]); // Story 7.19
  const [status, setStatus] = useState<OnChainStatus | "ALL">("ALL");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [custodyLoading, setCustodyLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [quarantineLoading, setQuarantineLoading] = useState(false); // Story 7.19
  const [custodyError, setCustodyError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [quarantineError, setQuarantineError] = useState<string | null>(null); // Story 7.19
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [quarantineLoaded, setQuarantineLoaded] = useState(false); // Story 7.19
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleModalClose = () => {
    onClose();
    setSelectedProductId(null);
  };

  const filteredRows = useMemo(() => {
    const rows = activeTab === 0 ? custodyRows : activeTab === 1 ? historyRows : quarantineRows;
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
  }, [activeTab, custodyRows, historyRows, quarantineRows, query, status]);

  const fetchCustody = useCallback(async () => {
    setCustodyLoading(true);
    setCustodyError(null);
    try {
      const res = await fetch("/api/products?owner=me");
      const data = await res.json();
      if (!res.ok) {
        setCustodyError(data.error || "Failed to fetch products");
        return;
      }
      const mapped: BatchTableRow[] = (data.products as ApiProduct[]).map((p) => ({
        id: p.id,
        name: p.name,
        blockchainId: p.blockchainId,
        harvestDate: p.harvestDate,
        createdAt: p.createdAt,
        status: p.status,
        origin: p.origin,
        currentOwner: p.currentOwner,
      }));
      setCustodyRows(mapped);
    } catch {
      setCustodyError("Network error. Please try again.");
    } finally {
      setCustodyLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustody();
  }, [fetchCustody]);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const res = await fetch("/api/products?history=me");
      const data = await res.json();
      if (!res.ok) {
        setHistoryError(data.error || "Failed to fetch history");
        return;
      }
      const mapped: BatchTableRow[] = (data.products as ApiProduct[]).map((p) => ({
        id: p.id,
        name: p.name,
        blockchainId: p.blockchainId,
        harvestDate: p.harvestDate,
        createdAt: p.createdAt,
        status: p.status,
        origin: p.origin,
        currentOwner: p.currentOwner,
      }));
      setHistoryRows(mapped);
      setHistoryLoaded(true);
    } catch {
      setHistoryError("Network error. Please try again.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Story 7.19: Fetch quarantined products
  const fetchQuarantine = useCallback(async () => {
    setQuarantineLoading(true);
    setQuarantineError(null);
    try {
      const res = await fetch("/api/products?quarantined=me");
      const data = await res.json();
      if (!res.ok) {
        setQuarantineError(data.error || "Failed to fetch quarantined products");
        return;
      }
      const mapped: BatchTableRow[] = (data.products as ApiProduct[]).map((p) => ({
        id: p.id,
        name: p.name,
        blockchainId: p.blockchainId,
        harvestDate: p.harvestDate,
        createdAt: p.createdAt,
        status: p.status,
        origin: p.origin,
        currentOwner: p.currentOwner,
      }));
      setQuarantineRows(mapped);
      setQuarantineLoaded(true);
    } catch {
      setQuarantineError("Network error. Please try again.");
    } finally {
      setQuarantineLoading(false);
    }
  }, []);

  const handleAddTrace = (productId: string) => {
    setSelectedProductId(productId);
    onOpen();
  };

  const handleTraceSuccess = () => {
    onClose();
    setSelectedProductId(null);
    fetchCustody();
    if (historyLoaded) {
      fetchHistory();
    }
    if (quarantineLoaded) {
      fetchQuarantine(); // Story 7.19: Refresh quarantine on trace action
    }
    toast({
      title: "Trace record added",
      description: "The trace record has been recorded.",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  };

  const handleCopy = useCallback(
    async (value: string, label: string) => {
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
    },
    [toast]
  );

  return (
    <Layout>
      <VStack align="stretch" spacing={4} py={6}>
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={3}
          wrap="wrap"
        >
          <Heading size="lg" color="brand.dark">
            My Products
          </Heading>
        </Flex>

        <Tabs
          index={activeTab}
          colorScheme="green"
          onChange={(index) => {
            setActiveTab(index);
            if (index === 1 && !historyLoaded) {
              fetchHistory();
            }
            if (index === 2 && !quarantineLoaded) {
              fetchQuarantine(); // Story 7.19: Lazy-load quarantine data
            }
          }}
        >
          <TabList>
            <Tab>
              In Store{" "}
              <Badge ml={2} borderRadius="full" bg="status.inStore" color="brand.surface">
                {custodyRows.length}
              </Badge>
            </Tab>
            <Tab>
              Product History{" "}
              <Badge ml={2} borderRadius="full" bg="status.history" color="brand.surface">
                {historyRows.length}
              </Badge>
            </Tab>
            <Tab>
              Quarantined{" "}
              <Badge ml={2} borderRadius="full" colorScheme="red">
                {quarantineRows.length}
              </Badge>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel px={0}>
              <Filters
                query={query}
                status={status}
                onQueryChange={setQuery}
                onStatusChange={setStatus}
                onReset={() => {
                  setQuery("");
                  setStatus("ALL");
                }}
              />
              <TableState
                isLoading={custodyLoading}
                error={custodyError}
                rows={filteredRows}
                onCopy={handleCopy}
                renderActions={(row) => (
                  <HStack spacing={2}>
                    <Button size="sm" onClick={() => handleAddTrace(row.id)}>
                      Add Trace
                    </Button>
                  </HStack>
                )}
              />
            </TabPanel>
            <TabPanel px={0}>
              <Filters
                query={query}
                status={status}
                onQueryChange={setQuery}
                onStatusChange={setStatus}
                onReset={() => {
                  setQuery("");
                  setStatus("ALL");
                }}
              />
              <TableState
                isLoading={historyLoading}
                error={historyError}
                rows={filteredRows}
                onCopy={handleCopy}
              />
            </TabPanel>
            {/* Story 7.19: Quarantined Products Tab */}
            <TabPanel px={0}>
              <Filters
                query={query}
                status={status}
                onQueryChange={setQuery}
                onStatusChange={setStatus}
                onReset={() => {
                  setQuery("");
                  setStatus("ALL");
                }}
              />
              <TableState
                isLoading={quarantineLoading}
                error={quarantineError}
                rows={filteredRows}
                onCopy={handleCopy}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      <Modal isOpen={isOpen} onClose={handleModalClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Trace Record</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedProductId && (
              <TraceRecordForm
                productId={selectedProductId}
                userRole={userRole}
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

function TableState({
  isLoading,
  error,
  rows,
  onCopy,
  renderActions,
}: {
  isLoading: boolean;
  error: string | null;
  rows: BatchTableRow[];
  onCopy: (value: string, label: string) => void;
  renderActions?: (row: BatchTableRow) => ReactNode;
}) {
  if (isLoading) {
    return (
      <Flex justify="center" py={8}>
        <Spinner size="lg" color="brand.primary" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box
        borderWidth="1px"
        borderColor="brand.error"
        borderRadius="md"
        p={4}
        color="brand.error"
      >
        {error}
      </Box>
    );
  }

  if (rows.length === 0) {
    return (
      <Center py={8} flexDirection="column">
        <Icon as={InfoIcon} boxSize={8} color="brand.muted" mb={3} />
        <Text color="brand.muted" fontWeight="medium">
          No products in stock yet
        </Text>
        <Text color="brand.muted" fontSize="sm" mt={1}>
          Products will appear here when you receive them.
        </Text>
      </Center>
    );
  }

  return (
    <BatchTable
      rows={rows}
      onCopy={onCopy}
      detailBasePath="/product"
      showOrigin
      showOwner
      renderActions={renderActions}
      actionsHeader={renderActions ? "Actions" : undefined}
    />
  );
}
