import TopBar from './TopBar';
import MainNav from './MainNav';
import BottomNav from './BottomNav';
import Footer from './Footer';
import useViewportUI from '@/hooks/useViewportUI';

export default function PublicLayout({ children, mode = 'scroll' }) {
  const { bottomNavVisible, keyboardDocked } = useViewportUI(mode);

  return (
    <div className="flex flex-col min-h-[var(--vh)]">
      <header className="fixed top-0 left-0 w-full z-50">
        <TopBar mode="offers" />
        <MainNav />
      </header>

      {/* Page content */}
      <main
        className={`flex-1 pt-[calc(var(--topbar-h)+var(--mainnav-h))] ${
          mode === 'paged' ? 'pb-[var(--bottombar-h)]' : ''
        }`}
        style={{
          minHeight: 'calc(var(--vh) - var(--topbar-h) - var(--mainnav-h))',
        }}
      >
        {children}
      </main>

      {/* Desktop footer */}
      <div className="hidden md:block mt-auto">
        <Footer />
      </div>

      {/* Mobile bottom nav */}
      <BottomNav visible={bottomNavVisible} keyboardDocked={keyboardDocked} />
    </div>
  );
}
