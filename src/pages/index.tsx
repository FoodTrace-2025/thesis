// src/pages/index.tsx - Story 4.3: Public Landing Page
// Hero section with dual CTAs + How It Works section
import Head from "next/head";
import NextLink from "next/link";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaSeedling, FaTruck, FaQrcode } from "react-icons/fa";

export default function LandingPage() {
  return (
    <>
      <Head>
        <title>FoodTrace - Know Where Your Food Comes From</title>
        <meta
          name="description"
          content="Blockchain-verified food traceability from producer to your table. Track any product with a simple QR scan."
        />
      </Head>

      <Box bg="brand.pageBg" minH="100vh">
        {/* Minimal Header */}
        <Flex
          as="header"
          justify="space-between"
          align="center"
          px={{ base: 4, md: 8 }}
          py={4}
        >
          <Heading size="md" color="brand.primary">
            FoodTrace
          </Heading>
          <Link
            as={NextLink}
            href="/login"
            color="brand.primary"
            fontWeight="medium"
            _hover={{ textDecoration: "underline" }}
          >
            Login
          </Link>
        </Flex>

        {/* Hero Section */}
        <Container maxW="container.lg" py={{ base: 12, md: 20 }}>
          <VStack spacing={6} textAlign="center">
            <Heading
              as="h1"
              size={{ base: "xl", md: "2xl" }}
              color="brand.dark"
              lineHeight="shorter"
            >
              Know Where Your Food Comes From
            </Heading>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              color="brand.muted"
              maxW="600px"
            >
              Blockchain-verified traceability from producer to your table
            </Text>
            <HStack
              spacing={4}
              pt={4}
              flexDirection={{ base: "column", sm: "row" }}
              w={{ base: "100%", sm: "auto" }}
            >
              <Button
                as={NextLink}
                href="/trace"
                size="lg"
                w={{ base: "100%", sm: "auto" }}
                minH="44px"
              >
                Track a Product
              </Button>
              <Button
                as={NextLink}
                href="/login"
                variant="outline"
                size="lg"
                w={{ base: "100%", sm: "auto" }}
                minH="44px"
              >
                Business Login
              </Button>
            </HStack>
          </VStack>
        </Container>

        {/* How It Works Section */}
        <Box bg="brand.surface" py={{ base: 12, md: 16 }}>
          <Container maxW="container.lg">
            <Heading
              size="lg"
              textAlign="center"
              mb={10}
              color="brand.dark"
            >
              How It Works
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              {/* Step 1: Register */}
              <VStack spacing={4} textAlign="center">
                <Icon as={FaSeedling} boxSize={12} color="brand.primary" />
                <Text fontWeight="bold" color="brand.dark" fontSize="lg">
                  1. Register
                </Text>
                <Text color="brand.muted" fontSize="sm">
                  Producers register products on the blockchain
                </Text>
              </VStack>

              {/* Step 2: Track */}
              <VStack spacing={4} textAlign="center">
                <Icon as={FaTruck} boxSize={12} color="brand.primary" />
                <Text fontWeight="bold" color="brand.dark" fontSize="lg">
                  2. Track
                </Text>
                <Text color="brand.muted" fontSize="sm">
                  Every handoff recorded through the supply chain
                </Text>
              </VStack>

              {/* Step 3: Verify */}
              <VStack spacing={4} textAlign="center">
                <Icon as={FaQrcode} boxSize={12} color="brand.primary" />
                <Text fontWeight="bold" color="brand.dark" fontSize="lg">
                  3. Verify
                </Text>
                <Text color="brand.muted" fontSize="sm">
                  Consumers scan QR code to see the full journey
                </Text>
              </VStack>
            </SimpleGrid>
          </Container>
        </Box>

        {/* Footer */}
        <Box py={6} textAlign="center">
          <Text fontSize="sm" color="brand.muted">
            FoodTrace - Bachelor&apos;s Thesis Project (OAMK 2025)
          </Text>
        </Box>
      </Box>
    </>
  );
}
