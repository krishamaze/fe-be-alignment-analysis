import { useEffect, useRef } from 'react';

export default function TopBar() {
  const ref = useRef(null);

  // Measure TopBar height once and set CSS var
  useEffect(() => {
    if (ref.current) {
      const h = ref.current.offsetHeight;
      document.documentElement.style.setProperty('--topbar-h', `${h}px`);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="bg-secondary text-white flex items-end justify-center"
      style={{ paddingBottom: '2px' }}
    >
      <span className="topbar-text">
        🔥 Free Shipping
      </span>
    </div>
  );
}
