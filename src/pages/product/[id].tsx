// Product detail page for internal roles (producer/distributor/retailer)
// Shows product summary and full trace timeline
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Flex,
  Button,
  Text,
  Spinner,
  Center,
  Icon,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { InfoIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { Layout } from "@/components/layout";
import { ProductSummaryCard } from "@/components/product";
import { StatusBadge, type ProductStatus } from "@/components/product/StatusBadge";
import { TraceTimeline } from "@/components/trace/TraceTimeline";

type ProductResponse = {
  id: string;
  name: string;
  origin: string;
  blockchainId: number;
  harvestDate: string | null;
  transactionHash: string | null;
  status?: ProductStatus;
  company: { name: string } | null;
  currentOwner?: { name: string } | null;
  createdAt: string;
};

type ProductSummaryData = {
  productName: string;
  blockchainId: string;
  productId: string;
  originFarm: string;
  originLocation: string;
  productionDate: string;
  bestBefore: string;
  certification?: string;
  blockchainStatus: "VERIFIED" | "PENDING" | "ERROR";
  lastUpdated: string;
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) {
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
    return (
      <Layout>
        <Center py={12}>
          <Spinner size="lg" color="brand.primary" />
        </Center>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <Center py={12} flexDirection="column">
          <Icon as={InfoIcon} boxSize={8} color="brand.error" mb={3} />
          <Text color="brand.error" mb={3}>
            {error || "Product not found"}
          </Text>
          <Button onClick={() => router.push("/producer/batches")} variant="outline">
            Back to My Batches
          </Button>
        </Center>
      </Layout>
    );
  }

  const summaryData: ProductSummaryData = {
    productName: product.name,
    blockchainId: `#${product.blockchainId}`,
    productId: product.id,
    originFarm: product.company?.name || "Not available",
    originLocation: product.origin,
    productionDate: product.harvestDate
      ? new Date(product.harvestDate).toLocaleDateString()
      : "Not available",
    bestBefore: "Not available",
    certification: "Not available",
    blockchainStatus: "VERIFIED",
    lastUpdated: new Date(product.createdAt).toLocaleString(),
  };

  return (
    <Layout>
      <VStack align="stretch" spacing={6} py={4}>
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={3}
          wrap="wrap"
        >
          <Text fontSize="xl" fontWeight="semibold" color="brand.dark">
            Batches Details
          </Text>
          <Button
            type="button"
            onClick={() => router.back()}
            leftIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
        </Flex>
        <ProductSummaryCard data={summaryData} />

        <Flex align="center" gap={3} color="brand.muted" flexWrap="wrap">
          {product.status && (
            <HStack spacing={2}>
              <Text fontSize="sm">Status:</Text>
              <StatusBadge status={product.status} />
            </HStack>
          )}
          {/* {product.transactionHash && (
            <HStack spacing={2}>
              <Text fontSize="sm">Tx:</Text>
              <Link
                href={`https://sepolia.etherscan.io/tx/${product.transactionHash}`}
                isExternal
                color="brand.accent"
              >
                {`${product.transactionHash.slice(0, 10)}...`}
                <ExternalLinkIcon mx="2px" />
              </Link>
            </HStack>
          )}
          {product.currentOwner?.name && (
            <Text fontSize="sm">Current Owner: {product.currentOwner.name}</Text>
          )} */}
        </Flex>

        <Box>
          <Text fontSize="md" fontWeight="semibold" color="brand.dark" mb={3}>
            Trace History
          </Text>
          <TraceTimeline productId={product.id} />
        </Box>
      </VStack>
    </Layout>
  );
}
