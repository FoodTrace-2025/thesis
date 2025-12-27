import NextLink from "next/link";
import { type ReactNode } from "react";
import {
  Box,
  HStack,
  IconButton,
  Link,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  Text,
} from "@chakra-ui/react";
import { CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { StatusBadge, type ProductStatus } from "@/components/product";

export type BatchTableRow = {
  id: string;
  name: string;
  blockchainId: number;
  harvestDate?: string | null;
  createdAt: string;
  status: ProductStatus | string;
  origin?: string | null;
  currentOwner?: { name: string } | null;
};

interface BatchTableProps {
  rows: BatchTableRow[];
  onCopy?: (value: string, label: string) => void;
  detailBasePath?: string; // e.g., "/product"
  showDetail?: boolean;
  showOrigin?: boolean;
  showOwner?: boolean;
  actionsHeader?: string;
  renderActions?: (row: BatchTableRow) => ReactNode;
}

export function BatchTable({
  rows,
  onCopy,
  detailBasePath = "/product",
  showDetail = true,
  showOrigin = false,
  showOwner = false,
  actionsHeader = "Actions",
  renderActions,
}: BatchTableProps) {
  const renderDate = (row: BatchTableRow) =>
    row.harvestDate
      ? new Date(row.harvestDate).toLocaleDateString()
      : new Date(row.createdAt).toLocaleDateString();

  const renderProductId = (id: string) =>
    id ? `${id.slice(0, 6)}...${id.slice(-4)}` : "N/A";

  return (
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
            {showOrigin && <Th>Origin</Th>}
            {showOwner && <Th>Current Owner</Th>}
            <Th>Date</Th>
            <Th>Status</Th>
            <Th>Product ID</Th>
            {renderActions && <Th>{actionsHeader}</Th>}
            {showDetail && <Th>Detail</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.id}>
              <Td>
                <HStack spacing={2}>
                  <Text>#{row.blockchainId}</Text>
                  {onCopy && (
                    <IconButton
                      aria-label="Copy blockchain ID"
                      icon={<CopyIcon />}
                      size="xs"
                      variant="ghost"
                      minW="32px"
                      minH="32px"
                      onClick={() => onCopy(row.blockchainId.toString(), "Blockchain ID")}
                    />
                  )}
                </HStack>
              </Td>
              <Td>{row.name}</Td>
              {showOrigin && <Td>{row.origin || "—"}</Td>}
              {showOwner && <Td>{row.currentOwner?.name || "—"}</Td>}
              <Td>{renderDate(row)}</Td>
              <Td>
                <StatusBadge status={row.status} />
              </Td>
              <Td>
                <HStack spacing={2}>
                  <Tooltip label={row.id}>
                    <Text as="span">{renderProductId(row.id)}</Text>
                  </Tooltip>
                  {onCopy && (
                    <IconButton
                      aria-label="Copy product ID"
                      icon={<CopyIcon />}
                      size="xs"
                      variant="ghost"
                      minW="32px"
                      minH="32px"
                      onClick={() => onCopy(row.id, "Product ID")}
                    />
                  )}
                </HStack>
              </Td>
              {renderActions && <Td>{renderActions(row)}</Td>}
              {showDetail && (
                <Td>
                  <Link
                    as={NextLink}
                    href={`${detailBasePath}/${row.id}`}
                    color="brand.accent"
                    display="inline-flex"
                    alignItems="center"
                    gap={1}
                  >
                    Detail <ExternalLinkIcon boxSize={3} />
                  </Link>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
