// Story 7.12: Product Status Badge Component
// Displays IN_STOCK (green) or SOLD (gray) status

import { Badge } from '@chakra-ui/react';

export type ProductStatus = 'IN_STOCK' | 'SOLD';

interface StatusBadgeProps {
  status: ProductStatus;
}

const STATUS_CONFIG = {
  IN_STOCK: { label: 'In Stock', colorScheme: 'green' },
  SOLD: { label: 'Sold', colorScheme: 'gray' },
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge colorScheme={config.colorScheme} fontSize="xs">
      {config.label}
    </Badge>
  );
}
