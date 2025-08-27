// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, test, expect } from 'vitest';
import Shop from '../ecommerce/Shop';

const mockProducts = vi.fn().mockReturnValue({
  data: { content: [] },
  isLoading: false,
});

vi.mock('../../api/erpApi', () => ({
  useGetProductsQuery: (params) => {
    mockProducts(params || {});
    return { data: { content: [] }, isLoading: false };
  },
  useGetBrandsQuery: () => ({ data: [{ id: 1, name: 'B1' }] }),
  useGetDepartmentsQuery: () => ({ data: { content: [] } }),
  useGetCategoriesQuery: () => ({ data: { content: [] } }),
  useGetSubCategoriesQuery: () => ({ data: { content: [] } }),
}));

test('updates query params on filters and sorting', () => {
  render(
    <MemoryRouter>
      <Shop />
    </MemoryRouter>
  );
  expect(mockProducts).toHaveBeenLastCalledWith({ ordering: '-date_created' });
  fireEvent.click(screen.getByLabelText('B1'));
  expect(mockProducts).toHaveBeenLastCalledWith({
    ordering: '-date_created',
    brand: 1,
  });
  fireEvent.change(screen.getByDisplayValue('Newest'), {
    target: { value: 'price' },
  });
  expect(mockProducts).toHaveBeenLastCalledWith({
    brand: 1,
    ordering: 'price',
  });
});
