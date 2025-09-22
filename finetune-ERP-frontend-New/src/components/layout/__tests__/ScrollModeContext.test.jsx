// @vitest-environment jsdom
import { renderHook, act } from '@testing-library/react';
import { vi, test, expect } from 'vitest';
import {
  ScrollModeProvider,
  useScrollMode,
  SECTION_SLIDER_MODE,
} from '@/components/layout/ScrollModeContext';

vi.stubGlobal('requestAnimationFrame', (cb) => cb());

test('mode change resets bottom nav visibility', () => {
  const wrapper = ({ children }) => (
    <ScrollModeProvider>{children}</ScrollModeProvider>
  );
  const { result } = renderHook(() => useScrollMode(), { wrapper });
  act(() => result.current.setMode(SECTION_SLIDER_MODE));
  expect(result.current.bottomNavVisible).toBe(true);
  act(() => result.current.setMode('scroll'));
  expect(result.current.mode).toBe('scroll');
});

test('scrolling hides and shows bottom nav', () => {
  const wrapper = ({ children }) => (
    <ScrollModeProvider>{children}</ScrollModeProvider>
  );
  const { result } = renderHook(() => useScrollMode(), { wrapper });
  const el = document.createElement('div');
  act(() => {
    result.current.registerScrollElement(el);
  });
  act(() => {
    el.scrollTop = 250;
    el.dispatchEvent(new Event('scroll'));
  });
  expect(result.current.bottomNavVisible).toBe(false);
  act(() => {
    el.scrollTop = 0;
    el.dispatchEvent(new Event('scroll'));
  });
  expect(result.current.bottomNavVisible).toBe(true);
});
