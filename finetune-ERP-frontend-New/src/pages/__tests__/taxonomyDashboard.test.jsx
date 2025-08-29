// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import TaxonomyDashboard from '../internal/TaxonomyDashboard';

const departments = vi.hoisted(() => []);

vi.mock('../../api/erpApi', () => {
  const createDepartmentMock = vi
    .fn()
    .mockResolvedValue({ unwrap: () => Promise.resolve() });
  return {
    useGetDepartmentsQuery: () => ({
      data: { content: departments },
      isLoading: false,
    }),
    useCreateDepartmentMutation: () => [createDepartmentMock],
    useUpdateDepartmentMutation: () => [vi.fn()],
    useDeleteDepartmentMutation: () => [vi.fn()],
    useGetCategoriesQuery: () => ({ data: { content: [] }, isLoading: false }),
    useCreateCategoryMutation: () => [vi.fn()],
    useUpdateCategoryMutation: () => [vi.fn()],
    useDeleteCategoryMutation: () => [vi.fn()],
    useGetSubCategoriesQuery: () => ({
      data: { content: [] },
      isLoading: false,
    }),
    useCreateSubCategoryMutation: () => [vi.fn()],
    useUpdateSubCategoryMutation: () => [vi.fn()],
    useDeleteSubCategoryMutation: () => [vi.fn()],
    __esModule: true,
    createDepartmentMock,
  };
});

import { createDepartmentMock } from '../../api/erpApi';

test('creates department and refreshes list', async () => {
  const { rerender } = render(<TaxonomyDashboard />);
  fireEvent.change(screen.getAllByPlaceholderText('Name')[0], {
    target: { value: 'Electronics', name: 'name' },
  });
  fireEvent.submit(
    screen.getAllByRole('button', { name: /create/i })[0].closest('form')
  );
  expect(createDepartmentMock).toHaveBeenCalled();
  departments.push({ id: 1, name: 'Electronics', slug: 'electronics' });
  rerender(<TaxonomyDashboard />);
  expect(screen.getAllByText('Electronics')[0]).toBeTruthy();
});
