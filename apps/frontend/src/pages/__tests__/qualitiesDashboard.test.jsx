// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, test, expect, beforeEach } from 'vitest';
import QualitiesDashboard from '../internal/QualitiesDashboard';
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
  useGetQualitiesQuery: () => getMock(),
  useCreateQualityMutation: () => [createMock],
  useUpdateQualityMutation: () => [updateMock],
  useDeleteQualityMutation: () => [deleteMock],
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test('updates quality and refreshes table', async () => {
  getMock.mockReturnValueOnce({
    data: { content: [{ id: 1, name: 'Old', slug: 'old' }] },
    isLoading: false,
  });
  render(<QualitiesDashboard />);
  const initial = getMock.mock.calls.length;
  fireEvent.click(screen.getByText('Edit'));
  fireEvent.change(screen.getByPlaceholderText('Name'), {
    target: { value: 'New', name: 'name' },
  });
  fireEvent.submit(
    screen.getByRole('button', { name: /update/i }).closest('form')
  );
  await waitFor(() => expect(updateMock).toHaveBeenCalled());
  expect(getMock.mock.calls.length).toBeGreaterThan(initial);
  expect(toast.success).toHaveBeenCalled();
});
