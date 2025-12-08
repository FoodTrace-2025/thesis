// src/components/layout/ConsumerLayout.tsx

import { ReactNode } from 'react';
import { Box, Flex, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';

interface ConsumerLayoutProps {
  children: ReactNode;
}

export function ConsumerLayout({ children }: ConsumerLayoutProps) {
  return (
    <Flex direction="column" minH="100vh" bg="brand.pageBg">
      {/* Header */}
      <Box as="header" py={4}>
        <VStack spacing={1}>
          {/* Simple logo placeholder */}
          <Box
            as={NextLink}
            href="/trace"
            w="40px"
            h="40px"
            borderRadius="full"
            bg="brand.primary"
          />
          <Text fontWeight="bold" color="brand.dark">
            FoodTrace
          </Text>
          <Text fontSize="xs" color="brand.muted">
            Verify where your food comes from
          </Text>
        </VStack>
      </Box>

      {/* Content */}
      <Box as="main" flex="1" py={6}>
        <Box maxW="640px" mx="auto" px={{ base: 4, md: 6 }}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
