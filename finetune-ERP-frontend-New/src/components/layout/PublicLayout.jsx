import { Outlet } from 'react-router-dom';
import TopBar from '@/components/layout/TopBar';
import MainNav from '@/components/layout/MainNav';
import BottomNav from '@/components/layout/BottomNav';
import DebugCopyButton from '@/components/common/DebugCopyButton';

export default function PublicLayout() {
  return (
    <div className="min-h-[100dvh] bg-surface text-onSurface">
      <div className="h-screen overflow-hidden relative flex flex-col">
        <TopBar />
        <MainNav />

        <main
          className="flex-1 overflow-y-auto"
          style={{
            paddingBottom: 'calc(56px + env(safe-area-inset-bottom, 0))',
          }}
        >
          <Outlet />
        </main>

        <BottomNav />
        <DebugCopyButton />
      </div>
    </div>
  );
}
