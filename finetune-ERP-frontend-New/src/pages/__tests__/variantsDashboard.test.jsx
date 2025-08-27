// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import VariantsDashboard from '../VariantsDashboard';

const createMock = vi
  .fn()
  .mockResolvedValue({ unwrap: () => Promise.resolve() });

vi.mock('../../api/erpApi', () => ({
  useGetVariantsQuery: () => ({ data: { content: [] }, isLoading: false }),
  useCreateVariantMutation: () => [createMock],
  useUpdateVariantMutation: () => [vi.fn()],
  useDeleteVariantMutation: () => [vi.fn()],
}));

test('creates variant via form', async () => {
  render(<VariantsDashboard />);
  fireEvent.change(screen.getByPlaceholderText('Product Slug'), {
    target: { value: 'p1', name: 'product' },
  });
  fireEvent.change(screen.getByPlaceholderText('Variant Name'), {
    target: { value: 'V1', name: 'variant_name' },
  });
  fireEvent.change(screen.getByPlaceholderText('Price'), {
    target: { value: '5', name: 'price' },
  });
  fireEvent.change(screen.getByPlaceholderText('Stock'), {
    target: { value: '1', name: 'stock' },
  });
  fireEvent.click(screen.getByLabelText('Available'));
  fireEvent.submit(
    screen.getByRole('button', { name: /create/i }).closest('form')
  );
  expect(createMock).toHaveBeenCalled();
});
