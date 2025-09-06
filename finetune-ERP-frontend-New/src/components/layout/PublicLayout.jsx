import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  const { isDesktop, isMobile } = useDevice();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector(
        '[data-scroll-container="true"]'
      );
      if (!scrollContainer) return;

      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      setIsFooterVisible(scrollPercentage >= 0.85);
    };

    const scrollContainer = document.querySelector(
      '[data-scroll-container="true"]'
    );
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="h-[100dvh] bg-surface text-onSurface overflow-hidden">
      <div className="h-full relative flex flex-col">
        <TopBar />
        <MainNav />

        <main
          ref={registerScrollElement}
          className="flex-1 overflow-y-auto min-h-0"
          data-scroll-container="true"
          style={{
            paddingBottom: isMobile ? 'var(--bottomnav-h, 56px)' : '0',
            scrollPaddingTop:
              'calc(var(--topbar-h,0px) + var(--mainnav-h,0px))',
          }}
        >
          <Outlet />
        </main>

        {isMobile && <BottomNav />}
      </div>

      {isDesktop && <Footer isVisible={isFooterVisible} />}
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
