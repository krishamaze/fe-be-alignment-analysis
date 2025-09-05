import { Outlet } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import MainNav from '@/components/layout/MainNav';
import BottomNav from '@/components/layout/BottomNav';
import {
  ScrollModeProvider,
  useScrollMode,
} from '@/components/layout/ScrollModeContext';

function PublicLayoutInner() {
  const { handleScroll } = useScrollMode();

  return (
    <div className="h-[100dvh] bg-surface text-onSurface overflow-hidden">
      <div className="h-full relative flex flex-col">
        <TopBar />
        <MainNav />

        <main
          className="flex-1 overflow-y-auto min-h-0"
          onScroll={handleScroll}
        >
          <Outlet />
        </main>

        <BottomNav />
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
