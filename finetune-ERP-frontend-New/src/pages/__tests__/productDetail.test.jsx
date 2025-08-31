// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, test, expect } from 'vitest';
import ProductDetail, { metadata } from '../ecommerce/ProductDetail';

vi.mock('../../api/erpApi', () => ({
  useGetProductBySlugQuery: () => ({
    data: {
      id: 1,
      name: 'P1',
      brand: '1',
      brand_name: 'B',
      slug: 'p1',
      price: 10,
      availability: true,
      unit_name: 'Piece',
      unit_slug: 'piece',
      url: 'https://example.com/product/p1',
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
          unit_name: 'Piece',
          unit_slug: 'piece',
        },
      ],
    },
  }),
}));

test('renders product detail and SEO metadata', async () => {
  render(
    <MemoryRouter initialEntries={['/product/p1']}>
      <Routes>
        <Route path="/product/:slug" element={<ProductDetail />} />
      </Routes>
    </MemoryRouter>
  );
  expect(screen.getByText('P1')).toBeDefined();
  await waitFor(() => {
    expect(metadata.title).toBe('P1 - B');
    expect(metadata.openGraph.title).toBe('P1 - B');
  });
  expect(metadata.jsonLd['@type']).toBe('Product');
});
