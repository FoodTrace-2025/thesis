// src/pages/dashboard.tsx
// Story 5.4: Role-based router
// Redirects authenticated users to their role-specific dashboard

import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { Layout } from '@/components/layout';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Not authenticated → login
  if (!session) {
    return {
      redirect: { destination: '/login', permanent: false },
    };
  }

  // Role-based redirects
  const redirectMap: Record<string, string> = {
    PRODUCER: '/producer/dashboard',
    DISTRIBUTOR: '/distributor/dashboard',
    RETAILER: '/retailer/dashboard',
    PLATFORM_ADMIN: '/admin',
    COMPANY_ADMIN: '/dashboard', // COMPANY_ADMIN stays on /dashboard for now (no dedicated page)
  };

  const destination = redirectMap[session.user.role] || '/login';

  // Prevent infinite redirect for COMPANY_ADMIN
  if (session.user.role === 'COMPANY_ADMIN') {
    // COMPANY_ADMIN doesn't have a dedicated dashboard yet, show stub
    return {
      props: {
        userName: session.user.name || session.user.email,
        userRole: session.user.role,
      },
    };
  }

  return {
    redirect: { destination, permanent: false },
  };
}

// This component only renders for COMPANY_ADMIN (no dedicated dashboard yet)
// All other roles are redirected via getServerSideProps

interface DashboardProps {
  userName: string;
  userRole: string;
}

export default function DashboardRouter({ userName, userRole }: DashboardProps) {
  // Only COMPANY_ADMIN reaches here (others redirected)
  return (
    <Layout>
      <Box textAlign="center" py={20}>
        <VStack spacing={4}>
          <Heading color="brand.primary">Welcome, {userName}!</Heading>
          <Text color="brand.muted" fontSize="lg">
            Role: {userRole}
          </Text>
          <Text color="brand.dark" mt={4}>
            Company Admin dashboard coming soon
          </Text>
        </VStack>
      </Box>
    </Layout>
  );
}
