import { ReactNode } from 'react';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <Flex direction="column" minH="100vh" bg="brand.light">
      {/* header */}
      <Box
        as="header"
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        py={3}
      >
        <HStack maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} spacing={4}>
          <Box w="32px" h="32px" borderRadius="full" bg="brand.primary" />
          <Text fontWeight="bold" color="brand.dark">
            Food Trace
          </Text>
        </HStack>
      </Box>

      {/* content */}
      <Box as="main" flex="1" py={6}>
        <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
