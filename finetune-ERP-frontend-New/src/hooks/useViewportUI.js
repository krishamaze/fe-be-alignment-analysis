import { useEffect, useState } from 'react';

export default function useViewportUI(
  mode = 'scroll',
  keyboardThreshold = 100
) {
  const [bottomVisible, setBottomVisible] = useState(true);
  const [keyboardDocked, setKeyboardDocked] = useState(false);

  // update --vh and detect keyboard
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateVh = () => {
      const vh = viewport.height;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setKeyboardDocked(window.innerHeight - vh > keyboardThreshold);
    };

    updateVh();
    viewport.addEventListener('resize', updateVh);
    window.addEventListener('orientationchange', updateVh);
    return () => {
      viewport.removeEventListener('resize', updateVh);
      window.removeEventListener('orientationchange', updateVh);
    };
  }, [keyboardThreshold]);

  // scroll direction detection for bottom nav
  useEffect(() => {
    if (mode !== 'scroll') return;
    let lastY = window.scrollY;
    let ticking = false;

    const onScroll = () => {
      const currentY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setBottomVisible(currentY < lastY);
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [mode]);

  // ✅ Priority rule: keyboard > scroll > mode
  const bottomNavVisible = (() => {
    if (keyboardDocked) return false;        // hide if keyboard
    if (mode === 'scroll') return bottomVisible; // scroll up/down intent
    return true;                             // paged mode always visible
  })();

  return { bottomNavVisible };
}
