
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
import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { ErrorBoundary, LoadingSpinner } from "@/components/ui";


// 左侧四个角色卡片
type RoleCardProps = {
  title: string;
  description: string;
  value: string;
  selectedValue: string | null;
  onSelect: (value: string) => void;
};

type RoleValue = "producer" | "distributor" | "retailer" | "consumer";

function RoleCard(props: {
  title: string;
  description: string;
  value: RoleValue;                // 这个卡片代表哪个角色
  selectedRole: RoleValue;         // 当前选中的角色
  onSelect: (value: RoleValue) => void;
}) {
  const { title, description, value, selectedRole, onSelect } = props;

  const isSelected = selectedRole === value;

  return (
    <Box
      bg={isSelected ? "brand.secondary" : "brand.surface"}   // 选中变浅绿，不选白
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
      {/* 顶部方块：选中时变白 */}
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
  const [isLoadingPage, setIsLoadingPage] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoadingPage(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (isLoadingPage) return <LoadingSpinner text="Loading..." />;
  
  return (
    <ErrorBoundary>
      <LoginContent />
    </ErrorBoundary>
  );
}

function LoginContent() {
  // 选择的角色
  const [selectedRole, setSelectedRole] = useState<RoleValue>("producer");
  // 表单状态
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // 错误 & 加载状态
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // 登录提交逻辑
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
      // 登录成功后的跳转
      router.push("/dashboard");
    }
  };

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
                value="producer"
                selectedRole={selectedRole}
                onSelect={setSelectedRole}
              />
              <RoleCard
                title="Distributor" // Story 里要求用 Distributor
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

                  {/* Login 按钮：深绿 */}
                  <Button
                    mt={2}
                    w="100%"
                    size="md"
                    isLoading={isLoading}
                    loadingText="Logging in..."
                  >
                    Login
                  </Button>

                  {/* Google 登录按钮：淡灰背景 + 边框 */}
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

              {/* 底部 Sign up 链接
              <Box textAlign="center" fontSize="sm">
                <Text as="span" color="brand.dark" mr={1}>
                  Don&apos;t have an account?
                </Text>
                <Link color="brand.accent" fontWeight="semibold">
                  Sign up
                </Link>
              </Box> */}
            </VStack>
          </Box>
        </Box>
      </Box>
    </>
  );
}
