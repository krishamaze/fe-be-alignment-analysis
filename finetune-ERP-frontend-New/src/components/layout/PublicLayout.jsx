import TopBar from './TopBar';
import MainNav from './MainNav';
import BottomNav from './BottomNav';
import Footer from './Footer';
import useViewportUI from '@/hooks/useViewportUI';
import PageSection from '@/components/common/PageSection';

export default function PublicLayout({ children, mode = 'scroll' }) {
  const { bottomNavVisible } = useViewportUI(mode);

  return (
    <div className="flex flex-col min-h-[var(--vh)]">
      <header className="fixed top-0 left-0 w-full z-50">
        <TopBar mode="offers" />
        <MainNav />
      </header>

      {/* Page content */}
      <PageSection
        withBottom={mode === 'paged'}
        className="flex-1"
        style={{ marginTop: 'calc(var(--topbar-h) + var(--mainnav-h))' }}
      >
        {children}
      </PageSection>

      {/* Desktop footer */}
      <div className="hidden md:block mt-auto">
        <Footer />
      </div>

      {/* Mobile bottom nav */}
      <BottomNav visible={bottomNavVisible} />
    </div>
  );
}
