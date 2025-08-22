// @vitest-environment jsdom
import { describe, it, expect, afterEach, vi } from 'vitest';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import About from '../About';
import Index from '../Index';
import StoreDetails from '../StoreDetails';
import Stores from '../Stores';
import axios from 'axios';
vi.mock('axios');

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
});
