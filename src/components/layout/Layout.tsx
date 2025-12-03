import { ReactNode } from 'react';
import { Box, Button, Flex, HStack, Spacer, Text } from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import NextLink from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();

  return (
    <Flex direction="column" minH="100vh" bg="brand.pageBg">
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

          <Spacer />

          {session ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              {session.user.name || session.user.email} • Logout
            </Button>
          ) : (
            <Button as={NextLink} href="/login" variant="ghost" size="sm">
              Login
            </Button>
          )}
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
