// src/pages/admin/index.tsx
// Story 2.8: Platform Admin Dashboard
// Story 2.9: Add Company form
// PLATFORM_ADMIN only - manages company approvals

import { useState } from 'react';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Box, Heading, Text, VStack, HStack, Select, Button } from '@chakra-ui/react';
import { Layout } from '@/components/layout';
import { CompanyList } from '@/components/admin/CompanyList';
import { AddCompanyModal } from '@/components/admin/AddCompanyModal';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Redirect to login if not authenticated
  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Redirect non-PLATFORM_ADMIN to dashboard
  if (session.user.role !== 'PLATFORM_ADMIN') {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {
      adminName: session.user.name || session.user.email,
    },
  };
}

interface AdminDashboardProps {
  adminName: string;
}

export default function AdminDashboard({ adminName }: AdminDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddSuccess = () => {
    setRefreshKey((prev) => prev + 1); // Trigger CompanyList refresh
  };

  return (
    <Layout>
      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="lg" color="brand.dark">
            Platform Admin Dashboard
          </Heading>
          <Text color="brand.muted" mt={1}>
            Welcome, {adminName}
          </Text>
        </Box>

        {/* Company Management Section */}
        <Box
          bg="brand.surface"
          p={6}
          borderRadius="md"
          borderWidth="1px"
          borderColor="brand.border"
        >
          <HStack justify="space-between" mb={4}>
            <Heading size="md" color="brand.dark">
              Company Management
            </Heading>
            <HStack spacing={3}>
              <Button
                colorScheme="green"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                Add Company
              </Button>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                width="200px"
                bg="white"
              >
                <option value="ALL">All Companies</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </Select>
            </HStack>
          </HStack>
          <CompanyList key={refreshKey} statusFilter={statusFilter} />
        </Box>
      </VStack>

      {/* Add Company Modal */}
      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
    </Layout>
  );
}
