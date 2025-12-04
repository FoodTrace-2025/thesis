// src/pages/producer/register.tsx
// Story 5.5: Product Registration Page
// PRODUCER role only - register products on blockchain

import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Heading, VStack } from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { ProductRegistrationForm } from '@/components/producer/ProductRegistrationForm';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  if (session.user.role !== 'PRODUCER') {
    return { redirect: { destination: '/dashboard', permanent: false } };
  }

  return { props: {} };
}

export default function ProductRegistrationPage() {
  return (
    <Layout>
      <VStack spacing={6} align="stretch" maxW="500px" mx="auto">
        <Heading color="brand.primary">Register New Product</Heading>
        <ProductRegistrationForm />
      </VStack>
    </Layout>
  );
}
