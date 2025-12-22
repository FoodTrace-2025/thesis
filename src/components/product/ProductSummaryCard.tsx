import {
  Box,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Stack,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { CheckCircleIcon, LinkIcon } from "@chakra-ui/icons";

export type ProductSummaryData = {
  productName: string;
  blockchainId: string;
  productId?: string;
  originFarm: string;
  originLocation: string;
  productionDate: string;
  expireDate: string;
  certification?: string;
  blockchainStatus: "VERIFIED" | "PENDING" | "ERROR";
  lastUpdated: string;
};

type ProductSummaryCardProps = {
  data: ProductSummaryData;
  onShare?: () => void;
};

export function ProductSummaryCard({ data, onShare }: ProductSummaryCardProps) {
  const isVerified = data.blockchainStatus === "VERIFIED";

  return (
    <Box
      bg="brand.surface"
      borderRadius="lg"
      boxShadow="sm"
      p={6}
    >
      {/* Header */}
      <Stack spacing={4} mb={4}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={3}
        >
          <HStack spacing={2} align="center">
            <Heading size="md" color="brand.dark">
              {data.productName}
            </Heading>
            {onShare && (
              <IconButton
                aria-label="Share product link"
                icon={<LinkIcon />}
                variant="ghost"
                onClick={onShare}
                minW="44px"
                minH="44px"
              />
            )}
          </HStack>

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
        </Flex>

        <Box>
          <Text fontSize="sm" color="brand.muted">
            Blockchain ID: {data.blockchainId}
          </Text>
          {data.productId && (
            <Text fontSize="sm" color="brand.muted">
              Product ID: {data.productId}
            </Text>
          )}
        </Box>
      </Stack>

      {/* Info grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <InfoItem label="Origin farm" value={data.originFarm} />
        <InfoItem label="Origin location" value={data.originLocation} />
        <InfoItem label="Production date" value={data.productionDate} />
        <InfoItem label="Expire Date" value={data.expireDate} />
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
