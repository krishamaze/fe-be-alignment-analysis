import { useEffect, useState } from 'react';

export default function TopBar() {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const EPSILON = 5;

    const update = () => {
      const svh = window.innerHeight; // baseline (bar visible)
      const lvh = screen.height; // max (bar hidden)
      const dvh = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;

      if (Math.abs(dvh - lvh) < EPSILON) setExpanded(true);
      else if (Math.abs(dvh - svh) < EPSILON) setExpanded(false);
    };

    update();

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', update);
      return () => window.visualViewport?.removeEventListener('resize', update);
    } else {
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
  }, []);

  return (
    <div
       className="bg-secondary text-white flex items-end justify-center fixed top-0 left-0 right-0"
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
