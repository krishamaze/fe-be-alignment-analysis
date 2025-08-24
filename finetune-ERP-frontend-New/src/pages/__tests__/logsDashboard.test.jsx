import { render, screen } from '@testing-library/react';
import LogsDashboard from '../LogsDashboard';
import { vi, describe, it, expect } from 'vitest';

vi.mock('../../api/erpApi', () => ({
  erpApi: {
    reducerPath: 'api',
    reducer: () => ({}),
    middleware: () => (next) => (action) => next(action),
  },
  useGetLogsQuery: () => ({
    data: [
      {
        id: 1,
        actor: 'user',
        entity_type: 'booking',
        action: 'created',
        reason: null,
        timestamp: '2024-01-01T00:00:00Z',
      },
    ],
  }),
}));

describe('LogsDashboard', () => {
  it('renders logs', () => {
    render(<LogsDashboard />);
    expect(screen.getByText('Event Logs')).toBeTruthy();
    expect(screen.getByPlaceholderText('Entity Type')).toBeTruthy();
    expect(screen.getByText('booking')).toBeTruthy();
    expect(screen.getByText('Export CSV')).toBeTruthy();
    expect(screen.getByText('Export JSON')).toBeTruthy();
  });
});
