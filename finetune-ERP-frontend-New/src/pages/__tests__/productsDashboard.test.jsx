// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import ProductsDashboard from '../ProductsDashboard';

const createMock = vi.fn().mockResolvedValue({ unwrap: () => Promise.resolve() });

vi.mock('../../api/erpApi', () => ({
  useGetProductsQuery: () => ({ data: { content: [] }, isLoading: false }),
  useCreateProductMutation: () => [createMock],
  useUpdateProductMutation: () => [vi.fn()],
  useDeleteProductMutation: () => [vi.fn()],
}));

test('creates product via form', async () => {
  render(<ProductsDashboard />);
  fireEvent.change(screen.getByPlaceholderText('Name'), {
    target: { value: 'P1', name: 'name' },
  });
  fireEvent.change(screen.getByPlaceholderText('Brand ID'), {
    target: { value: '1', name: 'brand' },
  });
  fireEvent.change(screen.getByPlaceholderText('Category ID'), {
    target: { value: '1', name: 'category' },
  });
  fireEvent.change(screen.getByPlaceholderText('Price'), {
    target: { value: '10', name: 'price' },
  });
  fireEvent.change(screen.getByPlaceholderText('Stock'), {
    target: { value: '5', name: 'stock' },
  });
  fireEvent.click(screen.getByLabelText('Available'));
  fireEvent.submit(screen.getByRole('button', { name: /create/i }).closest('form'));
  expect(createMock).toHaveBeenCalled();
});
