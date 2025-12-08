// src/pages/consumer/home.tsx
// Story 7.5: Consumer Trace Entry Page
// Allows consumers to scan QR codes or enter product IDs to view trace history
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Text } from '@chakra-ui/react';
import { ConsumerLayout } from '@/components/layout/ConsumerLayout';
import { QRScanner } from '@/components/scanner/QRScanner';
import { SearchBarWithScan } from '@/components/scanner/SearchBarWithScan';

export default function TraceEntryPage() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleSearch = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    router.push(`/trace/${trimmed}`);
  };

  const handleScanClick = () => {
    setShowScanner(true);   // ✅ open scanner on button click
  };

  const handleScanSuccess = (productId: string) => {
    setShowScanner(false);  // ✅ close scanner after successful scan
    router.push(`/trace/${productId}`); // ✅ navigate to trace page with scanned product ID
  };

  return (
    <ConsumerLayout>
      <Box mb={6} textAlign="center">
        <Text fontSize="sm" color="brand.muted">
          Scan the QR code on the package or search by product ID
        </Text>
      </Box>

      <SearchBarWithScan
        value={value}
        onChange={setValue}
        onSearch={handleSearch}
        onScanClick={handleScanClick}
      />

      {showScanner && (
  <Box mt={4}>
    <Box textAlign="right" mb={2}>
      <Text
        fontSize="sm"
        color="brand.accent"
        cursor="pointer"
        onClick={() => setShowScanner(false)}
      >
        Close scanner
      </Text>
    </Box>

    <QRScanner
      onScan={handleScanSuccess}
      onError={(err) => console.error(err)}
    />
  </Box>
)}
    </ConsumerLayout>
  );
}
