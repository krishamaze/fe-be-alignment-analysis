import { Outlet } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import MainNav from '@/components/layout/MainNav';
import BottomNav from '@/components/layout/BottomNav';
import { useEffect } from 'react';
import { updateViewportVars, handleKeyboard } from '@/utils/viewport';
import DebugCopyButton from '@/components/common/DebugCopyButton';

export default function PublicLayout() {
  useEffect(() => {
    updateViewportVars();

    window.addEventListener('resize', updateViewportVars);
    window.visualViewport?.addEventListener('resize', updateViewportVars);
    window.visualViewport?.addEventListener('resize', handleKeyboard);

    return () => {
      window.removeEventListener('resize', updateViewportVars);
      window.visualViewport?.removeEventListener('resize', updateViewportVars);
      window.visualViewport?.removeEventListener('resize', handleKeyboard);
    };
  }, []);

  return (
    <div className="relative min-h-[100dvh] bg-surface text-onSurface">
      {/* Top area: TopBar + MainNav */}
      <header className="fixed top-0 inset-x-0 z-50">
        <TopBar />
        <MainNav />
      </header>

      {/* Scrollable content with padding offsets */}
      <main
        className="
          relative
          pt-[calc(var(--topbar-h,0px)+var(--mainnav-h,0px))]
          pb-[var(--bottombar-h,0px)]
        "
      >
        <Outlet />
      </main>

      {/* Bottom navigation (always fixed to screen edge) */}
      <BottomNav />

      {/* Floating debug copy button */}
      <DebugCopyButton />
    </div>
  );
}
