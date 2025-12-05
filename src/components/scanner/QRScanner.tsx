// src/components/scanner/QRScanner.tsx
// Story 7.10: QR Scanner Component
// Scans QR codes to extract product blockchainId for lookup

import { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import {
  Box,
  Text,
  Button,
  Center,
  VStack,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

interface QRScannerProps {
  onScan: (productId: string) => void;
  onError?: (error: string) => void;
}

type ScannerState = 'initializing' | 'scanning' | 'permission_denied' | 'no_camera' | 'error';

export function QRScanner({ onScan, onError }: QRScannerProps) {
  const [state, setState] = useState<ScannerState>('initializing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isRunningRef = useRef(false); // Track if scanner is actually running
  const onScanRef = useRef(onScan);
  const onErrorRef = useRef(onError);
  const elementId = 'qr-reader';

  // Keep refs updated with latest callbacks (avoids useEffect restarts)
  useEffect(() => {
    onScanRef.current = onScan;
    onErrorRef.current = onError;
  }, [onScan, onError]);

  // Extract blockchainId from QR code URL
  const extractProductId = useCallback((decodedText: string): string | null => {
    // Expected format: http://localhost:3000/trace/42 or https://foodtrace.app/trace/42
    const match = decodedText.match(/\/trace\/(\d+)/);
    const productId = match ? match[1] : decodedText;

    // Validate: must be numeric (security: prevent injection)
    if (!/^\d+$/.test(productId)) {
      return null;
    }

    return productId;
  }, []);

  // Initialize and start scanner
  useEffect(() => {
    const scanner = new Html5Qrcode(elementId);
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        await scanner.start(
          { facingMode: 'environment' }, // Back camera on mobile
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Extract and validate product ID
            const productId = extractProductId(decodedText);

            if (!productId) {
              onErrorRef.current?.('Invalid QR code format. Expected product QR code.');
              return;
            }

            // Stop scanner before callback
            isRunningRef.current = false;
            scanner.stop().catch(() => {});
            setState('initializing'); // Reset state
            onScanRef.current(productId);
          },
          () => {} // Ignore scan errors (continuous scanning)
        );
        isRunningRef.current = true;
        setState('scanning');
      } catch (err: unknown) {
        const error = err as Error & { name?: string };
        if (error.name === 'NotAllowedError') {
          setState('permission_denied');
        } else if (error.name === 'NotFoundError') {
          setState('no_camera');
        } else {
          setState('error');
          setErrorMessage(error.message || 'Failed to start camera');
          onErrorRef.current?.(error.message || 'Failed to start camera');
        }
      }
    };

    startScanner();

    // Cleanup on unmount
    return () => {
      if (scannerRef.current && isRunningRef.current) {
        isRunningRef.current = false;
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, [extractProductId]);

  // Handle retry
  const handleRetry = () => {
    window.location.reload();
  };

  // Permission denied state
  if (state === 'permission_denied') {
    return (
      <Center p={8}>
        <VStack spacing={4}>
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            Camera permission denied
          </Alert>
          <Text textAlign="center" color="brand.muted" fontSize="sm">
            Please allow camera access in your browser settings to scan QR codes.
          </Text>
          <Button onClick={handleRetry} size="sm">
            Try Again
          </Button>
        </VStack>
      </Center>
    );
  }

  // No camera state
  if (state === 'no_camera') {
    return (
      <Center p={8}>
        <VStack spacing={4}>
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            No camera found
          </Alert>
          <Text textAlign="center" color="brand.muted" fontSize="sm">
            No camera detected on this device. Please use manual product ID entry.
          </Text>
        </VStack>
      </Center>
    );
  }

  // Error state
  if (state === 'error') {
    return (
      <Center p={8}>
        <VStack spacing={4}>
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            Camera error
          </Alert>
          <Text textAlign="center" color="brand.muted" fontSize="sm">
            {errorMessage || 'Failed to access camera. Please try again.'}
          </Text>
          <Button onClick={handleRetry} size="sm">
            Try Again
          </Button>
        </VStack>
      </Center>
    );
  }

  // Scanning state (or initializing)
  return (
    <Box>
      <Box
        id={elementId}
        width="100%"
        minH="300px"
        bg="gray.100"
        borderRadius="md"
      />
      {state === 'initializing' && (
        <Text textAlign="center" mt={4} color="brand.muted" fontSize="sm">
          Initializing camera...
        </Text>
      )}
      {state === 'scanning' && (
        <Text textAlign="center" mt={4} color="brand.muted" fontSize="sm">
          Point camera at product QR code
        </Text>
      )}
    </Box>
  );
}
