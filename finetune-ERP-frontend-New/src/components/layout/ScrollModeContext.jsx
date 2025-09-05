import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export const ScrollModeContext = createContext({
  mode: 'scroll',
  setMode: () => {},
  bottomNavVisible: true,
  scrollDirection: 'down',
  handleScroll: () => {},
});

export const ScrollModeProvider = ({ children }) => {
  const [mode, setMode] = useState('scroll');
  const [bottomNavVisible, setBottomNavVisible] = useState(true);
  const [scrollDirection, setScrollDirection] = useState('down');
  const lastY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback((e) => {
    const current = e.target.scrollTop;
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const direction = current > lastY.current ? 'down' : 'up';
      setScrollDirection(direction);
      setBottomNavVisible(direction === 'up' || current < 10);
      lastY.current = current;
      ticking.current = false;
    });
  }, []);

  const value = useMemo(
    () => ({
      mode,
      setMode,
      bottomNavVisible,
      scrollDirection,
      handleScroll,
    }),
    [mode, bottomNavVisible, scrollDirection, handleScroll]
  );

  return (
    <ScrollModeContext.Provider value={value}>
      {children}
    </ScrollModeContext.Provider>
  );
};

export const useScrollMode = () => useContext(ScrollModeContext);
