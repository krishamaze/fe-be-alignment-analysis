import { useState, useEffect, useRef, useCallback, Children } from 'react';
import {
  useScrollMode,
  SECTION_SLIDER_MODE,
} from '../layout/ScrollModeContext';

import SwipeHint from './SwipeHint';

/**
 * @typedef {Object} SectionSliderProps
 * @property {import('react').ReactNode} children
 * @property {string} [sectionId]
 * @property {string} [reelId]
 * @property {boolean} [showHint]
 * @property {string} [className]
 * @property {import('react').CSSProperties} [style]
 * @property {'horizontal' | 'vertical'} [mode]
 * @property {{ mobile?: number, tablet?: number, desktop?: number }} [slidesPerView]
 * @property {boolean} [autoAdvanceGroup]
 */

const safeSessionStorage = {
  getItem: (key) => {
    try {
      return typeof window !== 'undefined' ? sessionStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(key, value);
      }
    } catch {
      /* noop */
    }
  },
};

/**
 * @param {SectionSliderProps} props
 */
export default function SectionSlider({
  children,
  sectionId,
  reelId,
  showHint = true,
  className = '',
  style = {},
  mode = 'horizontal',
  slidesPerView,
  autoAdvanceGroup = false,
}) {
  const { setMode } = useScrollMode();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showHintOverlay, setShowHintOverlay] = useState(false);
  const [isBlockingHorizontalSwipe, setIsBlockingHorizontalSwipe] =
    useState(false);
  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const observerRef = useRef(null);
  const currentSlideRef = useRef(0);
  const updateTimeoutRef = useRef(null);
  const verticalSettleTimeoutRef = useRef(null);
  const isBlockingHorizontalSwipeRef = useRef(false);
  const touchStartRef = useRef({ x: 0, y: 0 });
  const hasVerticalIntentRef = useRef(false);
  const slidesPerGroupRef = useRef(1);
  const slidesLengthRef = useRef(0);
  const autoAdvanceTimerRef = useRef(null);

  const baseSlidesPerView = slidesPerView
    ? slidesPerView.mobile ?? slidesPerView.tablet ?? slidesPerView.desktop ?? 1
    : 1;
  const [visibleSlides, setVisibleSlides] = useState(baseSlidesPerView);

  const sliderId = sectionId ?? reelId ?? 'section-slider';

  const setSlideDebounced = useCallback((index) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(() => {
      const totalSlides = slidesLengthRef.current;
      if (!totalSlides) return;

      const clampedIndex = Math.max(0, Math.min(index, totalSlides - 1));
      const groupSize = Math.max(1, slidesPerGroupRef.current);
      const normalizedIndex =
        groupSize > 1
          ? Math.floor(clampedIndex / groupSize) * groupSize
          : clampedIndex;

      if (normalizedIndex !== currentSlideRef.current) {
        setCurrentSlide(normalizedIndex);
      }
    }, 50);
  }, []);

  const blockHorizontalSwipe = useCallback(() => {
    if (!isBlockingHorizontalSwipeRef.current) {
      isBlockingHorizontalSwipeRef.current = true;
      setIsBlockingHorizontalSwipe(true);
    }

    if (verticalSettleTimeoutRef.current) {
      clearTimeout(verticalSettleTimeoutRef.current);
    }

    verticalSettleTimeoutRef.current = setTimeout(() => {
      isBlockingHorizontalSwipeRef.current = false;
      setIsBlockingHorizontalSwipe(false);
    }, 200);
  }, []);

  const resolveSlidesPerView = useCallback(() => {
    if (!slidesPerView) return 1;
    const { mobile, tablet, desktop } = slidesPerView;
    const mobileFallback = mobile ?? tablet ?? desktop ?? 1;

    if (typeof window === 'undefined') {
      return mobileFallback;
    }

    const width = window.innerWidth;
    if (width >= 1024) {
      return desktop ?? tablet ?? mobile ?? 1;
    }
    if (width >= 768) {
      return tablet ?? desktop ?? mobile ?? 1;
    }
    return mobileFallback;
  }, [slidesPerView]);

  useEffect(() => {
    slidesPerGroupRef.current = Math.max(1, visibleSlides);
  }, [visibleSlides]);

  useEffect(
    () => () => {
      clearTimeout(updateTimeoutRef.current);
      clearTimeout(verticalSettleTimeoutRef.current);
      if (autoAdvanceTimerRef.current) {
        clearInterval(autoAdvanceTimerRef.current);
      }
    },
    []
  );

  const slides = Children.toArray(children);
  slidesLengthRef.current = slides.length;
  const hasMultipleSlides = slides.length > 1;
  const isVertical = mode === 'vertical';
  const hintStorageKey = `sectionHintShown-${mode}-${sliderId}`;

  const scrollToSlide = useCallback(
    (index) => {
      if (!containerRef.current || !slideRefs.current[index]) return;
      const target = slideRefs.current[index];
      if (isVertical) {
        containerRef.current.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth',
        });
        return;
      }

      containerRef.current.scrollTo({
        left: target.offsetLeft,
        behavior: 'smooth',
      });
    },
    [isVertical]
  );

  useEffect(() => {
    if (!slidesPerView) {
      setVisibleSlides(1);
      return undefined;
    }

    const updateSlidesPerView = () => {
      setVisibleSlides(resolveSlidesPerView());
    };

    updateSlidesPerView();

    if (typeof window === 'undefined') return undefined;

    window.addEventListener('resize', updateSlidesPerView);
    window.addEventListener('orientationchange', updateSlidesPerView);

    return () => {
      window.removeEventListener('resize', updateSlidesPerView);
      window.removeEventListener('orientationchange', updateSlidesPerView);
    };
  }, [slidesPerView, resolveSlidesPerView]);

  useEffect(() => {
    setMode(SECTION_SLIDER_MODE);
    return () => setMode('scroll');
  }, [setMode]);

  useEffect(() => {
    if (!autoAdvanceGroup || isVertical || !slidesPerView) return undefined;

    const groupSize = Math.max(1, slidesPerGroupRef.current);
    if (!containerRef.current || slides.length <= groupSize) return undefined;

    const advance = () => {
      const totalSlides = slidesLengthRef.current;
      if (!containerRef.current || !totalSlides) return;

      const maxIndex = Math.max(0, totalSlides - groupSize);
      let nextIndex = currentSlideRef.current + groupSize;
      if (nextIndex > maxIndex) {
        nextIndex = 0;
      }
      scrollToSlide(nextIndex);
    };

    const interval = setInterval(advance, 6000);
    autoAdvanceTimerRef.current = interval;

    return () => {
      clearInterval(interval);
      autoAdvanceTimerRef.current = null;
    };
  }, [
    autoAdvanceGroup,
    isVertical,
    slides.length,
    slidesPerView,
    visibleSlides,
    scrollToSlide,
  ]);

  useEffect(() => {
    if (!containerRef.current || isVertical) return undefined;

    const container = containerRef.current;

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      hasVerticalIntentRef.current = false;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
      const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

      if (!hasVerticalIntentRef.current && deltaY > deltaX && deltaY > 6) {
        hasVerticalIntentRef.current = true;
      }

      if (hasVerticalIntentRef.current) {
        blockHorizontalSwipe();
      }
    };

    const handleTouchEnd = () => {
      if (hasVerticalIntentRef.current) {
        blockHorizontalSwipe();
        hasVerticalIntentRef.current = false;
      }
    };

    container.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: true,
    });
    container.addEventListener('touchend', handleTouchEnd, {
      passive: true,
    });
    container.addEventListener('touchcancel', handleTouchEnd, {
      passive: true,
    });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isVertical, blockHorizontalSwipe]);

  useEffect(() => {
    if (!showHint || !hasMultipleSlides) return;
    const hintShown = safeSessionStorage.getItem(hintStorageKey);
    if (!hintShown) setShowHintOverlay(true);
  }, [showHint, hasMultipleSlides, hintStorageKey]);

  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  useEffect(() => {
    if (
      !hasMultipleSlides ||
      !containerRef.current ||
      typeof IntersectionObserver === 'undefined'
    )
      return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const slideIndex = parseInt(entry.target.dataset.slideIndex);
            setSlideDebounced(slideIndex);
          }
        });
      },
      { root: containerRef.current, threshold: [0.6], rootMargin: '0px' }
    );

    const observer = observerRef.current;
    const slideElements = [...slideRefs.current];

    slideElements.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => {
      slideElements.forEach((slide) => {
        if (slide) observer.unobserve(slide);
      });
      observer.disconnect();
    };
  }, [hasMultipleSlides, setSlideDebounced]);

  const shouldBlockHorizontalSwipe = !isVertical && isBlockingHorizontalSwipe;

  const containerClasses = ['relative', isVertical ? 'h-full' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} style={style}>
      <div
        ref={containerRef}
        className={
          isVertical
            ? 'reel-vertical h-full overflow-y-auto snap-y snap-mandatory'
            : 'overflow-x-auto flex snap-x snap-mandatory'
        }
        style={
          isVertical
            ? {
                overscrollBehavior: 'contain',
              }
            : {
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                ...(shouldBlockHorizontalSwipe
                  ? { touchAction: 'pan-y', overflowX: 'hidden' }
                  : {}),
              }
        }
      >
        {slides.map((slide, index) => {
          const slidesInView = Math.max(1, visibleSlides);
          const slideWidth = `${100 / slidesInView}%`;
          return (
            <div
              key={index}
              ref={(el) => (slideRefs.current[index] = el)}
              className={
                isVertical
                  ? 'reel-section snap-start'
                  : 'reel-section flex-shrink-0 snap-start-x'
              }
              style={
                !isVertical && slidesPerView
                  ? {
                      width: slideWidth,
                      flexBasis: slideWidth,
                    }
                  : undefined
              }
              data-slide-index={index}
            >
              {slide}
            </div>
          );
        })}
      </div>

      {showHint && hasMultipleSlides && (
        <SwipeHint
          show={showHintOverlay}
          mode={mode}
          onDismiss={() => {
            setShowHintOverlay(false);
            safeSessionStorage.setItem(hintStorageKey, 'true');
          }}
        />
      )}

      {hasMultipleSlides && (
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3"
          role="tablist"
          aria-label={`${sliderId} slides`}
        >
          {(slidesPerView
            ? Array.from(
                {
                  length: Math.ceil(slides.length / Math.max(1, visibleSlides)),
                },
                (_, groupIndex) => groupIndex * Math.max(1, visibleSlides)
              )
            : slides.map((_, index) => index)
          ).map((startIndex, indicatorIndex) => {
            const groupSize = Math.max(1, visibleSlides);
            const isActive = slidesPerView
              ? currentSlide >= startIndex &&
                currentSlide < startIndex + groupSize
              : currentSlide === startIndex;
            return (
              <button
                key={startIndex}
                role="tab"
                aria-selected={isActive}
                className={`w-4 h-4 min-w-[44px] min-h-[44px] rounded-full transition-all duration-300 focus:outline-none focus:ri
ng-2 focus:ring-secondary focus:ring-offset-2 flex items-center justify-center ${
                  isActive
                    ? 'bg-secondary scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => scrollToSlide(startIndex)}
                aria-label={`Go to slide ${indicatorIndex + 1} of ${
                  slidesPerView
                    ? Math.ceil(slides.length / Math.max(1, visibleSlides))
                    : slides.length
                }`}
              >
                <span className="sr-only">Slide {indicatorIndex + 1}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
