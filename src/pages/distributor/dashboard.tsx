// src/pages/distributor/dashboard.tsx
// Story 5.4: Distributor Dashboard Stub
// DISTRIBUTOR role only - placeholder for Epic 6 features

import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Heading, Text, VStack } from '@chakra-ui/react';
import { Layout } from '@/components/layout';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  if (session.user.role !== 'DISTRIBUTOR') {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }

  return {
    props: {
      userName: session.user.name || session.user.email,
    },
  };
}

interface DistributorDashboardProps {
  userName: string;
}

export default function DistributorDashboard({ userName }: DistributorDashboardProps) {
  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Heading color="brand.primary">Distributor Dashboard</Heading>
        <Text color="brand.muted">Welcome, {userName}</Text>

        <Text color="brand.muted" fontSize="sm">
          Receive products feature coming in Epic 6
        </Text>
      </VStack>
    </Layout>
  );
}
