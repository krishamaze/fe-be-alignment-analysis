import { useCallback, useEffect, useRef, useState } from 'react';
import { devLog } from '@/utils/devLog';
import {
  useScrollMode,
  SECTION_SLIDER_MODE,
} from '@/components/layout/ScrollModeContext';
import HeroReel from '@/components/reels/HeroReel';
import QuickActionsReel from '@/components/reels/QuickActionsReel';
import TestimonialsReel from '@/components/reels/TestimonialsReel';

// SEO metadata moved to dedicated module per React 19 guidelines
export { metadata } from './IndexMeta';

// Cubic easing for smooth animations
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const REEL_CONFIG = [
  { id: 'hero', component: HeroReel, enabled: true },
  { id: 'quickActions', component: QuickActionsReel, enabled: true },
  { id: 'testimonials', component: TestimonialsReel, enabled: true },
];

export default function Index() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const wheelDelta = useRef(0);
  const { scrollElement, setMode } = useScrollMode();

  useEffect(() => {
    setMode(SECTION_SLIDER_MODE);
    return () => setMode('scroll');
  }, [setMode]);

  const activeReels = REEL_CONFIG.filter((reel) => reel.enabled);
  const sectionsCount = activeReels.length;

  useEffect(() => {
    if (currentSection >= sectionsCount) {
      setCurrentSection(Math.max(0, sectionsCount - 1));
    }
  }, [sectionsCount, currentSection]);

  const scrollToSection = useCallback(
    (sectionIndex, duration = 600) => {
      const container = scrollElement;

      console.log('[Index.jsx Scroll Debug]:', {
        from: currentSection,
        to: sectionIndex,
        reason: 'scrollToSection called',
        eventType: 'programmatic',
        timestamp: Date.now(),
      });

      if (!container) {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: sectionIndex,
          reason: 'scroll blocked: no container',
          eventType: 'programmatic',
          timestamp: Date.now(),
        });
        return;
      }
      if (isScrolling) {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: sectionIndex,
          reason: 'scroll blocked: isScrolling',
          eventType: 'programmatic',
          timestamp: Date.now(),
        });
        return;
      }
      if (sectionIndex < 0 || sectionIndex >= sectionsCount) {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: sectionIndex,
          reason: 'scroll blocked: invalid section index',
          eventType: 'programmatic',
          timestamp: Date.now(),
          sectionsCount,
        });
        return;
      }


      setIsScrolling(true);

      // Preserve existing nav height calculation
      const navHeight =
        (parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--topbar-h'
          )
        ) || 0) +
        (parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            '--mainnav-h'
          )
        ) || 0);

      const sectionHeight = window.innerHeight - navHeight;
      const targetScroll = sectionIndex * sectionHeight;
      const startScroll = container.scrollTop;
      const distance = targetScroll - startScroll;
      const startTime = performance.now();

      // Accessibility support
      const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;
      const animationDuration = prefersReducedMotion ? 0 : duration;

      devLog('Scrolling to section', {
        sectionIndex,
        sectionHeight,
        targetScroll,
        startScroll,
        navHeight,
      });

      // Smooth animation loop
      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        const easedProgress = easeInOutCubic(progress);

        container.scrollTop = startScroll + distance * easedProgress;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          setCurrentSection(sectionIndex);
          setIsScrolling(false);
          devLog('Scroll completed', { sectionIndex });
        }
      };

      requestAnimationFrame(animateScroll);
    },
    [scrollElement, isScrolling, sectionsCount]
  );

  useEffect(() => {
    const container = scrollElement;
    if (!container) return;

    const isDesktop = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches;
    if (!isDesktop) return;

    const handleWheel = (e) => {
      console.log('[Index.jsx Scroll Debug]:', {
        from: currentSection,
        to: null,
        reason: 'handleWheel triggered',
        eventType: e.type,
        timestamp: Date.now(),
        deltaY: e.deltaY,
      });
      // If the event target is inside a horizontal slider, ignore the event
      if (e.target.closest('.is-horizontal-scroll-container')) {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: null,
          reason: 'scroll ignored: horizontal scroll container',
          eventType: e.type,
          timestamp: Date.now(),
        });
        return;
      }

      if (isScrolling) {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: null,
          reason: 'scroll ignored: isScrolling',
          eventType: e.type,
          timestamp: Date.now(),
        });
        e.preventDefault();
        e.stopPropagation();
        return;
      }

      // Always prevent default to avoid bubbling conflicts
      e.preventDefault();
      e.stopPropagation();

      const deltaY = e.deltaY;
      wheelDelta.current += deltaY;

      // Cross-platform adaptive threshold
      const threshold = Math.max(10, Math.abs(deltaY) * 0.5);
      if (Math.abs(wheelDelta.current) < threshold) {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: null,
          reason: 'scroll ignored: delta threshold not met',
          eventType: e.type,
          timestamp: Date.now(),
          wheelDelta: wheelDelta.current,
          threshold,
        });
        return;
      }

      const direction = wheelDelta.current > 0 ? 1 : -1;
      wheelDelta.current = 0;

      let nextSection = currentSection;
      if (direction > 0 && currentSection < sectionsCount - 1) {
        nextSection = currentSection + 1;
      } else if (direction < 0 && currentSection > 0) {
        nextSection = currentSection - 1;
      }

      if (nextSection !== currentSection) {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: nextSection,
          eventType: e.type,
          timestamp: Date.now(),
          direction,
        });
        devLog('Wheel scroll triggered', {
          from: currentSection,
          to: nextSection,
        });
        scrollToSection(nextSection);
      }
    };

    container.addEventListener('wheel', handleWheel, {
      passive: false,
      capture: true,
    });

    return () =>
      container.removeEventListener('wheel', handleWheel, { capture: true });
  }, [
    scrollElement,
    currentSection,
    isScrolling,
    sectionsCount,
    scrollToSection,
  ]);

  useEffect(() => {
    const container = scrollElement;
    if (!container) return;

    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      console.log('[Index.jsx Scroll Debug]:', {
        from: currentSection,
        to: null,
        reason: 'handleTouchEnd triggered',
        eventType: e.type,
        timestamp: Date.now(),
      });
      // If the event target is inside a horizontal slider, ignore the event
      if (e.target.closest('.is-horizontal-scroll-container')) {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: null,
          reason: 'scroll ignored: horizontal scroll container',
          eventType: e.type,
          timestamp: Date.now(),
        });
        return;
      }

      if (isScrolling) {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: null,
          reason: 'scroll ignored: isScrolling',
          eventType: e.type,
          timestamp: Date.now(),
        });
        return;
      }

      const touchDuration = Date.now() - touchStartTime;
      if (touchDuration < 50) {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: null,
          reason: 'scroll ignored: touch duration too short',
          eventType: e.type,
          timestamp: Date.now(),
          touchDuration,
        });
        return;
      }

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      const minSwipeDistance = 50;

      if (Math.abs(deltaY) > minSwipeDistance) {
        let nextSection = currentSection;

        if (deltaY > 0 && currentSection < sectionsCount - 1) {
          nextSection = currentSection + 1;
        } else if (deltaY < 0 && currentSection > 0) {
          nextSection = currentSection - 1;
        }

        if (nextSection !== currentSection) {
          console.log('[Index.jsx Scroll Debug]:', {
            from: currentSection,
            to: nextSection,
            eventType: e.type,
            timestamp: Date.now(),
            deltaY,
          });
          devLog('Touch scroll triggered', {
            from: currentSection,
            to: nextSection,
          });
          scrollToSection(nextSection);
        }
      } else {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: null,
          reason: 'scroll ignored: swipe distance too short',
          eventType: e.type,
          timestamp: Date.now(),
          deltaY,
          minSwipeDistance,
        });
      }
    };

    container.addEventListener('touchstart', handleTouchStart, {
      passive: true,
    });
    container.addEventListener('touchend', handleTouchEnd, {
      passive: true,
    });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [
    scrollElement,
    currentSection,
    isScrolling,
    sectionsCount,
    scrollToSection,
  ]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      console.log('[Index.jsx Scroll Debug]:', {
        from: currentSection,
        to: null,
        reason: 'handleKeyDown triggered',
        eventType: e.type,
        timestamp: Date.now(),
        key: e.key,
      });
      if (isScrolling) {
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: null,
          reason: 'scroll ignored: isScrolling',
          eventType: e.type,
          timestamp: Date.now(),
        });
        return;
      }

      let nextSection = currentSection;

      if (e.key === 'ArrowDown' && currentSection < sectionsCount - 1) {
        nextSection = currentSection + 1;
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        nextSection = currentSection - 1;
      }

      if (nextSection !== currentSection) {
        e.preventDefault();
        console.log('[Index.jsx Scroll Debug]:', {
          from: currentSection,
          to: nextSection,
          eventType: e.type,
          timestamp: Date.now(),
          key: e.key,
        });
        devLog('Keyboard scroll triggered', {
          from: currentSection,
          to: nextSection,
        });
        scrollToSection(nextSection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, isScrolling, sectionsCount, scrollToSection]);

  return (
    <>
      {/* Metadata is provided via IndexMeta.js */}
      {activeReels.map((reel) => {
        const Component = reel.component;
        return <Component key={reel.id} />;
      })}
      <nav
        className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-3"
        role="tablist"
        aria-label="Page sections"
      >
        {activeReels.map((reel, index) => (
          <button
            key={reel.id}
            onClick={() => {
              console.log('[Index.jsx Scroll Debug]:', {
                from: currentSection,
                to: index,
                eventType: 'click',
                timestamp: Date.now(),
              });
              scrollToSection(index);
            }}
            disabled={isScrolling}
            role="tab"
            aria-selected={currentSection === index}
            className={`section-indicator w-3 h-3 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-keyline focus:ring-offset-2 ${
              currentSection === index
                ? 'bg-secondary border-keyline'
                : 'bg-transparent border-surface hover:border-keyline disabled:opacity-50'
            }`}
            aria-label={`Go to ${reel.id} section (${index + 1} of ${sectionsCount})`}
          />
        ))}
      </nav>
    </>
  );
}
