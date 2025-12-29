// Story 7.12: Product Status Badge Component
// Story 7.17: Added IN_TRANSIT status for incoming shipments
// Extended for on-chain statuses and REJECTED business status

import { Badge } from '@chakra-ui/react';

export type ProductStatus =
  | 'SOLD'
  | 'REGISTERED'
  | 'RECEIVED'
  | 'QUALITY_CHECK'
  | 'SHIPPED'
  | 'STOCKED'
  | 'QUALITY_FAIL';

interface StatusBadgeProps {
  status: ProductStatus | string;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg?: string; textColor?: string }
> = {
  REGISTERED: { label: 'Registered', color: 'status.registered' },
  RECEIVED: { label: 'Received', color: 'status.received' },
  QUALITY_CHECK: { label: 'Quality Check', color: 'status.qualityChecked' },
  SHIPPED: { label: 'Shipped', color: 'status.shipped' },
  STOCKED: { label: 'Stocked', color: 'status.stocked' },
  SOLD: { label: 'Sold', color: 'status.sold' },
  QUALITY_FAIL: { label: 'Quality Fail', color: 'status.rejected' },

};

export function StatusBadge({ status }: StatusBadgeProps) {
  const key = (status || '').toString().toUpperCase();
  const config = STATUS_CONFIG[key] || { label: key || 'Unknown', color: 'status.default' };

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
