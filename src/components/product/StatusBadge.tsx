// Story 7.12: Product Status Badge Component
// Story 7.17: Added IN_TRANSIT status for incoming shipments
// Displays IN_STOCK (green), SOLD (gray), or IN_TRANSIT (orange) status

import { Badge } from '@chakra-ui/react';

export type ProductStatus = 'IN_STOCK' | 'SOLD' | 'IN_TRANSIT';

interface StatusBadgeProps {
  status: ProductStatus;
}

const STATUS_CONFIG = {
  IN_STOCK: { label: 'In Stock', color: 'status.stocked' },
  SOLD: { label: 'Sold', color: 'status.default' },
  IN_TRANSIT: { label: 'In Transit', color: 'status.shipped' },
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge
      fontSize="xs"
      borderRadius="full"
      px={3}
      borderWidth="1px"
      borderColor={config.color}
      color={config.color}
      bg="brand.surface"
    >
      {config.label}
    </Badge>
  );
}
