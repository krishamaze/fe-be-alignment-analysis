// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import Brands from '../Brands';
import { HelmetProvider } from 'react-helmet-async';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

vi.mock('../../redux/api/publicApi', () => ({
  useGetBrandsQuery: () => ({
    data: [{ id: 1, name: 'BrandA', logo: '' }],
    isLoading: false,
    isError: false,
  }),
}));

describe('Brands page', () => {
  it('renders brands from API', async () => {
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <HelmetProvider>
          <Brands />
        </HelmetProvider>,
      );
    });
    expect(container.textContent).toContain('BrandA');
  });
});
