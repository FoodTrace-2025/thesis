import Head from 'next/head';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function Home() {
  return (
    <>
      <Head>
        <title>Food Chain Producer Dashboard</title>
      </Head>

      <Layout>
        <Box mb={8}>
          <Heading size="lg" mb={2} color="brand.dark">
            Producer Dashboard (Layout Demo)
          </Heading>
          <Text color="gray.600">
            This is a demo of the producer dashboard layout using the custom
            Chakra UI theme.
          </Text>
        </Box>

        <Box mb={8}>
          <Text mb={2} fontWeight="medium">
            Loading state example:
          </Text>
          <LoadingSpinner text="Fetching batch data..." />
        </Box>

        <Box>
          <Text mb={2} fontWeight="medium">
            Primary action button example:
          </Text>
          <Button colorScheme="green">Create New Batch</Button>
        </Box>
      </Layout>
    </>
  );
}
