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

  const minHeight = 'calc(100dvh - var(--topbar-h,0px) - var(--mainnav-h,0px))';

  const reelPadding =
    mode === 'reel' && isMobile ? 'pb-[calc(var(--bottomnav-h,0px)+1rem)]' : '';

  return (
    <section
      className={`w-full ${reelPadding} ${className}`}
      style={{
        minHeight,
        ...style,
      }}
      {...props}
    >
      {children}
    </section>
  );
}
