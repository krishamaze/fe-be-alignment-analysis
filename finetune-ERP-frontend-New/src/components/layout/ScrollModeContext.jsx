import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  useEffect,
} from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const ScrollModeContext = createContext({
  mode: 'scroll',
  setMode: () => {},
  bottomNavVisible: true,
  scrollDirection: 'down',
  registerScrollElement: () => {},
});

export const ScrollModeProvider = ({ children }) => {
  const [mode, setMode] = useState('scroll');
  const [bottomNavVisible, setBottomNavVisible] = useState(true);
  const [scrollDirection, setScrollDirection] = useState('down');
  const [scrollEl, setScrollEl] = useState(null);
  const lastY = useRef(0);
  const lastDirection = useRef('down');
  const distance = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(
    (e) => {
      if (mode === 'reel') return;
      const current = e.target.scrollTop;
      const delta = current - lastY.current;
      const direction = delta > 0 ? 'down' : 'up';

      if (direction !== lastDirection.current) {
        distance.current = 0;
      }
      distance.current += Math.abs(delta);
      setScrollDirection(direction);

      if (current < 10) {
        setBottomNavVisible(true);
        distance.current = 0;
      } else if (
        direction === 'down' &&
        bottomNavVisible &&
        distance.current > 100
      ) {
        setBottomNavVisible(false);
        distance.current = 0;
      } else if (
        direction === 'up' &&
        !bottomNavVisible &&
        distance.current > 100
      ) {
        setBottomNavVisible(true);
        distance.current = 0;
      }

      lastY.current = current;
      lastDirection.current = direction;
    },
    [mode, bottomNavVisible]
  );

  // Keep nav visible in reel mode
  useEffect(() => {
    if (mode === 'reel') {
      setBottomNavVisible(true);
    }
    distance.current = 0;
    lastDirection.current = 'down';
    lastY.current = 0;
  }, [mode]);

  useEffect(() => {
    if (!scrollEl) return;
    const onScroll = (e) => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        handleScroll(e);
        ticking.current = false;
      });
    };

    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, [scrollEl, handleScroll]);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      bottomNavVisible,
      scrollDirection,
      registerScrollElement: setScrollEl,
    }),
    [mode, bottomNavVisible, scrollDirection]
  );

  return (
    <ScrollModeContext.Provider value={value}>
      {children}
    </ScrollModeContext.Provider>
  );
};

export const useScrollMode = () => useContext(ScrollModeContext);
