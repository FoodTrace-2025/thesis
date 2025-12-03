import { ReactNode } from 'react';
import { Box, Button, Flex, HStack, Spacer, Text } from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import NextLink from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

function getRoleLabel(role: string): string {
  const roleLabels: Record<string, string> = {
    PLATFORM_ADMIN: 'Platform Admin',
    COMPANY_ADMIN: 'Company Admin',
    PRODUCER: 'Producer',
    DISTRIBUTOR: 'Distributor',
    RETAILER: 'Retailer',
  };
  return roleLabels[role] || role;
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
            <HStack spacing={3}>
              <Text fontSize="sm" color="brand.muted">
                {getRoleLabel(session.user.role)}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/login' })}
              >
                Logout
              </Button>
            </HStack>
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
