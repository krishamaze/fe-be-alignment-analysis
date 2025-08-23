// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import Products from '../Products';
import END_POINTS from '../../utils/Endpoints';

vi.mock('axios');

afterEach(() => {
  document.head.innerHTML = '';
  vi.resetAllMocks();
});

describe('Products page', () => {
  it('fetches list and applies filters', async () => {
    axios.get.mockResolvedValue({ data: { content: [] } });
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Products />);
    });
    expect(axios.get).toHaveBeenCalledWith(
      `${END_POINTS.API_BASE_URL}${END_POINTS.GET_PRODUCTS}`
    );
    const brand = container.querySelector('input[name="brand"]');
    await act(async () => {
      brand.value = 'ACME';
      brand.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      container.querySelector('form').dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true })
      );
    });
    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});
