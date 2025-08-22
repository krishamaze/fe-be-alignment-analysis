// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { act } from 'react-dom/test-utils';
import ReactDOM from 'react-dom/client';
import About from '../About';

afterEach(() => {
  document.head.innerHTML = '';
});

describe('SEO meta tags', () => {
  it('sets title and description for About page', () => {
    const root = document.createElement('div');
    act(() => {
      ReactDOM.createRoot(root).render(<About />);
    });
    expect(document.title).toBe('About – Finetune');
    const desc = document.head.querySelector("meta[name='description']");
    expect(desc.getAttribute('content')).toContain('Where we started');
  });
});
