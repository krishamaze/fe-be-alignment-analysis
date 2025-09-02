import { useEffect, useRef, useState } from 'react';

export default function useViewportUI(
  mode = 'scroll',
  keyboardThreshold = 100
) {
  const [bottomVisible, setBottomVisible] = useState(true);
  const [keyboardDocked, setKeyboardDocked] = useState(false);

  // keep baseline heights in a ref (no rerenders needed)
  const baselineRef = useRef(null);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const mainNav = document.querySelector('nav'); // MainNav element
    const pageSection = document.querySelector('[data-pagesection]'); // PageSection

    if (mainNav && pageSection && !baselineRef.current) {
      baselineRef.current = {
        mainNav: mainNav.offsetHeight,
        pageSection: pageSection.offsetHeight,
      };
    }

    const updateVh = () => {
      const vh = viewport.height;
      document.documentElement.style.setProperty('--vh', `${vh}px`);

      if (baselineRef.current) {
        const { mainNav, pageSection } = baselineRef.current;
        let topbarH = vh - (mainNav + pageSection);

        // clamp to avoid collapsing too small or negative
        topbarH = Math.max(50, topbarH);
        document.documentElement.style.setProperty('--topbar-h', `${topbarH}px`);
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
