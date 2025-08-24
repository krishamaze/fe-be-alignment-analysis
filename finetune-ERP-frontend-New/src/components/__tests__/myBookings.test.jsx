// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import MyBookings from '../MyBookings';

const cancelMock = vi
  .fn()
  .mockResolvedValue({ unwrap: () => Promise.resolve() });

vi.mock('../../api/erpApi', () => ({
  useCancelBookingMutation: () => [cancelMock],
}));

test('cancel modal requires reason', () => {
  render(<MyBookings bookings={[{ id: 1, status: 'pending' }]} />);
  fireEvent.click(screen.getByText('Cancel'));
  fireEvent.click(screen.getByText('Submit'));
  expect(cancelMock).not.toHaveBeenCalled();
  fireEvent.change(screen.getByPlaceholderText('Reason'), {
    target: { value: 'cannot attend' },
  });
  fireEvent.click(screen.getByText('Submit'));
  expect(cancelMock).toHaveBeenCalledWith({ id: 1, reason: 'cannot attend' });
});
