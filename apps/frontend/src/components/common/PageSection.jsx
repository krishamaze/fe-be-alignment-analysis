import {
  useScrollMode,
  SECTION_SLIDER_MODE,
} from '@/components/layout/ScrollModeContext';
import useDevice from '@/hooks/useDevice';

export default function PageSection({
  children,
  className = '',
  style = {},
  ...props
}) {
  const { mode } = useScrollMode();
  const { isMobile } = useDevice();

  const isSliderMode = mode === SECTION_SLIDER_MODE;
  const height = isSliderMode ? 'h-full' : 'min-h-screen';

  const reelPadding =
    isSliderMode && isMobile ? 'pb-[var(--bottomnav-h,0px)]' : '';

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
