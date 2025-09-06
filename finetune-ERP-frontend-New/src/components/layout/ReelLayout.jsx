import { Children, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Keyboard } from 'swiper/modules';
import { useScrollMode } from '@/components/layout/ScrollModeContext';
import useDevice from '@/hooks/useDevice';

export default function ReelLayout({ children, autoplay = false }) {
  const { setMode } = useScrollMode();
  const { isDesktop } = useDevice();

  useEffect(() => {
    setMode('reel');
    return () => setMode('scroll');
  }, [setMode]);

  return (
    <Swiper
      modules={[Navigation, Autoplay, Keyboard]}
      navigation={isDesktop}
      keyboard={isDesktop}
      autoplay={autoplay ? { delay: 5000, disableOnInteraction: false } : false}
      allowTouchMove={!isDesktop}
      slidesPerView={1}
      className="h-full"
    >
      {Children.map(children, (child, idx) => (
        <SwiperSlide key={idx}>{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}
