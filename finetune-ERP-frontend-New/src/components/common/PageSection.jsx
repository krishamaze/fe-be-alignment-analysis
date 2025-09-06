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
    mode === 'reel' && isMobile ? 'pb-[calc(var(--bottomnav-h,0px)+1rem)]' : '';

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
