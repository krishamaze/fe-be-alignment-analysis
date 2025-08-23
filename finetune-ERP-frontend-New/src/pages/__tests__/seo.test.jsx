// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import About from '../About';
import Contact from '../Contact';
import Locate from '../Locate';
import Terms from '../Terms';
import Index from '../Index';
import StoreDetails from '../StoreDetails';
import Stores from '../Stores';
import Spares from '../Spares';
import Bookings from '../Bookings';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
vi.mock('axios');
vi.mock('react-google-recaptcha', () => ({
  __esModule: true,
  default: () => <div data-testid="recaptcha" />,
}));

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

afterEach(async () => {
  await new Promise((r) => setTimeout(r, 0));
  document.head.innerHTML = '';
  document.title = '';
  vi.resetAllMocks();
});

describe('SEO meta tags', () => {
  it('sets title and description for About page', async () => {
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <HelmetProvider>
          <About />
        </HelmetProvider>
      );
    });
    expect(document.title).toBe('About – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Where we started');
  });

  it('sets title and description for Contact page', async () => {
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <HelmetProvider>
          <Contact />
        </HelmetProvider>
      );
    });
    expect(document.title).toBe('Contact – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Reach out');
  });

  it('sets title and description for Locate page', async () => {
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <HelmetProvider>
          <Locate />
        </HelmetProvider>
      );
    });
    expect(document.title).toBe('Locate – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('service branches');
  });

  it('sets title and description for Terms page', async () => {
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <HelmetProvider>
          <Terms />
        </HelmetProvider>
      );
    });
    expect(document.title).toBe('Terms & Conditions – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Agreement for repair');
  });

  it('sets title and description for Brands page', async () => {
    document.title = '';
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Index />);
    });
    expect(document.title).toBe('Brands – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Brands we service');
  });

  it('sets title and description for Stores page', async () => {
    document.title = '';
    axios.get.mockResolvedValue({ data: { content: [] } });
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <HelmetProvider>
          <Stores />
        </HelmetProvider>
      );
    });
    expect(document.title).toBe('Stores – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Browse Finetune service branches');
  });

  it('sets title and description for StoreDetails page', async () => {
    document.title = '';
    axios.get.mockResolvedValue({ data: { id: 1, store_name: 'Alpha Store', code: 'ST1', address: '123 St' } });
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <HelmetProvider>
          <MemoryRouter initialEntries={['/stores/1']}>
            <Routes>
              <Route path="/stores/:id" element={<StoreDetails />} />
            </Routes>
          </MemoryRouter>
        </HelmetProvider>
      );
    });
    expect(document.title).toBe('Alpha Store – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Details for Alpha Store');
  });
  it('sets title and description for Spares page', async () => {
    document.title = '';
    axios.get.mockResolvedValue({ data: { content: [] } });
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <HelmetProvider>
          <Spares />
        </HelmetProvider>
      );
    });
    expect(document.title).toBe('Spares – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('spare parts pricing');
  });
  it('sets title and description for Bookings page', async () => {
    document.title = '';
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(
        <HelmetProvider>
          <Bookings />
        </HelmetProvider>
      );
    });
    expect(document.title).toBe('Book a Service – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Schedule a service booking');
  });
});
