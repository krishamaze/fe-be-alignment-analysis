import { Children, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Keyboard } from 'swiper/modules';
import { useScrollMode } from '@/components/layout/ScrollModeContext';
import useDevice from '@/hooks/useDevice';

export default function ReelLayout({ children, autoplay = false }) {
  const { setMode } = useScrollMode();
  const { isDesktop } = useDevice();
  const [autoplayActive, setAutoplayActive] = useState(false);
  const swiperRef = useRef(null);

  const slideCount = Children.count(children);
  const hasMultipleSlides = slideCount > 1;

  useEffect(() => {
    setMode('reel');
    setAutoplayActive(autoplay && hasMultipleSlides);

    return () => setMode('scroll');
  }, [setMode, autoplay, hasMultipleSlides]);

  const handleUserInteraction = () => {
    if (swiperRef.current?.autoplay && autoplayActive) {
      swiperRef.current.autoplay.stop();
      setAutoplayActive(false);
    }
  };

  return (
    <Swiper
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
      }}
      modules={[Navigation, Autoplay, Keyboard]}
      navigation={hasMultipleSlides && isDesktop}
      autoplay={
        autoplayActive ? { delay: 5000, disableOnInteraction: false } : false
      }
      keyboard={{ enabled: true }}
      allowTouchMove={true}
      slidesPerView={1}
      spaceBetween={0}
      className="h-full"
      onSlideChange={handleUserInteraction}
      onTouchStart={handleUserInteraction}
      onKeyDown={handleUserInteraction}
    >
      {Children.map(children, (child, idx) => (
        <SwiperSlide key={idx} className="flex flex-col">
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
