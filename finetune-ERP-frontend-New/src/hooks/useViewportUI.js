import { useEffect, useState } from 'react';

export default function useViewportUI(
  mode = 'scroll',
  keyboardThreshold = 100
) {
  const [bottomVisible, setBottomVisible] = useState(true);
  const [keyboardDocked, setKeyboardDocked] = useState(false);

  useEffect(() => {
    // lock stable min height on first load
    const initHeight = window.innerHeight;
    document.documentElement.style.setProperty('--vh-min', `${initHeight}px`);
    document.documentElement.style.setProperty('--topbar-h', '40px'); // slim default

    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateVh = () => {
      const vh = viewport.height;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      // grow TopBar if viewport taller than min
      const minVh = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--vh-min'),
        10
      );

      if (vh > minVh) {
        const extra = vh - minVh;
        document.documentElement.style.setProperty(
          '--topbar-h',
          `${40 + extra}px`
        );
      } else {
        document.documentElement.style.setProperty('--topbar-h', '40px');
      }

      // keyboard detection
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

  // scroll detection for bottom nav
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

  const bottomNavVisible = (() => {
    if (keyboardDocked) return false;
    if (mode === 'scroll') return bottomVisible;
    return true;
  })();

  return { bottomNavVisible };
}
