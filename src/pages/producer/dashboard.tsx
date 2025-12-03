// src/pages/producer/dashboard.tsx
// Story 5.4: Producer Dashboard Stub
// PRODUCER role only - shows "Register Product" button

import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import NextLink from 'next/link';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  if (session.user.role !== 'PRODUCER') {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }

  return {
    props: {
      userName: session.user.name || session.user.email,
    },
  };
}

interface ProducerDashboardProps {
  userName: string;
}

export default function ProducerDashboard({ userName }: ProducerDashboardProps) {
  return (
    <Layout>
      <VStack spacing={6} align="stretch">
        <Heading color="brand.primary">Producer Dashboard</Heading>
        <Text color="brand.muted">Welcome, {userName}</Text>

        <Box>
          <Button as={NextLink} href="/producer/register" size="lg">
            Register New Product
          </Button>
        </Box>

        <Text color="brand.muted" fontSize="sm">
          Product list coming in Epic 12
        </Text>
      </VStack>
    </Layout>
  );
}
