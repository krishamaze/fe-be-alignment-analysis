// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import BookingsDashboard from '../BookingsDashboard';

const updateMock = vi
  .fn()
  .mockResolvedValue({ unwrap: () => Promise.resolve() });

vi.mock('../../api/erpApi', () => ({
  useGetBookingsQuery: () => ({
    data: { content: [{ id: 1, name: 'A', status: 'pending' }] },
    isLoading: false,
  }),
  useUpdateBookingMutation: () => [updateMock],
}));

test('updates booking status', async () => {
  render(<BookingsDashboard />);
  fireEvent.click(screen.getByText('Approve'));
  expect(updateMock).toHaveBeenCalledWith({ id: 1, status: 'approved' });
});
