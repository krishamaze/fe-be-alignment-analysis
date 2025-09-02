import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Custom hook to measure viewport dimensions and address bar behavior
 * Calculates exact address bar height using lvh - dvh difference
 * Tracks expansion state for responsive UI adjustments
 */
export function useViewport(options = {}) {
  const {
    debounceMs = 100,
    epsilon = 5,
    updateCSSProperties = true,
    initialMeasurement = true
  } = options;

  const [viewport, setViewport] = useState({
    addressBarHeight: 0,
    expanded: false,
    isSupported: false,
    measurements: {
      lvh: 0,  // Large viewport height (screen.height)
      svh: 0,  // Small viewport height (window.innerHeight)
      dvh: 0   // Dynamic viewport height (visualViewport.height)
    }
  });

  const debounceRef = useRef(null);
  const mountedRef = useRef(true);

  const measureViewport = useCallback(() => {
    if (!mountedRef.current) return;

    try {
      const lvh = window.screen.height;
      const svh = window.innerHeight;
      const dvh = window.visualViewport 
        ? window.visualViewport.height 
        : window.innerHeight;

      // Calculate address bar height (difference between large and dynamic viewport)
      const addressBarHeight = Math.max(0, lvh - dvh);
      
      // Determine expansion state using existing epsilon logic
      const isExpanded = Math.abs(dvh - lvh) < epsilon;
      const isCollapsed = Math.abs(dvh - svh) < epsilon;
      const expanded = isExpanded || (!isCollapsed && dvh > svh + epsilon);

      const newViewport = {
        addressBarHeight,
        expanded,
        isSupported: !!window.visualViewport,
        measurements: { lvh, svh, dvh }
      };

      // Update CSS custom properties if enabled
      if (updateCSSProperties && typeof document !== 'undefined') {
        document.documentElement.style.setProperty(
          '--address-bar-height', 
          `${addressBarHeight}px`
        );
        document.documentElement.style.setProperty(
          '--viewport-expanded', 
          expanded ? '1' : '0'
        );
      }

      setViewport(newViewport);
      
      // Optional callback for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Viewport measurements:', newViewport);
      }

    } catch (error) {
      console.error('Error measuring viewport:', error);
      
      // Fallback state
      setViewport(prev => ({
        ...prev,
        isSupported: false,
        addressBarHeight: 0,
        expanded: false
      }));
    }
  }, [epsilon, updateCSSProperties]);

  const debouncedMeasure = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(measureViewport, debounceMs);
  }, [measureViewport, debounceMs]);

  useEffect(() => {
    mountedRef.current = true;
    
    // Initial measurement
    if (initialMeasurement) {
      measureViewport();
    }

    // Set up event listeners
    let cleanup = () => {};
    
    if (typeof window !== 'undefined') {
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', debouncedMeasure);
        cleanup = () => {
          window.visualViewport?.removeEventListener('resize', debouncedMeasure);
        };
      } else {
        // Fallback for browsers without visualViewport API
        window.addEventListener('resize', debouncedMeasure);
        window.addEventListener('orientationchange', debouncedMeasure);
        cleanup = () => {
          window.removeEventListener('resize', debouncedMeasure);
          window.removeEventListener('orientationchange', debouncedMeasure);
        };
      }
    }

    return () => {
      mountedRef.current = false;
      cleanup();
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [debouncedMeasure, initialMeasurement]);

  // Expose manual measurement function for edge cases
  const remeasure = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    measureViewport();
  }, [measureViewport]);

  return {
    ...viewport,
    remeasure
  };
}

/**
 * Simplified hook that only returns address bar height
 * Useful when you only need the height measurement
 */
export function useAddressBarHeight(options = {}) {
  const { addressBarHeight } = useViewport(options);
  return addressBarHeight;
}

/**
 * Hook that returns expansion state (existing TopBar logic)
 * Drop-in replacement for your current TopBar useEffect
 */
export function useViewportExpansion(options = {}) {
  const { expanded } = useViewport(options);
  return expanded;
}