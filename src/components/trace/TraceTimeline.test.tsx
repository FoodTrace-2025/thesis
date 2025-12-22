// src/components/trace/TraceTimeline.test.tsx
// Story 7.5: Unit tests for TraceTimeline component

import { render, screen, waitFor } from '@/test/test-utils';
import { TraceTimeline } from './TraceTimeline';

// Mock fetch
global.fetch = jest.fn();

describe('TraceTimeline', () => {
  const mockTraceRecords = [
    {
      id: 'trace-1',
      action: 'RECEIVED',
      location: 'Helsinki Distribution Center',
      notes: 'Product received in good condition, temperature 2.1C',
      actor: {
        name: 'Liisa Korhonen',
        role: 'DISTRIBUTOR',
        company: 'Helsinki Distributors',
      },
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      etherscanLink:
        'https://sepolia.etherscan.io/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      createdAt: '2025-12-04T10:00:00.000Z',
    },
    {
      id: 'trace-2',
      action: 'SHIPPED',
      location: 'Logistics Hub',
      notes: null,
      actor: {
        name: 'Jari Virtanen',
        role: 'DISTRIBUTOR',
        company: 'Helsinki Distributors',
      },
      transactionHash: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      etherscanLink:
        'https://sepolia.etherscan.io/tx/0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      createdAt: '2025-12-04T11:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        traceRecords: mockTraceRecords,
        total: 2,
        limit: 50,
        offset: 0,
      }),
    });
  });

  // ==================== LOADING STATE ====================

  describe('Loading state', () => {
    it('should show spinner while loading', async () => {
      // Delay the fetch response
      (global.fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({
                    success: true,
                    traceRecords: mockTraceRecords,
                  }),
                }),
              100
            )
          )
      );

      render(<TraceTimeline productId="test-product-123" />);

      // Spinner should be visible initially (Chakra spinner has class chakra-spinner)
      expect(document.querySelector('.chakra-spinner')).toBeInTheDocument();
    });

    it('should hide spinner after loading completes', async () => {
      render(<TraceTimeline productId="test-product-123" />);

      // Wait for data to load
      await waitFor(() => {
        expect(document.querySelector('.chakra-spinner')).not.toBeInTheDocument();
      });
    });
  });

  // ==================== EMPTY STATE ====================

  describe('Empty state', () => {
    it('should show empty state when no records', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          traceRecords: [],
          total: 0,
        }),
      });

      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        expect(screen.getByText(/No trace records yet/i)).toBeInTheDocument();
        expect(
          screen.getByText(/Trace records will appear here/i)
        ).toBeInTheDocument();
      });
    });
  });

  // ==================== SUCCESS CASES ====================

  describe('Success cases', () => {
    it('should display trace records', async () => {
      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        expect(screen.getByText('Helsinki Distribution Center')).toBeInTheDocument();
        expect(screen.getByText('Logistics Hub')).toBeInTheDocument();
      });
    });

    it('should show action badges', async () => {
      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        expect(screen.getByText('RECEIVED')).toBeInTheDocument();
        expect(screen.getByText('SHIPPED')).toBeInTheDocument();
      });
    });

    it('should show actor name and company', async () => {
      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        expect(
          screen.getByText(/Liisa Korhonen from Helsinki Distributors/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/Jari Virtanen from Helsinki Distributors/i)
        ).toBeInTheDocument();
      });
    });

    it('should show Etherscan links', async () => {
      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        const links = screen.getAllByText(/Verify on Etherscan/i);
        expect(links).toHaveLength(2);

        // Check first link
        expect(links[0].closest('a')).toHaveAttribute(
          'href',
          'https://sepolia.etherscan.io/tx/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef'
        );
      });
    });

    it('should display notes when present', async () => {
      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        expect(
          screen.getByText(/Product received in good condition, temperature 2.1C/i)
        ).toBeInTheDocument();
      });
    });

    it('should not display notes element when notes is null', async () => {
      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        // The second record has null notes
        // Location should be visible, but no notes content
        expect(screen.getByText('Logistics Hub')).toBeInTheDocument();

        // The notes for second record should not exist
        // (we check by verifying only one note-like content exists)
        const notesElements = screen.queryAllByText(/temperature/i);
        expect(notesElements).toHaveLength(1);
      });
    });

    it('should display timestamps', async () => {
      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        // Timestamps are formatted by toLocaleString, check for date parts
        // The actual format depends on locale, but should contain the date
        const content = document.body.textContent;
        expect(content).toMatch(/2025/);
      });
    });
  });

  // ==================== ERROR STATE ====================

  describe('Error state', () => {
    it('should show error message on fetch failure', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Product not found',
        }),
      });

      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        expect(screen.getByText('Product not found')).toBeInTheDocument();
      });
    });

    it('should show network error message on network failure', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        expect(screen.getByText(/Network error. Please try again./i)).toBeInTheDocument();
      });
    });

    it('should show default error message when no error in response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to load trace history/i)).toBeInTheDocument();
      });
    });
  });

  // ==================== API CALLS ====================

  describe('API calls', () => {
    it('should call correct API endpoint', async () => {
      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/products/test-product-123/trace-history'
        );
      });
    });

    it('should fetch on mount', async () => {
      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });

    it('should refetch when productId changes', async () => {
      const { rerender } = render(<TraceTimeline productId="product-1" />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/products/product-1/trace-history');
      });

      rerender(<TraceTimeline productId="product-2" />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/products/product-2/trace-history');
      });
    });
  });

  // ==================== ACCESSIBILITY ====================

  describe('Accessibility', () => {
    it('should have accessible loading state with label', async () => {
      (global.fetch as jest.Mock).mockImplementationOnce(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({
                    success: true,
                    traceRecords: mockTraceRecords,
                  }),
                }),
              100
            )
          )
      );

      render(<TraceTimeline productId="test-product-123" />);

      // Spinner should have accessible label text
      expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    });

    it('should have external links with proper attributes', async () => {
      render(<TraceTimeline productId="test-product-123" />);

      await waitFor(() => {
        const links = screen.getAllByText(/Verify on Etherscan/i);
        links.forEach((link) => {
          const anchor = link.closest('a');
          expect(anchor).toHaveAttribute('href');
          // Chakra's isExternal adds target="_blank" and rel="noopener"
        });
      });
    });
  });
});
