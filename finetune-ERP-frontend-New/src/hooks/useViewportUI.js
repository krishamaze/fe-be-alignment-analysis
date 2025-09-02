import { useEffect, useRef, useState } from 'react';

export default function useViewportUI(
  mode = 'scroll',
  keyboardThreshold = 100
) {
  const [bottomVisible, setBottomVisible] = useState(true);
  const [keyboardDocked, setKeyboardDocked] = useState(false);

  // store the smallest viewport height seen (vh-min)
  const minVhRef = useRef(window.innerHeight);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateVh = () => {
      const vh = viewport.height;

      // update min vh
      minVhRef.current = Math.min(minVhRef.current, vh);

      // expose both vars
      document.documentElement.style.setProperty('--vh', `${vh}px`); // current vh
      document.documentElement.style.setProperty('--vh-min', `${minVhRef.current}px`); // stable min vh

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

  // scroll detection (unchanged)
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
