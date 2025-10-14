import { useEffect } from 'react';

/**
 * Updates CSS custom property for accurate viewport height on mobile devices.
 * 
 * Mobile browsers have UI that appears/disappears (address bar, toolbars),
 * causing viewport height to change. This hook updates --vh property
 * to reflect the actual viewport height, preventing layout jumps.
 * 
 * @example
 * // In a layout component
 * useViewportHeight();
 * 
 * // Then in CSS, use:
 * // height: calc(var(--vh, 1vh) * 100);
 */
export function useViewportHeight() {
  useEffect(() => {
    function updateViewportHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Set initial value
    updateViewportHeight();

    // Update on resize and orientation change
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);
}
