import { useScrollMode } from '@/components/layout/ScrollModeContext';
import useDevice from '@/hooks/useDevice';

export default function PageSection({
  children,
  className = '',
  style = {},
  ...props
}) {
  const { mode } = useScrollMode();
  const { isMobile } = useDevice();

  const height = mode === 'reel' ? 'h-full' : 'min-h-screen';

  const reelPadding =
    mode === 'reel' && isMobile ? 'pb-[var(--bottomnav-h,0px)]' : '';

  return (
    <section
      className={`w-full ${height} ${reelPadding} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </section>
  );
}
