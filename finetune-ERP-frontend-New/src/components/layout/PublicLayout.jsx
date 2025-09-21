import { Outlet } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
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
  const { mode, registerScrollElement, scrollElement } = useScrollMode();
  const { isDesktop, isMobile } = useDevice();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    if (!scrollElement) {
      setIsFooterVisible(false);
      return undefined;
    }

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      setIsFooterVisible(scrollPercentage >= 0.85);
    };

    handleScroll();

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [scrollElement]);

  const navOffset =
    'calc(var(--topbar-h, 0px) + var(--navbar-h, var(--mainnav-h, 0px)))';

  const mainStyles = useMemo(
    () => ({
      paddingBottom: isMobile ? 'var(--bottomnav-h, 56px)' : '0',
      paddingTop: navOffset,
      scrollPaddingTop: navOffset,
      ...(mode === 'reel'
        ? {
            scrollBehavior: 'auto',
            scrollSnapStop: 'always',
          }
        : {}),
    }),
    [isMobile, mode, navOffset],
  );

  return (
    <div className="h-[100dvh] bg-surface text-onSurface overflow-hidden">
      <div className="h-full relative flex flex-col">
        <TopBar />
        <MainNav />

        <main
          ref={registerScrollElement}
          data-scroll-container="true"
          className={`flex-1 min-h-0 ${
            mode === 'reel'
              ? 'overflow-y-auto snap-y snap-mandatory fullpage-scrolling'
              : 'overflow-y-auto'
          }`}
          style={mainStyles}
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
