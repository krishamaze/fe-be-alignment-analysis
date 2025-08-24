// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import BookingsDashboard from '../BookingsDashboard';

const updateMock = vi
  .fn()
  .mockResolvedValue({ unwrap: () => Promise.resolve() });

vi.mock('../../api/erpApi', () => ({
  useGetBookingsQuery: () => ({
    data: { content: [{ id: 1, name: 'A', status: 'pending', reason: 'delay' }] },
    isLoading: false,
  }),
  useUpdateBookingStatusMutation: () => [updateMock],
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
