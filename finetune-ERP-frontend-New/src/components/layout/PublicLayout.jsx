import TopBar from './TopBar';
import MainNav from './MainNav';
import BottomNav from './BottomNav';
import Footer from './Footer';
import PageSection from '@/components/common/PageSection';

export default function PublicLayout({ children }) {
  return (
    // Use min-h-full so the root expands to the initial containing block
    <div className="flex flex-col min-h-full">
      {/* Fixed header positioned to slide under address bar */}
      <header 
        className="fixed inset-x-0 w-screen z-50"
        style={{
          top: 'calc(-1 * var(--address-bar-height, 0px))',
          transition: 'top 0.3s ease',
        }}
      >
        <TopBar />
      </header>
      <MainNav />

      {/* Page content with header offset */}
      <PageSection
        withBottom
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
      <BottomNav />
    </div>
  );
}
