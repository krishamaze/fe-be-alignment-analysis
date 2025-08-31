import TopBar from './TopBar';
import MainNav from './MainNav';
import BottomNav from './BottomNav';
import Footer from './Footer';

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="fixed top-0 left-0 w-full z-50">
        <TopBar mode="offers" />
        <MainNav />
      </header>

      {/* Page content */}
      <main className="flex-1 pt-[calc(2rem+70px)] pb-[4rem]">{children}</main>

      {/* Desktop footer */}
      <div className="hidden md:block mt-auto">
        <Footer />
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  );
}
