// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import Stores from '../Stores';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('../../redux/api/publicApi', () => ({
  useGetStoresQuery: () => ({
    data: [
      {
        id: 1,
        store_name: 'Alpha',
        store_address: '123 St',
        lat: 0,
        lon: 0,
      },
    ],
    isLoading: false,
    isError: false,
  }),
}));

describe('Stores page', () => {
  it('renders stores from API', async () => {
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <HelmetProvider>
          <MemoryRouter>
            <Stores />
          </MemoryRouter>
        </HelmetProvider>,
      );
    });
    expect(container.textContent).toContain('Alpha');
    expect(container.textContent).toContain('123 St');
  });
});
