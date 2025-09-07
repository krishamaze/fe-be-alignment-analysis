import { forwardRef } from 'react';

const TopBar = forwardRef(function TopBar(_props, ref) {
  return (
    <div
      id="topbar"
      ref={ref}
      className="bg-secondary text-white flex items-center justify-center py-0.5"
    >
      <span className="topbar-text text-xs leading-none">🔥 Free Shipping</span>
    </div>
  );
});

export default TopBar;
