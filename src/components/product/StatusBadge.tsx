// Story 7.12: Product Status Badge Component
// Story 7.17: Added IN_TRANSIT status for incoming shipments
// Displays IN_STOCK (green), SOLD (gray), or IN_TRANSIT (orange) status

import { Badge } from '@chakra-ui/react';

export type ProductStatus = 'IN_STOCK' | 'SOLD' | 'IN_TRANSIT';

interface StatusBadgeProps {
  status: ProductStatus;
}

const STATUS_CONFIG = {
  IN_STOCK: { label: 'In Stock', colorScheme: 'green' },
  SOLD: { label: 'Sold', colorScheme: 'gray' },
  IN_TRANSIT: { label: 'In Transit', colorScheme: 'orange' },
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge colorScheme={config.colorScheme} fontSize="xs">
      {config.label}
    </Badge>
  );
}
