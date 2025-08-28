// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import BookingsDashboard from '../BookingsDashboard';

const updateMock = vi
  .fn()
  .mockResolvedValue({ unwrap: () => Promise.resolve() });
const createMock = vi.fn();

vi.mock('../../api/erpApi', () => ({
  useGetBookingsQuery: () => ({
    data: {
      content: [{ id: 1, name: 'A', status: 'pending', reason: 'delay' }],
    },
    isLoading: false,
  }),
  useUpdateBookingStatusMutation: () => [updateMock],
  useGetInvoicesQuery: () => ({ data: [] }),
  useCreateStockEntryMutation: () => [createMock],
  useGetStockEntriesQuery: () => ({ data: [] }),
}));

test('reject requires reason', () => {
  render(<BookingsDashboard />);
  fireEvent.click(screen.getByText('Reject'));
  fireEvent.click(screen.getByText('Submit'));
  expect(updateMock).not.toHaveBeenCalled();
  fireEvent.change(screen.getByPlaceholderText('Reason'), {
    target: { value: 'not valid' },
  });
  fireEvent.click(screen.getByText('Submit'));
  expect(updateMock).toHaveBeenCalledWith({
    id: 1,
    status: 'rejected',
    reason: 'not valid',
  });
});

test('shows reason in table', () => {
  render(<BookingsDashboard />);
  expect(screen.getAllByText('delay').length).toBeGreaterThan(0);
});

test('sale entry includes booking id', () => {
  render(<BookingsDashboard />);
  fireEvent.change(screen.getAllByPlaceholderText('Store ID')[0], {
    target: { value: '1' },
  });
  fireEvent.change(screen.getAllByPlaceholderText('Variant ID')[0], {
    target: { value: '2' },
  });
  const [qtyInput, priceInput] = screen.getAllByRole('spinbutton');
  fireEvent.change(qtyInput, { target: { value: '1' } });
  fireEvent.change(priceInput, { target: { value: '10' } });
  fireEvent.click(screen.getAllByText('Save')[0]);
  expect(createMock).toHaveBeenCalledWith(
    expect.objectContaining({ booking: 1 })
  );
});
