import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import InventoryDashboard from '../InventoryDashboard.jsx';

vi.mock('../../api/erpApi', () => ({
  useGetStockLedgersQuery: () => ({ data: [] }),
  useCreateStockEntryMutation: () => [vi.fn()],
  useGetSerialsQuery: () => ({ data: [] }),
  useGetPriceLogsQuery: () => ({ data: [] }),
  useGetInventoryConfigQuery: () => ({ data: [] }),
  useUpdateInventoryConfigMutation: () => [vi.fn()],
}));

describe('InventoryDashboard', () => {
  it('renders heading', () => {
    render(<InventoryDashboard />);
    expect(screen.getByText(/Inventory Dashboard/i)).toBeTruthy();
  });
});
