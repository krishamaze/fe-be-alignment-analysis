// @vitest-environment jsdom
import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import { useEffect } from 'react';
import Bookings from '../../src/pages/Bookings';

const submitMock = vi.fn().mockReturnValue({
  unwrap: () => Promise.resolve({ id: 1, status: 'pending' }),
});

vi.mock('../../src/api/erpApi', () => ({
  useCreateBookingMutation: () => [submitMock],
  useGetBookingsQuery: () => ({ data: { content: [] }, refetch: vi.fn() }),
  useGetIssuesQuery: () => ({ data: [{ id: 1, name: 'Screen' }] }),
  useGetQuestionsQuery: () => ({
    data: [{ id: 1, text: 'Device?', type: 'text' }],
  }),
}));

vi.mock('../../src/components/common/ReCaptchaWrapper', () => ({
  __esModule: true,
  default: function MockReCaptcha({ onChange }) {
    useEffect(() => {
      onChange('token');
    }, [onChange]);
    return null;
  },
}));

test('booking form renders dynamic issues/questions', () => {
  render(<Bookings />);
  expect(screen.getByText('Select issues')).toBeTruthy();
  expect(screen.getByText('Device?')).toBeTruthy();
});

test.skip('booking form submits and calls useCreateBookingMutation', async () => {
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
  fireEvent.click(await screen.findByText('Screen'));
  fireEvent.change(
    screen.getAllByText('Device?')[0].parentElement.querySelector('input'),
    {
      target: { value: 'Phone' },
    }
  );
  await act(async () => {
    fireEvent.click(screen.getAllByText('Submit')[0]);
  });
  expect(submitMock).toHaveBeenCalled();
});
