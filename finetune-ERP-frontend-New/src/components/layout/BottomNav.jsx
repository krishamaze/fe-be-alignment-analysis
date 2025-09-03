export default function BottomNav() {
  return (
    <footer
      className="bottom-nav fixed inset-x-0 z-50 h-[var(--bottombar-h,56px)] 
                 bg-surface border-t border-outline
                 flex items-center justify-around
                 transition-transform duration-300
                 pb-[env(safe-area-inset-bottom)]"
      style={{ bottom: 'env(safe-area-inset-bottom,0)' }}
    >
      {/* nav items here */}
    </footer>
  );
}
