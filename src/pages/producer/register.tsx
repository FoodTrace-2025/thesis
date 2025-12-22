// src/pages/producer/register.tsx
// Story 5.5: Product Registration Page
// PRODUCER role only - register products on blockchain

import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Flex, VStack, Button, Text } from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { ProductRegistrationForm } from '@/components/producer/ProductRegistrationForm';
import { useRouter } from "next/router";
import { ArrowBackIcon } from "@chakra-ui/icons";

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
    const router = useRouter();
  return (
    <Layout>
      <VStack spacing={6} align="stretch" maxW="1200px" mx="auto" py={4}>
        <Flex
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={3}
          wrap="wrap"
        >
          <Text fontSize="xl" fontWeight="semibold" color="brand.dark">
            My Batches
          </Text>
          <Button
            type="button"
            onClick={() => router.back()} 
            leftIcon={<ArrowBackIcon />}
            width={{ base: "100%", sm: "auto" }}
          >
            Back
          </Button>
        </Flex>
        <ProductRegistrationForm />
      </VStack>
    </Layout>
  );
}
