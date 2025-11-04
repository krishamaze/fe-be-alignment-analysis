import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useDevice() {
  const queries = useMemo(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return null;
    }
    try {
      const mobile = window.matchMedia('(max-width: 767px)');
      const desktop = window.matchMedia('(min-width: 768px)');
      const touch = window.matchMedia('(pointer: coarse)');
      if (!mobile || !desktop || !touch) return null;
      return { mobile, desktop, touch };
    } catch (err) {
      console.warn('useDevice: matchMedia failed', err);
      return null;
    }
  }, []);

  const getInfo = useCallback(() => {
    if (!queries) {
      return { isMobile: false, isDesktop: true, hasTouch: false };
    }
    return {
      isMobile: queries.mobile.matches,
      isDesktop: queries.desktop.matches,
      hasTouch: queries.touch.matches,
    };
  }, [queries]);

  const [state, setState] = useState(getInfo);

  useEffect(() => {
    if (!queries) return;
    const handler = () => setState(getInfo());
    handler();
    queries.mobile.addEventListener('change', handler);
    queries.desktop.addEventListener('change', handler);
    queries.touch.addEventListener('change', handler);
    window.addEventListener('resize', handler);
    return () => {
      queries.mobile.removeEventListener('change', handler);
      queries.desktop.removeEventListener('change', handler);
      queries.touch.removeEventListener('change', handler);
      window.removeEventListener('resize', handler);
    };
  }, [queries, getInfo]);

  return state;
}
