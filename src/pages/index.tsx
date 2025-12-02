// src/pages/index.tsx - Story 4.1 demo page
import { Box, Heading, Text, Button, VStack, HStack, Input, Card, Checkbox, CardBody, CardHeader } from "@chakra-ui/react";
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
              Secondary (Light Green)
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
            <Box
              flex="1"
              bg="brand.dark"
              color="white"
              p={4}
              borderRadius="md"
            >
              Dark (Text)
            </Box>
            <Box
              flex="1"
              bg="brand.muted"
              color="white"
              p={4}
              borderRadius="md"
            >
              Muted (Secondary Text)
            </Box>
            <Box
              flex="1"
              bg="brand.border"
              color="white"
              p={4}
              borderRadius="md"
            >
              Border (Input/Card Border)
            </Box>
            <Box
              flex="1"
              bg="brand.surface"
              color="black"
              p={4}
              borderRadius="md"
            >
              Surface (White Card)
            </Box>
            <Box
              flex="1"
              bg="brand.surfaceAlt"
              color="white"
              p={4}
              borderRadius="md"
            >
              Surface Alt (Light Green Background)
            </Box>
          </HStack>
        </Box>


        {/* Input display */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            Input (green focus border):
          </Text>
          <Input placeholder="Click to see green focus border" />
        </Box>

        {/* Card display */}
        <Box>
          <Text fontWeight="bold" mb={2}>
            Card Component:
          </Text>
          <Card>
            <CardHeader>
              <Heading size="md">Product Card</Heading>
            </CardHeader>
            <CardBody>
              <Text>This card has borderRadius and boxShadow from theme.</Text>
            </CardBody>
          </Card>
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

