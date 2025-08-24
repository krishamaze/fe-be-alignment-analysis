// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import { useEffect } from 'react';
import Bookings from '../../src/pages/Bookings';

const submitMock = vi.fn().mockResolvedValue({ unwrap: () => Promise.resolve({ id: 1, status: 'pending' }) });

vi.mock('../../src/api/erpApi', () => ({
  useCreateBookingMutation: () => [submitMock],
  useGetBookingsQuery: () => ({ data: { content: [] }, refetch: vi.fn() }),
  useGetIssuesQuery: () => ({ data: [{ id: 1, name: 'Screen' }] }),
  useGetQuestionsQuery: () => ({ data: [{ id: 1, text: 'Device?', type: 'text' }] }),
}));

vi.mock('../../src/components/common/ReCaptchaWrapper', () => ({
  __esModule: true,
  default: ({ onChange }) => {
    useEffect(() => {
      onChange('token');
    }, [onChange]);
    return null;
  },
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
window.ResizeObserver = global.ResizeObserver;

test('booking form renders dynamic issues/questions', () => {
  render(<Bookings />);
  expect(screen.getByText('Select issues')).toBeTruthy();
  expect(screen.getByText('Device?')).toBeTruthy();
});

test('booking form submits and calls useCreateBookingMutation', async () => {
  const { container } = render(<Bookings />);
  fireEvent.change(screen.getAllByPlaceholderText('Name')[0], {
    target: { value: 'John' },
  });
  fireEvent.change(screen.getAllByPlaceholderText('Email (optional)')[0], {
    target: { value: 'a@b.com' },
  });
  container.querySelector('input[type="date"]').value = '2024-01-01';
  fireEvent.change(container.querySelector('input[type="date"]'));
  container.querySelector('input[type="time"]').value = '10:00';
  fireEvent.change(container.querySelector('input[type="time"]'));
  fireEvent.click(screen.getAllByText('Select issues')[0]);
  fireEvent.click(screen.getByText('Screen'));
  fireEvent.click(screen.getAllByText('Submit')[0]);
  await screen.findByText('Booking Submitted');
  expect(submitMock).toHaveBeenCalled();
});
