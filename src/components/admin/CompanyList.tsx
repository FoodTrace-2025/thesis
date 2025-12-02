// src/components/admin/CompanyList.tsx
// Story 2.8: Company list table with status badges and actions

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  Spinner,
  Center,
  Button,
  HStack,
} from '@chakra-ui/react';
import { ApproveModal } from './ApproveModal';
import { RejectModal } from './RejectModal';

// Company type matching API response
interface Company {
  id: string;
  name: string;
  email: string;
  domain: string;
  type: 'PRODUCER' | 'DISTRIBUTOR' | 'RETAILER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  walletAddress: string | null;
  createdAt: string;
}

interface CompanyListProps {
  statusFilter?: string;
}

// Truncate wallet address: 0x742d...0bEb
function truncateWallet(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format date for display
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Status badge color mapping
function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'yellow';
    case 'APPROVED':
      return 'green';
    case 'REJECTED':
      return 'red';
    default:
      return 'gray';
  }
}

export function CompanyList({ statusFilter }: CompanyListProps) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Fetch companies from API
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const url =
        statusFilter && statusFilter !== 'ALL'
          ? `/api/admin/companies?status=${statusFilter}`
          : '/api/admin/companies';

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch companies');
      }

      setCompanies(data.companies || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Modal handlers
  const handleApproveClick = (company: Company) => {
    setSelectedCompany(company);
    setIsApproveModalOpen(true);
  };

  const handleRejectClick = (company: Company) => {
    setSelectedCompany(company);
    setIsRejectModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedCompany(null);
    setIsApproveModalOpen(false);
    setIsRejectModalOpen(false);
  };

  const handleActionSuccess = () => {
    fetchCompanies(); // Refresh the list
  };

  // Loading state
  if (loading) {
    return (
      <Center py={10}>
        <Spinner size="lg" color="brand.primary" />
      </Center>
    );
  }

  // Error state
  if (error) {
    return (
      <Box py={10} textAlign="center">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  // Empty state
  if (companies.length === 0) {
    return (
      <Box py={10} textAlign="center">
        <Text color="brand.muted">
          {statusFilter && statusFilter !== 'ALL'
            ? `No ${statusFilter.toLowerCase()} companies found`
            : 'No companies found'}
        </Text>
      </Box>
    );
  }

  return (
    <>
      <Box overflowX="auto">
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Domain</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Wallet</Th>
              <Th>Created</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {companies.map((company) => (
              <Tr key={company.id}>
                <Td fontWeight="medium">{company.name}</Td>
                <Td>{company.email}</Td>
                <Td>{company.domain}</Td>
                <Td>
                  <Badge variant="outline" colorScheme="blue">
                    {company.type}
                  </Badge>
                </Td>
                <Td>
                  <Badge colorScheme={getStatusColor(company.status)}>
                    {company.status}
                  </Badge>
                </Td>
                <Td>
                  {company.walletAddress ? (
                    <Text fontFamily="mono" fontSize="xs">
                      {truncateWallet(company.walletAddress)}
                    </Text>
                  ) : (
                    <Text color="brand.muted" fontSize="xs">
                      —
                    </Text>
                  )}
                </Td>
                <Td fontSize="sm">{formatDate(company.createdAt)}</Td>
                <Td>
                  {company.status === 'PENDING' && (
                    <HStack spacing={2}>
                      <Button
                        size="xs"
                        colorScheme="green"
                        onClick={() => handleApproveClick(company)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => handleRejectClick(company)}
                      >
                        Reject
                      </Button>
                    </HStack>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modals */}
      <ApproveModal
        isOpen={isApproveModalOpen}
        onClose={handleModalClose}
        company={selectedCompany}
        onSuccess={handleActionSuccess}
      />
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={handleModalClose}
        company={selectedCompany}
        onSuccess={handleActionSuccess}
      />
    </>
  );
}
