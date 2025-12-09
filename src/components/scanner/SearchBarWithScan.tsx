import {
  Input,
  HStack,
  IconButton,
  Button,
} from '@chakra-ui/react';
import { FiCamera } from 'react-icons/fi';

interface SearchBarWithScanProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onScanClick: () => void;
}

export function SearchBarWithScan({
  value,
  onChange,
  onSearch,
  onScanClick,
}: SearchBarWithScanProps) {
  return (
    <HStack
      spacing={2}
      bg="white"
      borderRadius="full"
      px={2}
      py={2}
      boxShadow="sm"
      borderWidth="1px"
      borderColor="brand.border"
    >
      {/* Scan icon */}
      <IconButton
        aria-label="Scan QR code"
        icon={<FiCamera />}
        variant="ghost"
        onClick={onScanClick}
        borderRadius="full"
      />

      {/* Input */}
      <Input
        placeholder="Enter product ID"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        border="none"
        _focus={{ boxShadow: 'none' }}
      />

      {/* Search button */}
      <Button
        colorScheme="red"
        borderRadius="full"
        onClick={onSearch}
      >
        Search
      </Button>
    </HStack>
  );
}
