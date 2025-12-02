// src/pages/dashboard.tsx
// Story 2.8 Task 0: Stub dashboard page
// Full implementation in Epic 12

import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Box, Heading, Text, VStack } from '@chakra-ui/react';
import { Layout } from '@/components/layout';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Redirect PLATFORM_ADMIN to /admin
  if (session.user.role === 'PLATFORM_ADMIN') {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }

  // Business users see stub dashboard
  return {
    props: {
      userName: session.user.name || session.user.email,
      userRole: session.user.role,
    },
  };
}

interface DashboardProps {
  userName: string;
  userRole: string;
}

export default function Dashboard({ userName, userRole }: DashboardProps) {
  return (
    <Layout>
      <Box textAlign="center" py={20}>
        <VStack spacing={4}>
          <Heading color="brand.primary">Welcome, {userName}!</Heading>
          <Text color="brand.muted" fontSize="lg">
            Role: {userRole}
          </Text>
          <Text color="brand.dark" mt={4}>
            Dashboard coming soon in Epic 12
          </Text>
        </VStack>
      </Box>
    </Layout>
  );
}
