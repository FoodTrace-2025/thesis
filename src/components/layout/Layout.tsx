import { ReactNode } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useSession, signOut } from 'next-auth/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

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

const navByRole: Record<string, { label: string; href: string }[]> = {
  PRODUCER: [
    { label: 'Dash Board', href: '/producer/dashboard' },
    { label: 'Register Product', href: '/producer/register' },
    { label: 'My Products', href: '/producer/products' },
  ],
  DISTRIBUTOR: [
    { label: 'Dash Board', href: '/distributor/dashboard' },
    { label: 'Receive Product', href: '/distributor/receive' },
    { label: 'My Products', href: '/distributor/products' },
  ],
  RETAILER: [
    { label: 'Dash Board', href: '/retailer/dashboard' },
    { label: 'Receive Product', href: '/retailer/receive' },
    { label: 'My Products', href: '/retailer/products' },
  ],
};

export function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const links = session?.user?.role ? navByRole[session.user.role] : undefined;

  if (session && links) {
    return (
      <Flex minH="100vh" bg="brand.pageBg">
        <Box
          as="nav"
          w={{ base: '220px', md: '260px' }}
          bg="brand.pageBg"
          borderRight="1px solid"
          borderColor="brand.border"
          py={6}
          px={4}
          display="flex"
          flexDirection="column"
        >
          <Box mb={8}>
            <Heading color="brand.primary">Food Chain</Heading>
            <Text mt={2} fontWeight="semibold" color="brand.dark">
              {getRoleLabel(session.user.role)}
            </Text>
            {session.user.role === 'PRODUCER' && (
              <Text fontSize="sm" color="brand.muted">
                Create batch and QR code
              </Text>
            )}
          </Box>

          <VStack align="stretch" spacing={2} flex="1">
            {links.map((link) => {
              const active = router.pathname.startsWith(link.href);
              return (
                <Button
                  key={link.href}
                  as={NextLink}
                  href={link.href}
                  justifyContent="flex-start"
                  variant="ghost"
                  bg={active ? 'brand.surfaceAlt' : 'transparent'}
                  color={active ? 'brand.primary' : 'brand.dark'}
                  _hover={{ bg: 'brand.surfaceAlt' }}
                >
                  {link.label}
                </Button>
              );
            })}
          </VStack>

          <VStack align="stretch" spacing={2} mt={6}>
            <Text fontSize="sm" color="brand.muted">
              {session.user.name || session.user.email}
            </Text>
            <Button
              variant="ghost"
              justifyContent="flex-start"
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              Logout
            </Button>
          </VStack>
        </Box>

        <Box as="main" flex="1" py={6} px={{ base: 4, md: 8 }}>
          {children}
        </Box>
      </Flex>
    );
  }

  return (
    <Flex direction="column" minH="100vh" bg="brand.pageBg">
      <Box
        as="header"
        bg="brand.surface"
        borderBottom="1px solid"
        borderColor="brand.border"
        py={3}
      >
        <HStack maxW="1280px" mx="auto" px={{ base: 4, md: 8 }} spacing={4}>
          <Box w="32px" h="32px" borderRadius="full" bg="brand.primary" />
          <Heading color="brand.dark">Food Trace</Heading>
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
      <Box as="main" flex="1" py={6}>
        <Box maxW="1280px" mx="auto" px={{ base: 4, md: 8 }}>
          {children}
        </Box>
      </Box>
    </Flex>
  );
}
