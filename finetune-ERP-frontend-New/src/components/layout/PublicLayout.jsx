import { useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import {
  ScrollModeProvider,
  useScrollMode,
} from '@/components/layout/ScrollModeContext';
import TopBar from './TopBar';
import MainNav from './MainNav';
import Footer from './Footer';
import BottomNav from './BottomNav';

function PublicLayoutInner() {
  const { mode, scrollElement } = useScrollMode();
  const topBarRef = useRef(null);
  const mainNavRef = useRef(null);

  // Measure nav heights and set CSS variables
  useLayoutEffect(() => {
    const updateNavHeight = () => {
      const topBarHeight = topBarRef.current?.offsetHeight || 0;
      const mainNavHeight = mainNavRef.current?.offsetHeight || 0;
      document.documentElement.style.setProperty(
        '--topbar-h',
        `${topBarHeight}px`
      );
      document.documentElement.style.setProperty(
        '--mainnav-h',
        `${mainNavHeight}px`
      );
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);
    return () => window.removeEventListener('resize', updateNavHeight);
  }, []);

  // Show/hide nav on scroll (only in 'scroll' mode)
  useEffect(() => {
    if (mode !== 'scroll' || !scrollElement) return;

    let lastScrollTop = 0;
    const handleScroll = () => {
      const { scrollTop } = scrollElement;
      const isScrollingDown = scrollTop > lastScrollTop;
      const topBar = topBarRef.current;

      if (topBar) {
        if (scrollTop > 200 && isScrollingDown) {
          topBar.classList.add('-translate-y-full');
        } else {
          topBar.classList.remove('-translate-y-full');
        }
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [scrollElement, mode]);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar ref={topBarRef} />
      <MainNav ref={mainNavRef} />
      <main className="flex-grow">
        <Outlet />
      </main>
      {mode === 'scroll' && <Footer />}
      <BottomNav />
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
