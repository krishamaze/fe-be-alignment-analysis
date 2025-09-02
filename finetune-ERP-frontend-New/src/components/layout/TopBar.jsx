import { useEffect, useState } from 'react';

export default function TopBar() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const EPSILON = 5;
    const svh = window.innerHeight; // baseline (bar visible)
    const lvh = screen.height; // max (bar hidden)

    const update = () => {
      const dvh = viewport.height;
      if (Math.abs(dvh - lvh) < EPSILON) setExpanded(true);
      else if (Math.abs(dvh - svh) < EPSILON) setExpanded(false);
    };

    update();
    viewport.addEventListener('resize', update);
    return () => viewport.removeEventListener('resize', update);
  }, []);

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
