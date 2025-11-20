# Frontend Architecture (React, Next.js, State Management)

**Purpose:** Define frontend structure, routing, state management, and component patterns.

---

## Frontend Technology Stack

**Framework:** Next.js 14.2.15 (Pages Router)
**UI Library:** React 18
**Component Library:** Chakra UI v2
**State Management:** React Context + SWR (data fetching)
**Web3 Integration:** Wagmi v2 + Viem
**Styling:** Chakra UI + CSS Modules

---

## Routing Structure (Pages Router)

**Public Routes:**
- `/` - Homepage (landing page)
- `/consumer/scan` - QR scanner landing
- `/consumer/product/:id` - Product journey (wallet-free)

**Authenticated Routes:**
- `/producer/dashboard` - Product list
- `/producer/register` - Product registration form
- `/producer/product/:id` - Product details, QR download
- `/distributor/dashboard` - Received products
- `/distributor/receive` - QR scanner to receive products
- `/distributor/product/:id` - Product details, add trace
- `/retailer/dashboard` - Stocked products
- `/retailer/product/:id` - Product details, mark sold
- `/admin/iot-simulator` - IoT data generation (admin only)

**Authentication Check:**
```typescript
// pages/_app.tsx
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      {Component.auth ? (
        <Auth>
          <Component {...pageProps} />
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}

// Protect route with auth property
ProductRegistration.auth = { role: 'PRODUCER' };
```

---

## Component Architecture

### Layout Pattern

**Shared Layout Component:**
```typescript
// components/shared/Layout.tsx
import { Box, Container, Flex } from '@chakra-ui/react';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  role?: 'PRODUCER' | 'DISTRIBUTOR' | 'RETAILER' | 'ADMIN';
}

export function Layout({ children, role }: LayoutProps) {
  return (
    <Flex direction="column" minH="100vh">
      <Header role={role} />
      <Flex flex="1">
        {role && <Sidebar role={role} />}
        <Container maxW="container.xl" py={8}>
          {children}
        </Container>
      </Flex>
      <Footer />
    </Flex>
  );
}
```

**Usage in Pages:**
```typescript
// pages/producer/dashboard.tsx
import { Layout } from '@/components/shared/Layout';

export default function ProducerDashboard() {
  return (
    <Layout role="PRODUCER">
      <Heading>My Products</Heading>
      <ProductTable />
    </Layout>
  );
}
```

---

### Component Organization

**Shared Components (All Portals):**
- `Layout.tsx` - Navigation, header, footer
- `LoadingSpinner.tsx` - Blockchain transaction pending states
- `ErrorBoundary.tsx` - Graceful error handling
- `FormInput.tsx` - Chakra UI wrapper with validation
- `Modal.tsx` - Reusable modal component

**Producer Components:**
- `ProductRegistrationForm.tsx` - Multi-step form (basic info, photo upload, certification)
- `QRCodeDisplay.tsx` - Display QR code with download buttons (PNG, SVG)
- `ProductTable.tsx` - Paginated product list with search/filter
- `BlockchainConfirmation.tsx` - Transaction pending/success states

**Distributor Components:**
- `QRScanner.tsx` - html5-qrcode integration, camera permissions
- `TraceRecordForm.tsx` - Action dropdown, location, quality notes
- `ProductTimeline.tsx` - Vertical timeline showing complete journey
- `ReceiveProductModal.tsx` - Scan QR or manual Product ID entry

**Consumer Components:**
- `ConsumerProductView.tsx` - Read-only product journey
- `TemperatureChart.tsx` - Line chart showing sensor data over time
- `BlockchainVerifyButton.tsx` - Link to Etherscan transaction
- `OrganicBadge.tsx` - Display certifications with verify links

**Admin Components:**
- `ScenarioButtons.tsx` - Normal/Warning/Critical scenario selector
- `SensorDataPreview.tsx` - Real-time preview before blockchain submission
- `AutoModeToggle.tsx` - Generate data every N seconds automatically

