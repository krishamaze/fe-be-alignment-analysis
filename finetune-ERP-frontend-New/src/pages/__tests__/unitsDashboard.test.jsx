// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, test, expect, beforeEach } from 'vitest';
import UnitsDashboard from '../internal/UnitsDashboard';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast', () => {
  const fn = () => {};
  fn.success = vi.fn();
  fn.error = vi.fn();
  return { default: fn };
});

const getMock = vi.fn(() => ({ data: { content: [] }, isLoading: false }));
const createMock = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
const updateMock = vi.fn(() => ({ unwrap: () => Promise.resolve() }));
const deleteMock = vi.fn(() => ({ unwrap: () => Promise.resolve() }));

vi.mock('../../api/erpApi', () => ({
  useGetUnitsQuery: () => getMock(),
  useCreateUnitMutation: () => [createMock],
  useUpdateUnitMutation: () => [updateMock],
  useDeleteUnitMutation: () => [deleteMock],
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test('creates unit and refreshes table', async () => {
  render(<UnitsDashboard />);
  const initial = getMock.mock.calls.length;
  fireEvent.change(screen.getByPlaceholderText('Name'), {
    target: { value: 'Piece', name: 'name' },
  });
  fireEvent.submit(
    screen.getByRole('button', { name: /create/i }).closest('form')
  );
  await waitFor(() => expect(createMock).toHaveBeenCalled());
  expect(getMock.mock.calls.length).toBeGreaterThan(initial);
  expect(toast.success).toHaveBeenCalled();
});

test('deletes unit and refreshes table', async () => {
  getMock.mockReturnValueOnce({
    data: { content: [{ id: 1, name: 'P', slug: 'p' }] },
    isLoading: false,
  });
  render(<UnitsDashboard />);
  fireEvent.click(screen.getByText('Delete'));
  await waitFor(() => expect(deleteMock).toHaveBeenCalled());
  expect(toast.success).toHaveBeenCalled();
});
