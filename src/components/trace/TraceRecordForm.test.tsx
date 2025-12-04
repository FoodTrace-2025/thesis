// src/components/trace/TraceRecordForm.test.tsx
// Story 7.5: Unit tests for TraceRecordForm component

import { render, screen, fireEvent, waitFor } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import { TraceRecordForm } from './TraceRecordForm';

// Mock fetch
global.fetch = jest.fn();

// Mock useToast
const mockToast = jest.fn();
jest.mock('@chakra-ui/react', () => {
  const originalModule = jest.requireActual('@chakra-ui/react');
  return {
    ...originalModule,
    useToast: () => mockToast,
  };
});

describe('TraceRecordForm', () => {
  const defaultProps = {
    productId: 'test-product-123',
    userRole: 'DISTRIBUTOR',
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        traceRecord: {
          id: 'trace-1',
          action: 'RECEIVED',
          transactionHash: '0x1234567890abcdef',
        },
      }),
    });
  });

  // ==================== ROLE-ACTION FILTERING ====================

  describe('Role-action filtering', () => {
    it('should show only PRODUCER actions for PRODUCER role', () => {
      render(<TraceRecordForm {...defaultProps} userRole="PRODUCER" />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      // PRODUCER should see QUALITY_CHECK and SHIPPED
      expect(screen.getByText('Quality Check')).toBeInTheDocument();
      expect(screen.getByText('Shipped')).toBeInTheDocument();

      // PRODUCER should NOT see RECEIVED, STOCKED, SOLD
      expect(screen.queryByText('Received')).not.toBeInTheDocument();
      expect(screen.queryByText('Stocked')).not.toBeInTheDocument();
      expect(screen.queryByText('Sold')).not.toBeInTheDocument();
    });

    it('should show only DISTRIBUTOR actions for DISTRIBUTOR role', () => {
      render(<TraceRecordForm {...defaultProps} userRole="DISTRIBUTOR" />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      // DISTRIBUTOR should see RECEIVED, QUALITY_CHECK, SHIPPED
      expect(screen.getByText('Received')).toBeInTheDocument();
      expect(screen.getByText('Quality Check')).toBeInTheDocument();
      expect(screen.getByText('Shipped')).toBeInTheDocument();

      // DISTRIBUTOR should NOT see STOCKED, SOLD
      expect(screen.queryByText('Stocked')).not.toBeInTheDocument();
      expect(screen.queryByText('Sold')).not.toBeInTheDocument();
    });

    it('should show only RETAILER actions for RETAILER role', () => {
      render(<TraceRecordForm {...defaultProps} userRole="RETAILER" />);

      const select = screen.getByRole('combobox');
      fireEvent.click(select);

      // RETAILER should see RECEIVED, QUALITY_CHECK, STOCKED, SOLD
      expect(screen.getByText('Received')).toBeInTheDocument();
      expect(screen.getByText('Quality Check')).toBeInTheDocument();
      expect(screen.getByText('Stocked')).toBeInTheDocument();
      expect(screen.getByText('Sold')).toBeInTheDocument();

      // RETAILER should NOT see SHIPPED
      expect(screen.queryByText('Shipped')).not.toBeInTheDocument();
    });

    it('should show empty dropdown for unknown role', () => {
      render(<TraceRecordForm {...defaultProps} userRole="CONSUMER" />);

      const select = screen.getByRole('combobox');
      const options = select.querySelectorAll('option');

      // Only placeholder option should exist
      expect(options).toHaveLength(1);
      expect(options[0].textContent).toBe('Select action');
    });
  });

  // ==================== VALIDATION ====================

  describe('Validation', () => {
    it('should show error when action is not selected', async () => {
      const user = userEvent.setup();
      render(<TraceRecordForm {...defaultProps} />);

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);
      await user.type(locationInput, 'Test Location');

      // Submit the form directly using fireEvent to bypass native validation
      const form = document.querySelector('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Action is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when location is empty', async () => {
      const user = userEvent.setup();
      render(<TraceRecordForm {...defaultProps} />);

      // Select an action first
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      // Submit the form directly using fireEvent to bypass native validation
      const form = document.querySelector('form');
      fireEvent.submit(form!);

      await waitFor(() => {
        expect(screen.getByText(/Location is required/i)).toBeInTheDocument();
      });
    });

    it('should not show error for empty notes (optional field)', async () => {
      const user = userEvent.setup();
      render(<TraceRecordForm {...defaultProps} />);

      // Fill required fields
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);
      await user.type(locationInput, 'Test Location');

      const submitButton = screen.getByRole('button', { name: /Add Trace Record/i });
      await user.click(submitButton);

      // API should be called (no validation errors)
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('should validate location max length (100 characters)', async () => {
      render(<TraceRecordForm {...defaultProps} />);

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);

      // Input is already limited by maxLength attribute
      expect(locationInput).toHaveAttribute('maxLength', '100');
    });

    it('should validate notes max length (500 characters)', async () => {
      render(<TraceRecordForm {...defaultProps} />);

      const notesInput = screen.getByPlaceholderText(/Product received in good condition/i);

      // Input is already limited by maxLength attribute
      expect(notesInput).toHaveAttribute('maxLength', '500');
    });
  });

  // ==================== SUBMISSION ====================

  describe('Submission', () => {
    it('should call API with correct data on submit', async () => {
      const user = userEvent.setup();
      render(<TraceRecordForm {...defaultProps} />);

      // Fill form
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);
      await user.type(locationInput, 'Test Warehouse');

      const notesInput = screen.getByPlaceholderText(/Product received in good condition/i);
      await user.type(notesInput, 'Test notes');

      const submitButton = screen.getByRole('button', { name: /Add Trace Record/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/products/test-product-123/trace',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'RECEIVED',
              location: 'Test Warehouse',
              notes: 'Test notes',
            }),
          })
        );
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();

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
                    traceRecord: { transactionHash: '0x123' },
                  }),
                }),
              100
            )
          )
      );

      render(<TraceRecordForm {...defaultProps} />);

      // Fill form
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);
      await user.type(locationInput, 'Test');

      const submitButton = screen.getByRole('button', { name: /Add Trace Record/i });
      await user.click(submitButton);

      // Button should show loading text
      await waitFor(() => {
        expect(screen.getByText(/Recording on blockchain/i)).toBeInTheDocument();
      });

      // Wait message should appear
      expect(
        screen.getByText(/This may take 15-30 seconds/i)
      ).toBeInTheDocument();
    });

    it('should show success toast on successful submission', async () => {
      const user = userEvent.setup();
      render(<TraceRecordForm {...defaultProps} />);

      // Fill form
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);
      await user.type(locationInput, 'Test');

      const submitButton = screen.getByRole('button', { name: /Add Trace Record/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Trace record added',
            status: 'success',
          })
        );
      });
    });

    it('should show error toast on API error', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Unauthorized',
        }),
      });

      render(<TraceRecordForm {...defaultProps} />);

      // Fill form
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);
      await user.type(locationInput, 'Test');

      const submitButton = screen.getByRole('button', { name: /Add Trace Record/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Unauthorized')).toBeInTheDocument();
      });
    });

    it('should clear form after successful submission', async () => {
      const user = userEvent.setup();
      render(<TraceRecordForm {...defaultProps} />);

      // Fill form
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);
      await user.type(locationInput, 'Test Location');

      const submitButton = screen.getByRole('button', { name: /Add Trace Record/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(select).toHaveValue('');
        expect(locationInput).toHaveValue('');
      });
    });

    it('should call onSuccess callback after successful submission', async () => {
      const user = userEvent.setup();
      const onSuccess = jest.fn();
      render(<TraceRecordForm {...defaultProps} onSuccess={onSuccess} />);

      // Fill form
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);
      await user.type(locationInput, 'Test');

      const submitButton = screen.getByRole('button', { name: /Add Trace Record/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });

    it('should handle network errors', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<TraceRecordForm {...defaultProps} />);

      // Fill form
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);
      await user.type(locationInput, 'Test');

      const submitButton = screen.getByRole('button', { name: /Add Trace Record/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Network error. Please try again./i)).toBeInTheDocument();
      });
    });

    it('should handle API validation errors', async () => {
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          code: 'VALIDATION_ERROR',
          details: [{ path: ['location'], message: 'Location is invalid' }],
        }),
      });

      render(<TraceRecordForm {...defaultProps} />);

      // Fill form
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);
      await user.type(locationInput, 'Test');

      const submitButton = screen.getByRole('button', { name: /Add Trace Record/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Location is invalid')).toBeInTheDocument();
      });
    });
  });

  // ==================== FORM RENDERING ====================

  describe('Form rendering', () => {
    it('should render all form elements', () => {
      render(<TraceRecordForm {...defaultProps} />);

      expect(screen.getByLabelText(/Action/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Add Trace Record/i })).toBeInTheDocument();
    });

    it('should disable form elements during loading', async () => {
      const user = userEvent.setup();

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
                    traceRecord: { transactionHash: '0x123' },
                  }),
                }),
              200
            )
          )
      );

      render(<TraceRecordForm {...defaultProps} />);

      // Fill form
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      const locationInput = screen.getByPlaceholderText(/Helsinki Distribution Center/i);
      await user.type(locationInput, 'Test');

      const submitButton = screen.getByRole('button', { name: /Add Trace Record/i });
      await user.click(submitButton);

      // Check elements are disabled
      await waitFor(() => {
        expect(select).toBeDisabled();
        expect(locationInput).toBeDisabled();
      });
    });

    it('should clear error when field is corrected', async () => {
      const user = userEvent.setup();
      render(<TraceRecordForm {...defaultProps} />);

      // Trigger validation error using fireEvent.submit to bypass native validation
      const form = document.querySelector('form');
      fireEvent.submit(form!);

      // Error should appear
      await waitFor(() => {
        expect(screen.getByText(/Action is required/i)).toBeInTheDocument();
      });

      // Fix the error by selecting an action
      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'RECEIVED');

      // Error should be cleared
      await waitFor(() => {
        expect(screen.queryByText(/Action is required/i)).not.toBeInTheDocument();
      });
    });
  });
});
