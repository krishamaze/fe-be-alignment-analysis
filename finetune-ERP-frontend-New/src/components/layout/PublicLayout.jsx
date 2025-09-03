import { Outlet } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import MainNav from '@/components/MainNav';
import BottomNav from '@/components/BottomNav';
import { useEffect } from 'react';
import { updateViewportVars, handleKeyboard } from '@/utils/viewport';
import DebugCopyButton from '@/components/common/DebugCopyButton';

export default function PublicLayout() {
  useEffect(() => {
    // initialize viewport vars
    updateViewportVars();
    // listen for resize / keyboard
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
      {/* Top filler + optional TopBar */}
      <header
        className="fixed inset-x-0 z-50"
        style={{ top: 'var(--addressbar-fill, 0px)' }}
      >
        <TopBar />
        <MainNav />
      </header>

      {/* Page content */}
      <main className="pt-[calc(var(--addressbar-fill,0px)+var(--topbar-h,0px)+var(--mainnav-h))] pb-[var(--bottombar-h,0px)]">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <BottomNav />

      {/* Floating debug copy button */}
      <DebugCopyButton />
    </div>
  );
}
