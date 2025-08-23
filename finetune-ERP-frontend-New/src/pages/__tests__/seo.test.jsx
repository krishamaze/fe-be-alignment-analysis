// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import About from '../About';
import Index from '../Index';
import StoreDetails from '../StoreDetails';
import Stores from '../Stores';
import Spares from '../Spares';
import Bookings from '../Bookings';
import Products from '../Products';
import ProductDetails from '../ProductDetails';
import axios from 'axios';
vi.mock('axios');
vi.mock('react-google-recaptcha', () => ({
  __esModule: true,
  default: () => <div data-testid="recaptcha" />,
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(() => {
  document.head.innerHTML = '';
  vi.resetAllMocks();
});

describe('SEO meta tags', () => {
  it('sets title and description for About page', async () => {
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<About />);
    });
    expect(document.title).toBe('About – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Where we started');
  });

  it('sets title and description for Brands page', async () => {
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Index />);
    });
    expect(document.title).toBe('Brands – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Brands we service');
  });

  it('sets title and description for Stores page', async () => {
    axios.get.mockResolvedValue({ data: { content: [] } });
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Stores />);
    });
    expect(document.title).toBe('Stores – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Browse Finetune service branches');
  });

  it('sets title and description for StoreDetails page', async () => {
    axios.get.mockResolvedValue({ data: { id: 1, store_name: 'Alpha Store', code: 'ST1', address: '123 St' } });
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <MemoryRouter initialEntries={['/stores/1']}>
          <Routes>
            <Route path="/stores/:id" element={<StoreDetails />} />
          </Routes>
        </MemoryRouter>
      );
    });
    expect(document.title).toBe('Alpha Store – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Details for Alpha Store');
  });
  it('sets title and description for Spares page', async () => {
    axios.get.mockResolvedValue({ data: { content: [] } });
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Spares />);
    });
    expect(document.title).toBe('Spares – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('spare parts pricing');
  });
  it('sets title and description for Bookings page', async () => {
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Bookings />);
    });
    expect(document.title).toBe('Book a Service – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Schedule a service booking');
  });

  it('sets title and description for Products page', async () => {
    axios.get.mockResolvedValue({ data: { content: [] } });
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Products />);
    });
    expect(document.title).toBe('Products – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Browse available products');
  });

  it('sets title and description for ProductDetails page', async () => {
    axios.get.mockResolvedValue({ data: { id: 1, name: 'Phone', brand: 'ACME', category: 'Mobile', price: '100.00', variants: [] } });
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <MemoryRouter initialEntries={['/products/1']}>
          <Routes>
            <Route path="/products/:id" element={<ProductDetails />} />
          </Routes>
        </MemoryRouter>
      );
    });
    expect(document.title).toBe('Phone – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Details for Phone');
  });
});
