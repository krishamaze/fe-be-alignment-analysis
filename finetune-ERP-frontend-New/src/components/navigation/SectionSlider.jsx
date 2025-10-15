import { useState, useEffect, useRef, useCallback, Children } from 'react';
import {
  useScrollMode,
  SECTION_SLIDER_MODE,
} from '../layout/ScrollModeContext';
import { animateScroll } from '@/utils/animation';
import { devLog } from '@/utils/devLog';

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
 * @property {Object} [slidesPerView] - Slides per view configuration for different breakpoints
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
  const prevSlideRef = useRef(0);
  const [showHintOverlay, setShowHintOverlay] = useState(false);

  const containerRef = useRef(null);
  const slideRefs = useRef([]);

  // Refs for managing timers, touch events, and animations
  const animationRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const slidesPerGroupRef = useRef(1);
  const slidesLengthRef = useRef(0);
  const autoAdvanceTimerRef = useRef(null);

  const baseSlidesPerView = slidesPerView
    ? slidesPerView.mobile ?? slidesPerView.tablet ?? slidesPerView.desktop ?? 1
    : 1;
  const [visibleSlides, setVisibleSlides] = useState(baseSlidesPerView);

  const sliderId = sectionId ?? reelId ?? 'section-slider';

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
      clearTimeout(scrollTimeoutRef.current);
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
    (index, smooth = true) => {
      if (!containerRef.current || !slideRefs.current[index]) {
        return;
      }

      const fromIndex = currentSlide;

      // Cancel any ongoing animation before starting a new one
      if (animationRef.current) {
        devLog('[SectionSlider]:', {
          mode,
          action: 'cancel',
          fromIndex,
          toIndex: index,
          timestamp: Date.now(),
        });
        animationRef.current.cancel();
      }

      devLog('[SectionSlider]:', {
        mode,
        action: 'start',
        fromIndex,
        toIndex: index,
        timestamp: Date.now(),
      });

      const target = slideRefs.current[index];
      const to = isVertical ? target.offsetTop : target.offsetLeft;
      const axis = isVertical ? 'y' : 'x';

      if (!smooth) {
        if (axis === 'y') {
          containerRef.current.scrollTop = to;
        } else {
          containerRef.current.scrollLeft = to;
        }
        setCurrentSlide(index);
        devLog('[SectionSlider]:', {
          mode,
          action: 'end',
          fromIndex,
          toIndex: index,
          timestamp: Date.now(),
        });
        return;
      }

      // Use the custom animation utility to scroll smoothly
      animationRef.current = animateScroll({
        element: containerRef.current,
        to,
        duration: 600,
        axis,
        onComplete: () => {
          devLog('[SectionSlider]:', {
            mode,
            action: 'end',
            fromIndex,
            toIndex: index,
            timestamp: Date.now(),
          });
          animationRef.current = null;
        },
      });

      setCurrentSlide(index);
    },
    [isVertical, currentSlide, mode]
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
      let nextIndex = currentSlide + groupSize;
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
    currentSlide,
  ]);

  useEffect(() => {
    if (prevSlideRef.current !== currentSlide) {
      devLog('[SectionSlider]:', {
        mode,
        action: 'index-change',
        fromIndex: prevSlideRef.current,
        toIndex: currentSlide,
        timestamp: Date.now(),
      });
      prevSlideRef.current = currentSlide;
    }
  }, [currentSlide, mode]);

  // Effect for handling custom scroll and swipe logic
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    let swipeInProgress = false;

    // Touch event handlers for swipe gestures
    const handleTouchStart = (e) => {
      swipeInProgress = false; // Reset on new touch
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    };

    const handleTouchMove = (e) => {
      if (swipeInProgress || !touchStartRef.current.time) return;

      const deltaX = e.touches[0].clientX - touchStartRef.current.x;
      const deltaY = e.touches[0].clientY - touchStartRef.current.y;

      // Determine swipe direction only once per gesture
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        swipeInProgress = true; // Mark this swipe as handled for this gesture

        // Vertical swipe logic
        if (isVertical && Math.abs(deltaY) > Math.abs(deltaX)) {
          devLog('[SectionSlider]:', {
            mode,
            action: 'direction-detected',
            direction: 'vertical',
            timestamp: Date.now(),
          });

          if (Math.abs(deltaY) > 50) {
            const direction = deltaY > 0 ? -1 : 1;
            const nextSlide = Math.max(
              0,
              Math.min(currentSlide + direction, slides.length - 1)
            );

            if (nextSlide !== currentSlide) {
              if (animationRef.current) {
                animationRef.current.cancel();
              }
              scrollToSlide(nextSlide);
            }
          }
        } else if (!isVertical && Math.abs(deltaX) > Math.abs(deltaY)) {
          // Horizontal swipe logic - prevent vertical page scroll
          e.preventDefault();
          devLog('[SectionSlider]:', {
            mode,
            action: 'direction-detected',
            direction: 'horizontal',
            timestamp: Date.now(),
          });
        }
      }
    };

    // Prevents default scroll and implements custom snap logic for vertical mode
    const handleWheel = (e) => {
      if (!isVertical) return;
      e.preventDefault();
      if (animationRef.current) {
        animationRef.current.cancel();
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextSlide = Math.max(
        0,
        Math.min(currentSlide + direction, slides.length - 1)
      );

      if (nextSlide !== currentSlide) {
        scrollToSlide(nextSlide);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isVertical, currentSlide, slides.length, scrollToSlide, mode]);

  useEffect(() => {
    if (!showHint || !hasMultipleSlides) return;
    const hintShown = safeSessionStorage.getItem(hintStorageKey);
    if (!hintShown) setShowHintOverlay(true);
  }, [showHint, hasMultipleSlides, hintStorageKey]);

  const containerClasses = ['relative', 'h-full', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} style={style}>
      <div
        ref={containerRef}
        className={
          isVertical
            ? 'reel-vertical h-full overflow-y-hidden'
            : 'overflow-x-auto flex snap-x snap-mandatory is-horizontal-scroll-container'
        }
        style={
          isVertical
            ? {
                overscrollBehavior: 'contain',
              }
            : {
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
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
                  ? 'reel-section'
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
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-1"
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
                className={`min-w-[44px] min-h-[44px] rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 flex items-center justify-center`}
                onClick={() => scrollToSlide(startIndex)}
                aria-label={`Go to slide ${indicatorIndex + 1} of ${
                  slidesPerView
                    ? Math.ceil(slides.length / Math.max(1, visibleSlides))
                    : slides.length
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-secondary scale-125'
                      : 'bg-gray-300 group-hover:bg-gray-400'
                  }`}
                />
                <span className="sr-only">Slide {indicatorIndex + 1}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
