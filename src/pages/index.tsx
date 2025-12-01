// src/pages/index.tsx - Story 4.1 demo page
import { Box, Heading, Text, Button, VStack, HStack } from "@chakra-ui/react";
import { Layout } from "@/components/layout";
import { LoadingSpinner } from "@/components/ui";

export default function DemoPage() {
  return (
    <Layout>
      <VStack spacing={8} align="stretch">
        <Heading>FoodTrace Component Demo</Heading>

        {/* Theme Colors Display */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            Theme Colors:
          </Text>
          <HStack spacing={4} align="stretch">
            <Box
              flex="1"
              bg="brand.primary"
              color="white"
              p={4}
              borderRadius="md"
            >
              Primary (Green)
            </Box>
            <Box
              flex="1"
              bg="brand.secondary"
              color="white"
              p={4}
              borderRadius="md"
            >
              Secondary (Blue)
            </Box>
            <Box
              flex="1"
              bg="brand.accent"
              color="white"
              p={4}
              borderRadius="md"
            >
              Accent (Orange)
            </Box>
          </HStack>
        </Box>

        {/* LoadingSpinner display */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            Loading Spinner:
          </Text>
          <LoadingSpinner text="Loading data..." />
        </Box>

        {/* button display */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            Buttons:
          </Text>
          <HStack spacing={4}>
            <Button>Primary Button</Button>
            <Button variant="outline">Outline Button</Button>
          </HStack>
        </Box>
      </VStack>
    </Layout>
  );
}
