// src/pages/retailer/dashboard.tsx
// Story 5.4: Retailer Dashboard Stub
// RETAILER role only - placeholder for Epic 7 features

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

  if (session.user.role !== 'RETAILER') {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }

  return {
    props: {
      userName: session.user.name || session.user.email,
    },
  };
}

interface RetailerDashboardProps {
  userName: string;
}

export default function RetailerDashboard({ userName }: RetailerDashboardProps) {
  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Heading color="brand.primary">Retailer Dashboard</Heading>
        <Text color="brand.muted">Welcome, {userName}</Text>

        <Text color="brand.muted" fontSize="sm">
          Product management coming in Epic 7
        </Text>
      </VStack>
    </Layout>
  );
}
