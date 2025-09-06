import { Outlet, useLocation } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import MainNav from '@/components/layout/MainNav';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import useDevice from '@/hooks/useDevice';
import {
  ScrollModeProvider,
  useScrollMode,
} from '@/components/layout/ScrollModeContext';

function PublicLayoutInner() {
  const { registerScrollElement } = useScrollMode();
  const location = useLocation();
  const { isDesktop, isMobile } = useDevice();

  const isHomePage = location.pathname === '/';

  return (
    <div className="flex flex-col min-h-screen bg-surface text-onSurface">
      <TopBar />
      <MainNav />

      <main ref={registerScrollElement} className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      {isDesktop && isHomePage && <Footer />}
      {isMobile && <BottomNav />}
    </div>
  );
}

export default function PublicLayout() {
  return (
    <ScrollModeProvider>
      <PublicLayoutInner />
    </ScrollModeProvider>
  );
}