---

## State Management

### React Context (Global State)

**Auth Context:**
```typescript
// contexts/AuthContext.tsx
import { createContext, useContext } from 'react';
import { useSession } from 'next-auth/react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const { data: session, status } = useSession();

  const value = {
    user: session?.user || null,
    loading: status === 'loading',
    isAuthenticated: !!session,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
```

### SWR (Data Fetching with Caching)

**Product Queries:**
```typescript
// hooks/useProduct.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useProduct(productId: string) {
  const { data, error, mutate } = useSWR(
    `/api/products/${productId}`,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
    }
  );

  return {
    product: data?.product,
    loading: !data && !error,
    error,
    refresh: mutate,
  };
}

// Usage in component
function ProductDetails({ productId }) {
  const { product, loading, error } = useProduct(productId);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <ProductCard product={product} />;
}
```

---

## Form Management (React Hook Form + Zod)

**Product Registration Form:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(3).max(100),
  origin: z.string().min(2).max(50),
  harvestDate: z.date().max(new Date(), 'Harvest date cannot be in the future'),
  image: z.instanceof(File).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductRegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductFormData) => {
    const response = await fetch('/api/products/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast({ title: 'Product registered!', status: 'success' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors.name}>
        <FormLabel>Product Name</FormLabel>
        <Input {...register('name')} />
        <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
      </FormControl>

      <Button type="submit" isLoading={isSubmitting}>
        Register Product
      </Button>
    </form>
  );
}
```

---

## Web3 Integration (Wagmi + Viem)

**Consumer Read-Only Queries:**
```typescript
// hooks/useBlockchainProduct.ts
import { useContractRead } from 'wagmi';
import { ProductRegistryABI } from '@/contracts/ProductRegistry';

export function useBlockchainProduct(blockchainId: number) {
  const { data, isLoading, error } = useContractRead({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_PRODUCT_REGISTRY,
    abi: ProductRegistryABI,
    functionName: 'getProduct',
    args: [blockchainId],
    enabled: !!blockchainId,
  });

  return {
    blockchainProduct: data,
    loading: isLoading,
    error,
  };
}

// Usage in consumer query page
function ConsumerProductView({ productId }) {
  const { product } = useProduct(productId); // Database query
  const { blockchainProduct } = useBlockchainProduct(product?.blockchainId); // Blockchain query

  return (
    <Box>
      <Heading>{product.name}</Heading>
      <Text>Origin: {blockchainProduct?.origin}</Text>
      <Text>Producer: {blockchainProduct?.producer}</Text>
    </Box>
  );
}
```

---

## Performance Optimization

**Code Splitting (Dynamic Imports):**
```typescript
// pages/admin/iot-simulator.tsx
import dynamic from 'next/dynamic';

const IoTSimulator = dynamic(() => import('@/components/admin/IoTSimulator'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Disable SSR for admin-only component
});

export default function IoTSimulatorPage() {
  return <IoTSimulator />;
}
```

**Image Optimization (Next.js Image):**
```typescript
import Image from 'next/image';

<Image
  src={product.imageUrl}
  alt={product.name}
  width={400}
  height={400}
  quality={80}
  loading="lazy"
  placeholder="blur"
/>
```

**Memoization (useMemo, useCallback):**
```typescript
import { useMemo, useCallback } from 'react';

function ProductTable({ products }) {
  // Memoize expensive calculation
  const sortedProducts = useMemo(() => {
    return products.sort((a, b) => b.createdAt - a.createdAt);
  }, [products]);

  // Memoize callback to prevent child re-renders
  const handleProductClick = useCallback((id) => {
    router.push(`/producer/product/${id}`);
  }, [router]);

  return (
    <Table>
      {sortedProducts.map(product => (
        <ProductRow key={product.id} product={product} onClick={handleProductClick} />
      ))}
    </Table>
  );
}
```

---

**Last Updated:** 2025-11-20 (Week 0 Complete)
