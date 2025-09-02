import { useViewportExpansion } from '@/hooks/useViewport';

export default function TopBar() {
  const expanded = useViewportExpansion();

  return (
    <div
      className="bg-secondary text-white flex items-end justify-center"
      style={{
        height: 'var(--topbar-h)',
        paddingBottom: '2px',
      }}
    >
      <span className={`topbar-text ${expanded ? 'large' : ''}`}>
        🔥 Free Shipping
      </span>
    </div>
  );
}