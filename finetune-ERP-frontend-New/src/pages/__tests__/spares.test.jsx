// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import Spares from '../Spares';

const createMock = vi.fn().mockResolvedValue({ unwrap: () => Promise.resolve() });

vi.mock('../../api/erpApi', () => ({
  useGetSparesQuery: () => ({ data: { content: [] }, isLoading: false }),
  useCreateSpareMutation: () => [createMock],
  useUpdateSpareMutation: () => [vi.fn()],
  useDeleteSpareMutation: () => [vi.fn()],
}));

vi.mock('../../redux/hook', () => ({
  useAppSelector: () => 'system_admin',
}));

test('creates spare via form', async () => {
  render(<Spares />);
  fireEvent.change(screen.getByPlaceholderText('Name'), {
    target: { value: 'S1', name: 'name' },
  });
  fireEvent.change(screen.getByPlaceholderText('SKU'), {
    target: { value: 'SKU1', name: 'sku' },
  });
  fireEvent.change(screen.getByPlaceholderText('Price'), {
    target: { value: '5', name: 'price' },
  });
  fireEvent.submit(
    screen.getByRole('button', { name: /add spare/i }).closest('form')
  );
  expect(createMock).toHaveBeenCalled();
});
