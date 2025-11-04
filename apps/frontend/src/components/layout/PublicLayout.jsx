import { Outlet } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import TopBar from '@/components/layout/TopBar';
import MainNav from '@/components/layout/MainNav';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import useDevice from '@/hooks/useDevice';
import { useViewportHeight } from '@/hooks/useViewportHeight';
import {
  ScrollModeProvider,
  useScrollMode,
  SECTION_SLIDER_MODE,
} from '@/components/layout/ScrollModeContext';

function PublicLayoutInner() {
  const { mode, registerScrollElement, scrollElement } = useScrollMode();
  const { isDesktop, isMobile } = useDevice();
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  
  // Update viewport height for mobile devices
  useViewportHeight();

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
      scrollPaddingTop: navOffset,
      ...(mode === SECTION_SLIDER_MODE
        ? {
            paddingTop: 0,
            scrollBehavior: 'auto',
            scrollSnapStop: 'always',
          }
        : {
            paddingTop: navOffset,
          }),
    }),
    [isMobile, mode, navOffset],
  );

  return (
    <div className="h-[100dvh] bg-surface text-onSurface overflow-hidden">
      <div className="h-full relative flex flex-col">
        {/* Skip to main content link for keyboard users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-surface focus:px-4 focus:py-2 focus:rounded focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
        >
          Skip to main content
        </a>
        
        <TopBar />
        <MainNav />

        <main
          id="main-content"
          ref={registerScrollElement}
          data-scroll-container="true"
          className={`flex-1 min-h-0 ${
            mode === SECTION_SLIDER_MODE
              ? // Disable native scroll snapping when SectionSlider is active
                // to allow its custom JS-based scroll logic to take over.
                'overflow-y-auto fullpage-scrolling'
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
