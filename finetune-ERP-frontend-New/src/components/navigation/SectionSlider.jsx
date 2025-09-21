import { useState, useEffect, useRef, useCallback, Children } from 'react';
import { useScrollMode } from '../layout/ScrollModeContext';

import SwipeHint from './SwipeHint';

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

export default function SectionSlider({
  children,
  reelId,
  showHint = true,
  className = '',
  style = {},
  mode = 'horizontal',
}) {
  const { setMode } = useScrollMode();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showHintOverlay, setShowHintOverlay] = useState(false);
  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const observerRef = useRef(null);
  const currentSlideRef = useRef(0);
  const updateTimeoutRef = useRef(null);

  const setSlideDebounced = useCallback((index) => {
    if (updateTimeoutRef.current) clearTimeout(updateTimeoutRef.current);
    updateTimeoutRef.current = setTimeout(() => {
      if (index !== currentSlideRef.current) {
        setCurrentSlide(index);
      }
    }, 50);
  }, []);

  useEffect(() => () => clearTimeout(updateTimeoutRef.current), []);

  const slides = Children.toArray(children);
  const hasMultipleSlides = slides.length > 1;
  const isVertical = mode === 'vertical';
  const hintStorageKey = `reelHintShown-${mode}-${reelId}`;

  useEffect(() => {
    setMode('reel');
    return () => setMode('scroll');
  }, [setMode]);

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

  const containerClasses = [
    'relative',
    isVertical ? 'h-full' : 'min-h-[var(--fullpage-section-h,100vh)]',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} style={style}>
      <div
        ref={containerRef}
        className={
          isVertical
            ? 'reel-vertical h-full overflow-y-auto snap-y snap-mandatory'
            : 'min-h-[var(--fullpage-section-h,100vh)] overflow-x-auto flex snap-x snap-mandatory'
        }
        style={
          isVertical
            ? {
                overscrollBehavior: 'contain',
              }
            : { scrollbarWidth: 'none', msOverflowStyle: 'none' }
        }
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            ref={(el) => (slideRefs.current[index] = el)}
            className={
              isVertical
                ? 'reel-section snap-start'
                : 'reel-section flex-shrink-0 snap-start-x w-full'
            }
            data-slide-index={index}
          >
            {slide}
          </div>
        ))}
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
          aria-label={`${reelId} slides`}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              role="tab"
              aria-selected={currentSlide === index}
              className={`w-4 h-4 min-w-[44px] min-h-[44px] rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 flex items-center justify-center ${
                currentSlide === index
                  ? 'bg-secondary scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => scrollToSlide(index)}
              aria-label={`Go to slide ${index + 1} of ${slides.length}`}
            >
              <span className="sr-only">Slide {index + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
