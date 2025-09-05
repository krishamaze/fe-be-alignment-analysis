import { useEffect } from 'react';
import { useScrollMode } from '@/components/layout/ScrollModeContext';

export default function PageWrapper({ mode = 'scroll', children }) {
  const { setMode } = useScrollMode();

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  return <div>{children}</div>;
}
