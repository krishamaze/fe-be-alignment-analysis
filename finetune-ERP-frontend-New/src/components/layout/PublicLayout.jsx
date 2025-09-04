import { Outlet } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import MainNav from '@/components/layout/MainNav';
import BottomNav from '@/components/layout/BottomNav';
import DebugCopyButton from '@/components/common/DebugCopyButton';

export default function PublicLayout() {
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
