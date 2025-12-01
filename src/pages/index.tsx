// // src/pages/index.tsx - Story 4.1 demo page
// import { Box, Heading, Text, Button, VStack, HStack, Input, Card, CardBody, CardHeader } from "@chakra-ui/react";
// import { Layout } from "@/components/layout";
// import { LoadingSpinner } from "@/components/ui";

// export default function DemoPage() {
//   return (
//     <Layout>
//       <VStack spacing={8} align="stretch">
//         <Heading>FoodTrace Component Demo</Heading>

//         {/* Theme Colors Display */}
//         <Box>
//           <Text fontWeight="bold" mb={2}>
//             Theme Colors:
//           </Text>
//           <HStack spacing={4} align="stretch">
//             <Box
//               flex="1"
//               bg="brand.primary"
//               color="white"
//               p={4}
//               borderRadius="md"
//             >
//               Primary (Green)
//             </Box>
//             <Box
//               flex="1"
//               bg="brand.secondary"
//               color="white"
//               p={4}
//               borderRadius="md"
//             >
//               Secondary (Blue)
//             </Box>
//             <Box
//               flex="1"
//               bg="brand.accent"
//               color="white"
//               p={4}
//               borderRadius="md"
//             >
//               Accent (Orange)
//             </Box>
//           </HStack>
//         </Box>

//         {/* Input display */}
//         <Box>
//           <Text fontWeight="bold" mb={2}>
//             Input (green focus border):
//           </Text>
//           <Input placeholder="Click to see green focus border" />
//         </Box>

//         {/* Card display */}
//         <Box>
//           <Text fontWeight="bold" mb={2}>
//             Card Component:
//           </Text>
//           <Card>
//             <CardHeader>
//               <Heading size="md">Product Card</Heading>
//             </CardHeader>
//             <CardBody>
//               <Text>This card has borderRadius and boxShadow from theme.</Text>
//             </CardBody>
//           </Card>
//         </Box>

//         {/* LoadingSpinner display */}
//         <Box>
//           <Text fontWeight="bold" mb={2}>
//             Loading Spinner:
//           </Text>
//           <LoadingSpinner text="Loading data..." />
//         </Box>

//         {/* button display */}
//         <Box>
//           <Text fontWeight="bold" mb={2}>
//             Buttons:
//           </Text>
//           <HStack spacing={4}>
//             <Button>Primary Button</Button>
//             <Button variant="outline">Outline Button</Button>
//           </HStack>
//         </Box>
//       </VStack>
//     </Layout>
//   );
// }

import Head from "next/head";
import {
  Box,
  Button,
  Checkbox,
  Flex,
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

// 左侧四个角色卡片
function RoleCard(props: { title: string; description: string }) {
  const { title, description } = props;

  return (
    <Box
      bg="brand.surface"            // 白色卡片
      borderRadius="xl"
      borderWidth="1px"
      borderColor="brand.surfaceAlt" // 淡绿色边框
      boxShadow="sm"
      p={8}
      display="flex"
      flexDirection="column"
      gap={4}
    >
      {/* 顶部绿色方块（以后可以换真正的图标） */}
      <Box w="56px" h="56px" borderRadius="md" bg="brand.primaryLight" />

      <Box>
        <Text fontWeight="semibold" color="brand.dark" mb={1}>
          {title}
        </Text>
        <Text fontSize="sm" color="brand.muted">
          {description}
        </Text>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>FoodTrace Login</title>
      </Head>

      {/* 整体淡黄背景 */}
      <Box
        bg="brand.pageBg"     // 淡黄背景（FFF6DA）
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        px={4}
      >
         <Box
          borderRadius="xl"
          overflow="hidden"       // 👈 必须，有它左绿区与右白区才不会“漏角”
          boxShadow="md"
          w="100%"
          maxW="1120px"
          display="flex"
          flexDir={{ base: "column", md: "row" }}
        >

          {/* 左侧角色介绍区域：大块淡绿背景 */}
          <Box
            flex="1"
            bg="brand.surfaceAlt"
            p={{ base: 6, md: 10 }}
          >
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              <RoleCard
                title="Producer"
                description="Create batch and QR code"
              />
              <RoleCard
                title="Distributor" // Story 里要求用 Distributor
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

          {/* 右侧登录表单区域：白色卡片 */}
          <Box
            flex="1"
            bg="brand.surface"
            boxShadow="sm"
            p={{ base: 6, md: 10 }}
          >
            <VStack align="stretch" spacing={6}>
              {/* 顶部标题 */}
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

              {/* 表单区域 */}
              <VStack align="stretch" spacing={4}>
                <FormControl>
                  <FormLabel fontSize="sm" color="brand.dark">
                    Email
                  </FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    bg="brand.light"
                    borderColor="brand.border"
                    _focus={{
                      borderColor: "brand.primaryLight",
                      boxShadow:
                        "0 0 0 1px var(--chakra-colors-brand-primaryLight)",
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" color="brand.dark">
                    Password
                  </FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    bg="brand.light"
                    borderColor="brand.border"
                    _focus={{
                      borderColor: "brand.primaryLight",
                      boxShadow:
                        "0 0 0 1px var(--chakra-colors-brand-primaryLight)",
                    }}
                  />
                </FormControl>

                <HStack justify="space-between" fontSize="sm">
                  <Checkbox colorScheme="green">Remember me</Checkbox>
                  <Link color="brand.accent" fontWeight="medium">
                    Forgot password?
                  </Link>
                </HStack>

                {/* Login 按钮：深绿 */}
                <Button
                  mt={2}
                  w="100%"
                  bg="brand.primary"
                  _hover={{ bg: "brand.primaryLight" }}
                  color="white"
                  size="md"
                >
                  Login
                </Button>

                {/* Google 登录按钮：淡灰背景 + 边框 */}
                <Button
                  w="100%"
                  size="md"
                  variant="outline"
                  borderColor="brand.border"
                  bg="brand.light"
                  _hover={{ bg: "brand.surfaceAlt" }}
                >
                  Sign in with Google
                </Button>
              </VStack>

              {/* 底部 Sign up 链接 */}
              <Box textAlign="center" fontSize="sm">
                <Text as="span" color="brand.dark" mr={1}>
                  Don&apos;t have an account?
                </Text>
                <Link color="brand.accent" fontWeight="semibold">
                  Sign up
                </Link>
              </Box>
            </VStack>
          </Box>
        </Box>
      </Box>
    </>
  );
}
