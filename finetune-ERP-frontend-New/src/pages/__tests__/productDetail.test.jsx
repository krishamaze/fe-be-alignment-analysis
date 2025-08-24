// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, test, expect } from 'vitest';
import ProductDetail from '../ecommerce/ProductDetail';

vi.mock('../../api/erpApi', () => ({
  useGetProductBySlugQuery: () => ({
    data: {
      id: 1,
      name: 'P1',
      brand: 'B',
      slug: 'p1',
      price: 10,
      availability: true,
    },
    isLoading: false,
  }),
  useGetVariantsQuery: () => ({
    data: {
      content: [
        {
          id: 1,
          variant_name: 'V1',
          slug: 'p1-v1',
          price: 5,
          availability: true,
        },
      ],
    },
  }),
}));

test('renders product detail by slug', () => {
  render(
    <MemoryRouter initialEntries={['/product/p1']}>
      <Routes>
        <Route path="/product/:slug" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByText('P1')).toBeDefined();
  expect(screen.getByText('V1 - ₹5')).toBeDefined();
});
