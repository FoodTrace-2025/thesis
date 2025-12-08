import {
  Box,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";

export type ProductSummaryData = {
  productName: string;
  batchId: string;
  qrCodeId?: string;
  originFarm: string;
  originLocation: string;
  productionDate: string;
  bestBefore: string;
  certification?: string;
  blockchainStatus: "VERIFIED" | "PENDING" | "ERROR";
  lastUpdated: string;
};

type ProductSummaryCardProps = {
  data: ProductSummaryData;
};

export function ProductSummaryCard({ data }: ProductSummaryCardProps) {
  const isVerified = data.blockchainStatus === "VERIFIED";

  return (
    <Box
      bg="brand.surface"
      borderRadius="lg"
      boxShadow="sm"
      p={6}
    >
      {/* Header */}
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={4}
        spacing={4}
      >
        <Box>
          <Heading size="md" mb={1} color="brand.dark">
            {data.productName}
          </Heading>
          <Text fontSize="sm" color="brand.muted">
            Batch ID: {data.batchId}
          </Text>
          {data.qrCodeId && (
            <Text fontSize="sm" color="brand.muted">
              QR Code: {data.qrCodeId}
            </Text>
          )}
        </Box>

        <Flex align="center" gap={2}>
          <Icon
            as={CheckCircleIcon}
            boxSize={6}
            color={isVerified ? "green.500" : "yellow.400"}
          />
          <Box>
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={isVerified ? "green.600" : "yellow.700"}
            >
              {isVerified ? "Blockchain verified" : "Verification pending"}
            </Text>
            <Text fontSize="xs" color="brand.muted">
              Last updated: {data.lastUpdated}
            </Text>
          </Box>
        </Flex>
      </Stack>

      {/* Info grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <InfoItem label="Origin farm" value={data.originFarm} />
        <InfoItem label="Origin location" value={data.originLocation} />
        <InfoItem label="Production date" value={data.productionDate} />
        <InfoItem label="Best before" value={data.bestBefore} />
        {data.certification && (
          <InfoItem label="Certification" value={data.certification} />
        )}
      </SimpleGrid>
    </Box>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text
        fontSize="xs"
        textTransform="uppercase"
        color="brand.muted"
        mb={1}
      >
        {label}
      </Text>
      <Text fontSize="sm" fontWeight="medium" color="brand.dark">
        {value}
      </Text>
    </Box>
  );
}
