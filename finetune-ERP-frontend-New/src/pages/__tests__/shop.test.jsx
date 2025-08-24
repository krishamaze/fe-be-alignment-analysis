// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, test, expect } from 'vitest';
import Shop from '../ecommerce/Shop';

vi.mock('../../api/erpApi', () => ({
  useGetProductsQuery: () => ({
    data: {
      content: [
        {
          id: 1,
          name: 'P1',
          slug: 'p1',
          brand: 'B',
          price: 10,
          availability: true,
        },
      ],
    },
    isLoading: false,
  }),
}));

test('renders products from API', () => {
  render(
    <MemoryRouter>
      <Shop />
    </MemoryRouter>
  );
  expect(screen.getByText('P1')).toBeDefined();
});
