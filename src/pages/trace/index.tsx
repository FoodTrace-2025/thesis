// src/pages/consumer/home.tsx
// Story 7.5: Consumer Trace Entry Page
// Allows consumers to scan QR codes or enter product IDs to view trace history
// src/pages/trace/index.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  VStack,
} from "@chakra-ui/react";
import { ConsumerLayout } from "@/components/layout/ConsumerLayout";
import { QRScanner } from "@/components/scanner/QRScanner";
import { SearchBarWithScan } from "@/components/scanner/SearchBarWithScan";

export default function TraceEntryPage() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const trimmed = value.trim();

    if (!trimmed) {
      setError("Enter a product ID to continue.");
      return;
    }

    try {
      const res = await fetch(`/api/products/${trimmed}`);
      if (!res.ok) {
        setError("Product not found. Check the ID on the package.");
        return;
      }

      setError("");
      router.push(`/trace/${trimmed}`);
    } catch {
      setError("Network issue. Please try again.");
    }
  };

  const handleScanClick = () => {
    setShowScanner(true); // open scanner modal
  };

  const handleScanSuccess = (productId: string) => {
    setShowScanner(false); // close modal after successful scan
    setError("");
    router.push(`/trace/${productId}`);
  };

  const handleScanError = (err: unknown) => {
    const message =
      typeof err === "string"
        ? err
        : err instanceof Error
        ? err.message
        : "Camera access denied. Please use manual entry.";
    setError(message);
    setShowScanner(false); // optional: close modal on error
  };

  return (
    <ConsumerLayout>
      <Box mb={6} textAlign="center">
        <Text fontSize="sm" color="brand.muted">
          Scan the QR code on the package or search by product ID
        </Text>
      </Box>

      <VStack align="stretch" spacing={2}>
        <SearchBarWithScan
          value={value}
          onChange={(val) => {
            setValue(val);
            if (error) setError("");
          }}
          onSearch={handleSearch}
          onScanClick={handleScanClick}
        />

        {error ? (
          <Text fontSize="sm" color="brand.error">
            {error}
          </Text>
        ) : (
          <Text fontSize="sm" color="brand.muted">
            Tip: Product ID is printed under the QR code.
          </Text>
        )}
      </VStack>

      <Modal isOpen={showScanner} onClose={() => setShowScanner(false)} isCentered>
        <ModalOverlay />
        <ModalContent maxW="480px" mx={4} p={2}>
          <ModalCloseButton />
          <ModalBody pb={4}>
            <QRScanner 
              onScan={handleScanSuccess} 
              onError={handleScanError}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </ConsumerLayout>
  );
}

