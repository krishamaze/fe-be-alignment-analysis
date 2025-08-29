// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import About from '../public/About';
import Contact from '../public/Contact';
import Locate from '../public/Locate';
import Legal from '../public/Legal';
import Index from '../Index';
import StoreDetails from '../internal/StoreDetails';
import Stores from '../internal/Stores';
import Spares from '../internal/Spares';
import Bookings from '../internal/Bookings';
import axios from 'axios';
import.meta.env.VITE_RECAPTCHA_SITE_KEY = 'test-site-key';
vi.mock('axios');
vi.mock('react-google-recaptcha', () => ({
  __esModule: true,
  default: () => <div data-testid="recaptcha" />,
}));
vi.mock('../../redux/hook', () => ({
  useAppSelector: () => 'system_admin',
}));
vi.mock('../../api/erpApi', () => ({
  useGetSparesQuery: () => ({ data: { content: [] }, isLoading: false }),
  useCreateSpareMutation: () => [() => {}],
  useUpdateSpareMutation: () => [() => {}],
  useDeleteSpareMutation: () => [() => {}],
  useGetBookingsQuery: () => ({ data: { content: [] }, isLoading: false }),
  useCreateBookingMutation: () => [() => {}],
  useGetIssuesQuery: () => ({ data: [], isLoading: false }),
  useGetQuestionsQuery: () => ({ data: [], isLoading: false }),
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
      createRoot(container).render(<About />);
    });
    expect(document.title).toBe('About – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Where we started');
  });

  it('sets title and description for Contact page', async () => {
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Contact />);
    });
    expect(document.title).toBe('Contact – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Reach out');
  });

  it('sets title and description for Locate page', async () => {
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Locate />);
    });
    expect(document.title).toBe('Locate – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('service branches');
  });

  it('sets title and description for Legal page', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(async () => {
      root.render(<Legal />);
    });
    await act(async () => {});
    expect(document.title).toBe('Legal Information – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Important legal information');
    await act(async () => {
      root.unmount();
    });
  });

  it('sets title and description for Brands page', async () => {
    document.title = '';
    const container = document.createElement('div');
    const root = createRoot(container);
    await act(async () => {
      root.render(<Index />);
    });
    await act(async () => {});
    expect(document.title).toBe('Brands – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Brands we service');
    await act(async () => {
      root.unmount();
    });
  });

  it('sets title and description for Stores page', async () => {
    document.title = '';
    axios.get.mockResolvedValue({ data: { content: [] } });
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Stores />);
    });
    expect(document.title).toBe('Stores – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain(
      'Browse Finetune service branches'
    );
  });

  it('sets title and description for StoreDetails page', async () => {
    document.title = '';
    axios.get.mockResolvedValue({
      data: {
        id: 1,
        store_name: 'Alpha Store',
        code: 'ST1',
        address: '123 St',
      },
    });
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
    document.title = '';
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
    document.title = '';
    const container = document.createElement('div');
    await act(async () => {
      createRoot(container).render(<Bookings />);
    });
    expect(document.title).toBe('Book a Service – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain(
      'Schedule a service booking'
    );
  });
});
