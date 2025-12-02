
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
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState, FormEvent } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { ErrorBoundary } from "@/components/ui";
type RoleValue = "producer" | "distributor" | "retailer" | "consumer";

function RoleCard(props: {
  title: string;
  description: string;
  value: RoleValue;
  selectedRole: RoleValue;
  onSelect: (value: RoleValue) => void;
}) {
  const { title, description, value, selectedRole, onSelect } = props;

  const isSelected = selectedRole === value;

  return (
    <Box
      bg={isSelected ? "brand.secondary" : "brand.surface"}
      borderRadius="xl"
      borderWidth="1px"
      borderColor={isSelected ? "brand.secondary" : "brand.surfaceAlt"}
      boxShadow={isSelected ? "md" : "sm"}
      p={8}
      display="flex"
      flexDirection="column"
      alignItems="center"
      textAlign="center"
      gap={4}
      cursor="pointer"
      transition="all 0.15s ease-out"
      onClick={() => onSelect(value)}
    >
      <Box
        w="56px"
        h="56px"
        borderRadius="md"
        bg={isSelected ? "brand.surface" : "brand.secondary"}
      />

      <Box>
        <Text
          fontWeight="semibold"
          color={isSelected ? "brand.surface" : "brand.dark"}
          mb={1}
        >
          {title}
        </Text>
        <Text
          fontSize="sm"
          color={isSelected ? "brand.surface" : "brand.muted"}
        >
          {description}
        </Text>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <ErrorBoundary>
      <LoginContent />
    </ErrorBoundary>
  );
}

function LoginContent() {
  const [selectedRole, setSelectedRole] = useState<RoleValue>("producer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

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
          borderRadius="xl"
          overflow="hidden"
          boxShadow="md"
          w="100%"
          maxW="1120px"
          display="flex"
          flexDir={{ base: "column", md: "row" }}
        >

          {/* Role cards section */}
          <Box
            flex="1"
            bg="brand.surfaceAlt"
            p={{ base: 6, md: 10 }}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <RoleCard
                title="Producer"
                description="Create batch and QR code"
                value="producer"
                selectedRole={selectedRole}
                onSelect={setSelectedRole}
              />
              <RoleCard
                title="Distributor"
                description="Upload transport and data"
                value="distributor"
                selectedRole={selectedRole}
                onSelect={setSelectedRole}
              />
              <RoleCard
                title="Retailer"
                description="Manage inventory and sales"
                value="retailer"
                selectedRole={selectedRole}
                onSelect={setSelectedRole}
              />
              <RoleCard
                title="Consumer"
                description="Verify food origin and safety"
                value="consumer"
                selectedRole={selectedRole}
                onSelect={setSelectedRole}
              />
            </SimpleGrid>
          </Box>

          {/* Login form section */}
          <Box
            flex="1"
            bg="brand.surface"
            boxShadow="sm"
            p={{ base: 6, md: 10 }}
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
                  <FormControl>
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

                  <FormControl>
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
                    <Link color="brand.accent" fontWeight="medium">
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

                  <Button
                    w="100%"
                    size="md"
                    variant="outline"
                    isDisabled={isLoading}
                  >
                    Sign in with Google
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Box>
    </>
  );
}
