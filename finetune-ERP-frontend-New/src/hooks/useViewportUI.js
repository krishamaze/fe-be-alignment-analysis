import { useEffect, useState } from 'react';

export default function useViewportUI(mode = 'scroll') {
  const [bottomVisible, setBottomVisible] = useState(true);
  const [keyboardDocked, setKeyboardDocked] = useState(false);

  // update --vh and detect keyboard
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateVh = () => {
      const vh = viewport.height;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setKeyboardDocked(window.innerHeight - vh > 100);
    };

    updateVh();
    viewport.addEventListener('resize', updateVh);
    window.addEventListener('orientationchange', updateVh);
    return () => {
      viewport.removeEventListener('resize', updateVh);
      window.removeEventListener('orientationchange', updateVh);
    };
  }, []);

  // scroll direction detection for bottom nav
  useEffect(() => {
    if (mode !== 'scroll') return;
    let lastY = window.scrollY;
    let timer;

    const onScroll = () => {
      const currentY = window.scrollY;
      clearTimeout(timer);
      timer = setTimeout(() => {
        setBottomVisible(currentY < lastY);
        lastY = currentY;
      }, 100);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearTimeout(timer);
    };
  }, [mode]);

  const bottomNavVisible = (() => {
    if (keyboardDocked) return false; // keyboard has highest priority
    if (mode === 'scroll') return bottomVisible; // scroll overrides mode
    return true; // paged mode defaults to visible
  })();

  return { bottomNavVisible, keyboardDocked };
}
