import TopBar from './TopBar';
import MainNav from './MainNav';
import BottomNav from './BottomNav';
import Footer from './Footer';
import PageSection from '@/components/common/PageSection';

export default function PublicLayout({ children }) {
  return (
    // Use min-h-full so the root expands to the initial containing block for proper header behavior
    <div className="flex flex-col min-h-full">
      {/* Fixed header (TopBar + MainNav) */}
      <header className="fixed inset-x-0 top-0 w-screen z-50">
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
