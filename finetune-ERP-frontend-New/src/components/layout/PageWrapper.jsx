import { useEffect } from 'react';
import { useScrollMode } from '@/components/layout/ScrollModeContext';

export default function PageWrapper({ mode = 'scroll', children }) {
  const { setMode, registerScrollElement } = useScrollMode();

  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

  if (mode === 'reel') {
    return (
      <div className="h-full overflow-hidden">
        <div
          className="h-full overflow-y-auto snap-y snap-mandatory fullpage-scrolling"
          data-scroll-container="true"
          ref={(el) => registerScrollElement && registerScrollElement(el)}
          style={{
            scrollBehavior: 'auto',
            scrollSnapStop: 'always',
            paddingTop: 'calc(var(--topbar-h, 0px) + var(--mainnav-h, 0px))',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        paddingTop: 'calc(var(--topbar-h, 0px) + var(--mainnav-h, 0px))',
      }}
    >
      {children}
    </div>
  );
}
