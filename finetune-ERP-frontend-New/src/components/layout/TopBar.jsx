import { useEffect, useRef } from 'react';

export default function TopBar() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      document.documentElement.style.setProperty(
        '--topbar-h',
        `${ref.current.offsetHeight}px`
      );
    }
  }, []);

  return (
    <div
      id="topbar"
      ref={ref}
      className="bg-secondary text-white flex items-center justify-center py-0.5"
    >
      <span className="topbar-text text-xs leading-none">🔥 Free Shipping</span>
    </div>
  );
}
