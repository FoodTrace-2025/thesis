import {
  Box,
  Flex,
  HStack,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import { TrendChart } from "./TrendChart";
import { TrendRange, buildTrendData } from "./trend";

type ProductLike = { createdAt: string };

interface ProductTrendCardProps {
  title?: string;
  products: ProductLike[];
  range: TrendRange;
  onRangeChange: (range: TrendRange) => void;
  footerText?: string;
}

export function ProductTrendCard({
  title = "Batch Trend Overview",
  products,
  range,
  onRangeChange,
  footerText = "Data source: Sepolia (counts per created date)",
}: ProductTrendCardProps) {
  const trendData = buildTrendData(products, range);

  return (
    <Box borderWidth="1px" borderRadius="lg" borderColor="brand.border" bg="brand.surface" p={4}>
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <Text fontWeight="semibold" color="brand.dark">
            {title}
          </Text>
          <Select
            maxW="200px"
            value={range}
            onChange={(e) => onRangeChange(e.target.value as TrendRange)}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="1y">Last 1 year</option>
          </Select>
        </HStack>

        {trendData.length === 0 ? (
          <Flex bg="brand.surfaceAlt" borderRadius="md" borderWidth="1px" borderColor="brand.border" p={6} justify="center" color="brand.muted">
            No batch activity yet.
          </Flex>
        ) : (
          <Box bg="brand.surfaceAlt" borderRadius="md" borderWidth="1px" borderColor="brand.border" p={3}>
            <TrendChart data={trendData} range={range} />
          </Box>
        )}

        <Text fontSize="xs" color="brand.muted">
          {footerText}
        </Text>
      </VStack>
    </Box>
  );
}
