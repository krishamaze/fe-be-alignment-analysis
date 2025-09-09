import { useState, useEffect, useRef, useCallback, Children } from 'react';
import { useScrollMode } from './ScrollModeContext';

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

function SwipeHint({ show, onHide, reelId }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onHide();
        safeSessionStorage.setItem(`reelHintShown-${reelId}`, 'true');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onHide, reelId]);

  if (!show) return null;
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-black/70 text-white px-6 py-3 rounded-full text-sm font-medium animate-pulse">
      ← Swipe for more →
    </div>
  );
}

export default function MultiSlideReel({
  children,
  reelId,
  showHint = true,
  className = '',
  style = {},
}) {
  const { setMode } = useScrollMode();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showHintOverlay, setShowHintOverlay] = useState(false);
  const containerRef = useRef(null);
  const slideRefs = useRef([]);
  const observerRef = useRef(null);
  const currentSlideRef = useRef(0);

  const slides = Children.toArray(children);
  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    setMode('reel');
    return () => setMode('scroll');
  }, [setMode]);

  useEffect(() => {
    if (!showHint || !hasMultipleSlides) return;
    const hintShown = safeSessionStorage.getItem(`reelHintShown-${reelId}`);
    if (!hintShown) setShowHintOverlay(true);
  }, [showHint, hasMultipleSlides, reelId]);

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
            if (slideIndex !== currentSlideRef.current) {
              setCurrentSlide(slideIndex);
            }
          }
        });
      },
      { root: containerRef.current, threshold: [0.6], rootMargin: '0px' }
    );

    const observer = observerRef.current;
    slideRefs.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => {
      slideRefs.current.forEach((slide) => {
        if (slide) observer.unobserve(slide);
      });
      observer.disconnect();
    };
  }, [hasMultipleSlides]);
  const scrollToSlide = useCallback((index) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({
      left: index * containerRef.current.clientWidth,
      behavior: 'smooth',
    });
  }, []);

  if (!hasMultipleSlides) {
    return (
      <div className={`h-full ${className}`} style={style}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative h-full ${className}`} style={style}>
      <div
        ref={containerRef}
        className="h-full overflow-x-auto flex snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            ref={(el) => (slideRefs.current[index] = el)}
            className="w-full flex-shrink-0 snap-start-x"
            data-slide-index={index}
          >
            {slide}
          </div>
        ))}
      </div>

      {showHint && (
        <SwipeHint
          show={showHintOverlay}
          onHide={() => setShowHintOverlay(false)}
          reelId={reelId}
        />
      )}

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
    </div>
  );
}
