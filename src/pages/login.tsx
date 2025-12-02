import Head from "next/head";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { ErrorBoundary } from "@/components/ui";

export default function LoginPage() {
  return (
    <ErrorBoundary>
      <LoginContent />
    </ErrorBoundary>
  );
}

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <>
      <Head>
        <title>FoodTrace Login</title>
      </Head>

      <Box
        bg="brand.pageBg"
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={4}
      >
        <Box
          bg="brand.surface"
          borderRadius="xl"
          boxShadow="lg"
          w="100%"
          maxW="400px"
          p={{ base: 6, md: 8 }}
        >
          <VStack align="stretch" spacing={6}>
            <Box textAlign="center">
              <Heading
                as="h1"
                fontSize="2xl"
                mb={1}
                color="brand.primary"
              >
                FoodTrace
              </Heading>
              <Text fontWeight="semibold" color="brand.primary">
                Welcome Back!
              </Text>
            </Box>

            <Box as="form" onSubmit={handleSubmit}>
              <VStack align="stretch" spacing={4}>
                <FormControl isInvalid={!!error}>
                  <FormLabel fontSize="sm" color="brand.dark">
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <FormControl isInvalid={!!error}>
                  <FormLabel fontSize="sm" color="brand.dark">
                    Password
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>

                <HStack justify="space-between" fontSize="sm">
                  <Checkbox>Remember me</Checkbox>
                  <Link href="#" color="brand.accent" fontWeight="medium">
                    Forgot password?
                  </Link>
                </HStack>

                {error && (
                  <Text color="red.500" fontSize="sm" textAlign="center">
                    {error}
                  </Text>
                )}

                <Button
                  type="submit"
                  mt={2}
                  w="100%"
                  size="md"
                  isLoading={isLoading}
                  loadingText="Logging in..."
                >
                  Login
                </Button>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Box>
    </>
  );
}
