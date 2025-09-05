import { useEffect } from 'react';
import { useScrollMode } from '@/components/layout/ScrollModeContext';

export default function PageWrapper({ mode = 'scroll', children }) {
  const { setMode } = useScrollMode();

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  const style =
    mode === 'reel'
      ? {
          paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0))',
        }
      : undefined;

  return <div style={style}>{children}</div>;
}
