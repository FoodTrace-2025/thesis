// src/pages/trace/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Flex,
  Button,
  Icon,
  Text,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { LoadingSpinner, ErrorBoundary } from "@/components/ui";
import { ProductSummaryCard } from "@/components/product";
import { TraceTimelineConsumer } from "@/components/trace/TraceTimelineC";

// This matches the API response from /api/products/[id]
type ProductResponse = {
  id: string;
  name: string;
  origin: string;
  blockchainId: number;
  harvestDate: string;
  transactionHash: string;
  currentOwner: { name: string } | null;
  company: { name: string };
  createdAt: string;
};

// This matches what ProductSummaryCard expects
type ProductTraceSummary = {
  productName: string;
  batchId: string;
  qrCodeId: string;
  originFarm: string;
  originLocation: string;
  productionDate: string;
  bestBefore: string;
  certification: string;
  blockchainStatus: "VERIFIED" | "PENDING" | "ERROR";
  lastUpdated: string;
};

export default function ConsumerTracePage() {
  return (
    <ErrorBoundary>
      <ConsumerLayout>
        <ConsumerTraceContent />
      </ConsumerLayout>
    </ErrorBoundary>
  );
}

function ConsumerTraceContent() {
  const router = useRouter();
  const { id } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<ProductResponse | null>(null);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Product not found");
          setProduct(null);
          return;
        }

        setProduct(data.product as ProductResponse);
      } catch {
        setError("Network error. Please try again.");
        setProduct(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner text="Verifying product on blockchain..." />;
  }

  if (error) {
    return (
      <Box py={8} textAlign="center">
        <Text color="brand.error" mb={4}>
          {error}
        </Text>
        <Button
          type="button"
          onClick={() => router.push("/trace")}
          variant="outline"
        >
          Go back to scan
        </Button>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box py={8} textAlign="center">
        <Text color="brand.muted" mb={4}>
          Product not found.
        </Text>
        <Button
          type="button"
          onClick={() => router.push("/trace")}
          variant="outline"
        >
          Go back to scan
        </Button>
      </Box>
    );
  }

  const summaryData: ProductTraceSummary = {
    productName: product.name,
    batchId: `#${product.blockchainId}`,
    qrCodeId: product.id,
    originFarm: product.company?.name ?? "Not available",
    originLocation: product.origin,
    productionDate: product.harvestDate.slice(0, 10),
    bestBefore: "Not available",
    certification: "Not available",
    blockchainStatus: "VERIFIED",
    lastUpdated: new Date(product.createdAt).toLocaleString(),
  };

  return (
    <Box py={8}>
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={6}
        mb={8}
        align={{ base: "stretch", md: "flex-start" }}
      >
        {/* Left: product summary card */}
        <Box flex="2">
          <ProductSummaryCard data={summaryData} />
        </Box>

        {/* Right: explanation card */}
        <Box
          flex="1"
          bg="brand.surfaceAlt"
          borderRadius="lg"
          p={5}
          borderWidth="1px"
          borderColor="brand.surfaceAlt"
        >
          <Flex align="center" gap={3} mb={3}>
            <Icon as={LockIcon} boxSize={5} color="brand.primary" />
            <Text fontWeight="semibold" color="brand.dark">
              What am I seeing?
            </Text>
          </Flex>
          <Text fontSize="sm" color="brand.muted" mb={2}>
            This product&apos;s journey is recorded on a public blockchain.
            Every handoff is signed by each company and cannot be changed later.
          </Text>
          <Text fontSize="sm" color="brand.muted">
            You can see who produced, transported, and sold this batch before it
            reached you.
          </Text>
        </Box>
      </Flex>

      {/* Timeline using real trace data */}
      <TraceTimelineConsumer productId={product.id} />

      <Flex
        mt={6}
        justify={{ base: "stretch", sm: "flex-start" }}
      >
        <Button
          type="button"
          onClick={() => router.push("/trace")}
          variant="outline"
          width={{ base: "100%", sm: "auto" }}
        >
          Scan Another Product
        </Button>
      </Flex>
    </Box>
  );
}
