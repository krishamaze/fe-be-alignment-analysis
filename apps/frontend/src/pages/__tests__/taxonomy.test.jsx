// @vitest-environment jsdom
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, test, expect } from 'vitest';
import DepartmentsPage from '../ecommerce/DepartmentsPage';
import CategoryPage from '../ecommerce/CategoryPage';

const getDepartmentsMock = vi.fn();
const getSubCategoriesMock = vi.fn();
const getProductsMock = vi.fn();

vi.mock('../../api/erpApi', () => ({
  useGetDepartmentsQuery: (...args) => getDepartmentsMock(...args),
  useGetSubCategoriesQuery: (...args) => getSubCategoriesMock(...args),
  useGetProductsQuery: (...args) => getProductsMock(...args),
}));

test('renders departments from API', () => {
  getDepartmentsMock.mockReturnValue({
    data: { content: [{ id: 1, name: 'Electronics', slug: 'electronics' }] },
    isLoading: false,
  });
  render(
    <MemoryRouter>
      <DepartmentsPage />
    </MemoryRouter>
  );
  expect(screen.getByText('Electronics')).toBeTruthy();
});

test('category page filters products by subcategory slug', () => {
  getSubCategoriesMock.mockReturnValue({
    data: {
      content: [
        {
          id: 1,
          name: 'Smartphones',
          slug: 'smartphones',
          category: { slug: 'phones' },
        },
      ],
    },
    isLoading: false,
  });
  getProductsMock.mockReturnValue({
    data: { content: [{ id: 1, name: 'P1', slug: 'p1' }] },
    isLoading: false,
  });
  render(
    <MemoryRouter
      initialEntries={['/departments/electronics/phones/smartphones/products']}
    >
      <Routes>
        <Route
          path="/departments/:deptSlug/:catSlug/:subcatSlug/products"
          element={<CategoryPage />}
        />
      </Routes>
    </MemoryRouter>
  );
  expect(getProductsMock).toHaveBeenCalledWith({ subcategory: 'smartphones' });
  expect(screen.getByText('P1')).toBeTruthy();
});
