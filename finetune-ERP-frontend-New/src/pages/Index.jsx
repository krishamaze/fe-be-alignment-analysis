import { useCallback, useEffect, useRef, useState } from 'react';
import PageWrapper from '@/components/layout/PageWrapper';
import HeroReel from '@/components/reels/HeroReel';
import QuickActionsReel from '@/components/reels/QuickActionsReel';
import TestimonialsReel from '@/components/reels/TestimonialsReel';

export default function Index() {
  const containerRef = useRef(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionsCount = 3; // Hero, QuickActions, Testimonials

  // Smooth easing function - easeInOutCubic
  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Smooth scroll to section with custom easing
  const scrollToSection = useCallback(
    (sectionIndex, duration = 600) => {
      const container = containerRef.current;
      if (!container || isScrolling) return;

      setIsScrolling(true);
      const targetScroll = sectionIndex * container.clientHeight;
      const startScroll = container.scrollTop;
      const distance = targetScroll - startScroll;
      const startTime = performance.now();

      const animateScroll = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        container.scrollTop = startScroll + distance * easedProgress;

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        } else {
          setCurrentSection(sectionIndex);
          setIsScrolling(false);
        }
      };

      requestAnimationFrame(animateScroll);
    },
    [isScrolling]
  );

  // Handle wheel events for desktop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();

      if (isScrolling) return;

      const deltaY = e.deltaY;
      let nextSection = currentSection;

      if (deltaY > 0 && currentSection < sectionsCount - 1) {
        nextSection = currentSection + 1;
      } else if (deltaY < 0 && currentSection > 0) {
        nextSection = currentSection - 1;
      }

      if (nextSection !== currentSection) {
        scrollToSection(nextSection);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentSection, isScrolling, sectionsCount, scrollToSection]);

  // Handle touch events for mobile
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let touchStartY = 0;
    let touchEndY = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isScrolling) return;

      touchEndY = e.changedTouches[0].clientY;
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
          scrollToSection(nextSection);
        }
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
  }, [currentSection, isScrolling, sectionsCount, scrollToSection]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isScrolling) return;

      let nextSection = currentSection;

      if (e.key === 'ArrowDown' && currentSection < sectionsCount - 1) {
        nextSection = currentSection + 1;
      } else if (e.key === 'ArrowUp' && currentSection > 0) {
        nextSection = currentSection - 1;
      }

      if (nextSection !== currentSection) {
        e.preventDefault();
        scrollToSection(nextSection);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSection, isScrolling, sectionsCount, scrollToSection]);

  return (
    <>
      <title>Home – Finetune</title>
      <meta
        name="description"
        content="Expert Mobile & Laptop Repairs in Coimbatore & Palakkad"
      />
      <PageWrapper mode="reel">
        <div
          ref={containerRef}
          className="h-full overflow-y-auto snap-y snap-mandatory fullpage-scrolling"
          style={{
            scrollBehavior: 'auto',
            scrollSnapStop: 'always',
          }}
        >
          <HeroReel />
          <QuickActionsReel />
          <TestimonialsReel />
        </div>

        {/* Section indicators (optional) */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
          {Array.from({ length: sectionsCount }).map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(index)}
              disabled={isScrolling}
              className={`section-indicator w-3 h-3 rounded-full border-2 ${
                currentSection === index
                  ? 'bg-secondary border-secondary'
                  : 'bg-transparent border-white hover:border-secondary'
              }`}
              aria-label={`Go to section ${index + 1}`}
            />
          ))}
        </div>
      </PageWrapper>
    </>
  );
}
