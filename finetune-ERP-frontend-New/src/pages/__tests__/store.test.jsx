// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import Store from '../Store';

const createMock = vi.fn().mockResolvedValue({ unwrap: () => Promise.resolve() });

vi.mock('../../api/erpApi', () => ({
  useGetStoresQuery: () => ({ data: { content: [] }, isLoading: false }),
  useCreateStoreMutation: () => [createMock],
  useUpdateStoreMutation: () => [vi.fn()],
  useDeleteStoreMutation: () => [vi.fn()],
}));

test('creates store via form', async () => {
  render(<Store />);
  fireEvent.change(screen.getByPlaceholderText('Name'), {
    target: { value: 'S1', name: 'store_name' },
  });
  fireEvent.change(screen.getByPlaceholderText('Code'), {
    target: { value: 'C1', name: 'code' },
  });
  fireEvent.submit(screen.getByRole('button', { name: /create/i }).closest('form'));
  expect(createMock).toHaveBeenCalled();
});
