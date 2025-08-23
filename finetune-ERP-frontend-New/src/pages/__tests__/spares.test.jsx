// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import Spares from '../Spares';
import END_POINTS from '../../utils/Endpoints';

vi.mock('axios');
vi.mock('react-hot-toast', () => {
  const toast = () => {};
  toast.success = vi.fn();
  toast.error = vi.fn();
  return { default: toast };
});

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  vi.resetAllMocks();
});

describe('Spares page', () => {
  it('fetches list and posts new spare', async () => {
    axios.get.mockResolvedValue({ data: { content: [] } });
    axios.post.mockResolvedValue({});
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Spares />);
    });
    expect(axios.get).toHaveBeenCalledWith(
      `${END_POINTS.API_BASE_URL}${END_POINTS.GET_SPARES}`
    );
    const name = container.querySelector('input[name="name"]');
    const sku = container.querySelector('input[name="sku"]');
    const price = container.querySelector('input[name="price"]');
    await act(async () => {
      name.value = 'Seat';
      name.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      sku.value = 'ST1';
      sku.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      price.value = '20';
      price.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => {
      container
        .querySelector('form')
        .dispatchEvent(
          new Event('submit', { bubbles: true, cancelable: true })
        );
    });
    expect(axios.post).toHaveBeenCalled();
  });
});
