// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import BrandDashboard from '../BrandDashboard';

const createMock = vi
  .fn()
  .mockResolvedValue({ unwrap: () => Promise.resolve() });

vi.mock('../../api/erpApi', () => ({
  useGetBrandsQuery: () => ({ data: { content: [] }, isLoading: false }),
  useCreateBrandMutation: () => [createMock],
  useUpdateBrandMutation: () => [vi.fn()],
  useDeleteBrandMutation: () => [vi.fn()],
}));

test('submits new brand', async () => {
  render(<BrandDashboard />);
  fireEvent.change(screen.getByPlaceholderText('Name'), {
    target: { value: 'New', name: 'name' },
  });
  fireEvent.submit(
    screen.getByRole('button', { name: /create/i }).closest('form')
  );
  expect(createMock).toHaveBeenCalled();
});
