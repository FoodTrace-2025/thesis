import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Divider,
  useBreakpointValue,
} from "@chakra-ui/react";
import Head from "next/head";

function RoleCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      borderWidth="1px"
      borderColor="gray.200"
      boxShadow="sm"
      p={8}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      gap={4}
    >
      {/* 顶部绿色方块，可以以后换成图标 */}
      <Box
        w="56px"
        h="56px"
        borderRadius="md"
        bg="brand.primary"
      />

      <Box>
        <Text fontWeight="semibold" color="gray.800" mb={1}>
          {title}
        </Text>
        <Text fontSize="sm" color="gray.600">
          {description}
        </Text>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <Head>
        <title>FoodChain Login</title>
      </Head>

      <Flex
        minH="100vh"
        bg="#FFF6DA" // 整体淡黄色背景，和 Figma 类似
        align="center"
        justify="center"
        px={{ base: 4, md: 8 }}
        py={{ base: 8, md: 12 }}
      >
        <Flex
          w="100%"
          maxW="1120px"
          bg="transparent"
          gap={{ base: 8, md: 12 }}
          direction={{ base: "column", md: "row" }}
        >
          {/* 左侧角色卡片区域 */}
          <Box
            flex="1"
            bg="#E9F6E2" // 淡绿色背景块
            borderRadius="xl"
            p={{ base: 6, md: 10 }}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <RoleCard
                title="Producer"
                description="Create batch and QR code"
              />
              <RoleCard
                title="Transporter"
                description="Upload transport and data"
              />
              <RoleCard
                title="Retailer"
                description="Manage inventory and sales"
              />
              <RoleCard
                title="Consumer"
                description="Verify food origin and safety"
              />
            </SimpleGrid>
          </Box>

          {/* 右侧登录表单区域 */}
          <Box
            flex="1"
            bg="white"
            borderRadius="xl"
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
                  FoodChain
                </Heading>
                <Text fontWeight="semibold" color="brand.primary">
                  Welcome Back!
                </Text>
              </Box>

              <VStack align="stretch" spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" color="gray.700">
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    bg="#FFFDFB"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: "brand.primary",
                      boxShadow: "0 0 0 1px",
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" color="gray.700">
                    Password
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    bg="#FFFDFB"
                    borderColor="gray.200"
                    _focus={{
                      borderColor: "brand.primary",
                      boxShadow: "0 0 0 1px",
                    }}
                  />
                </FormControl>

                <HStack justify="space-between" fontSize="sm">
                  <Checkbox colorScheme="green">
                    Remember me
                  </Checkbox>
                  <Link color="#EA580C" fontWeight="medium">
                    Forgot password?
                  </Link>
                </HStack>

                <Button
                  mt={2}
                  color="white"
                  bg="#2F7D32" // 主绿色按钮
                  _hover={{ bg: "#27672A" }}
                  size="md"
                  w="100%"
                >
                  Login
                </Button>

                {/* Google 登录按钮 */}
                <Button
                  variant="outline"
                  borderColor="gray.200"
                  bg="#F5F7FB"
                  _hover={{ bg: "#E9EDF7" }}
                  size="md"
                  w="100%"
                >
                  {/* 这里可以以后换成真正的 Google 图标 */}
                  <Text>Sign in with Google</Text>
                </Button>
              </VStack>

              <Divider />

              <Box textAlign="center" fontSize="sm">
                <Text as="span" color="gray.700" mr={1}>
                  Don&apos;t have an account?
                </Text>
                <Link color="#EA580C" fontWeight="semibold">
                  Sign up
                </Link>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
