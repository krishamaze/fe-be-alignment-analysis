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
    <div className="h-[100dvh] bg-surface text-onSurface overflow-hidden">
      <div className="h-full relative flex flex-col">
        <TopBar />
        <MainNav />

        <main
          ref={registerScrollElement}
          className="flex-1 overflow-y-auto min-h-0"
          style={{
            paddingBottom: isMobile ? 'var(--bottomnav-h, 56px)' : '0',
            scrollPaddingTop:
              'calc(var(--topbar-h,0px) + var(--mainnav-h,0px))',
          }}
        >
          <Outlet />
        </main>

        {isDesktop && isHomePage && <Footer />}
        {isMobile && <BottomNav />}
      </div>
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
