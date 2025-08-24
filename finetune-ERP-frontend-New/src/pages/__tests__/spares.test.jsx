// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import Spares from '../Spares';

const createMock = vi
  .fn()
  .mockResolvedValue({ unwrap: () => Promise.resolve() });

vi.mock('../../api/erpApi', () => ({
  useGetSparesQuery: () => ({
    data: {
      content: [
        { id: 1, name: 'S1', sku: 'SKU1', price: '5', quality_name: 'OEM' },
      ],
    },
    isLoading: false,
  }),
  useCreateSpareMutation: () => [createMock],
  useUpdateSpareMutation: () => [vi.fn()],
  useDeleteSpareMutation: () => [vi.fn()],
}));

vi.mock('../../redux/hook', () => ({
  useAppSelector: () => 'system_admin',
}));

test('renders quality label', () => {
  render(<Spares />);
  expect(screen.getByText('Quality: OEM')).toBeDefined();
});

test('creates spare via form', async () => {
  render(<Spares />);
  const [nameInput] = screen.getAllByPlaceholderText('Name');
  const [skuInput] = screen.getAllByPlaceholderText('SKU');
  const [priceInput] = screen.getAllByPlaceholderText('Price');
  fireEvent.change(nameInput, {
    target: { value: 'S1', name: 'name' },
  });
  fireEvent.change(skuInput, {
    target: { value: 'SKU1', name: 'sku' },
  });
  fireEvent.change(priceInput, {
    target: { value: '5', name: 'price' },
  });
  const [submitBtn] = screen.getAllByRole('button', { name: /add spare/i });
  fireEvent.submit(submitBtn.closest('form'));
  expect(createMock).toHaveBeenCalled();
});
