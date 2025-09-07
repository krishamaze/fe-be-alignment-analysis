import { useCallback, useEffect, useState } from 'react';
import { devLog } from '@/utils/devLog';
import PageWrapper from '@/components/layout/PageWrapper';
import HeroReel from '@/components/reels/HeroReel';
import QuickActionsReel from '@/components/reels/QuickActionsReel';
import TestimonialsReel from '@/components/reels/TestimonialsReel';

const REEL_CONFIG = [
  { id: 'hero', component: HeroReel, enabled: true },
  { id: 'quickActions', component: QuickActionsReel, enabled: true },
  { id: 'testimonials', component: TestimonialsReel, enabled: true },
];

export default function Index() {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const activeReels = REEL_CONFIG.filter((reel) => reel.enabled);
  const sectionsCount = activeReels.length;

  useEffect(() => {
    if (currentSection >= sectionsCount) {
      setCurrentSection(Math.max(0, sectionsCount - 1));
    }
  }, [sectionsCount, currentSection]);

  const easeInOutCubic = (t) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const scrollToSection = useCallback(
    (sectionIndex, duration = 600) => {
      const container = document.querySelector(
        '[data-scroll-container="true"]'
      );

      if (
        !container ||
        isScrolling ||
        sectionIndex < 0 ||
        sectionIndex >= sectionsCount
      ) {
        devLog('Scroll blocked', {
          container: !!container,
          isScrolling,
          sectionIndex,
          sectionsCount,
        });
        return;
      }

      setIsScrolling(true);

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

      devLog('Scrolling to section', {
        sectionIndex,
        sectionHeight,
        targetScroll,
        startScroll,
        navHeight,
      });

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
          devLog('Scroll completed', { sectionIndex });
        }
      };

      requestAnimationFrame(animateScroll);
    },
    [isScrolling, sectionsCount]
  );

  useEffect(() => {
    const container = document.querySelector('[data-scroll-container="true"]');
    if (!container) return;

    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isScrolling) return;

      const deltaY = e.deltaY;
      let nextSection = currentSection;

      if (deltaY > 0 && currentSection < sectionsCount - 1) {
        nextSection = currentSection + 1;
      } else if (deltaY < 0 && currentSection > 0) {
        nextSection = currentSection - 1;
      }

      if (nextSection !== currentSection) {
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
  }, [currentSection, isScrolling, sectionsCount, scrollToSection]);

  useEffect(() => {
    const container = document.querySelector('[data-scroll-container="true"]');
    if (!container) return;

    let touchStartY = 0;
    let touchStartTime = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (e) => {
      if (isScrolling) return;

      const touchDuration = Date.now() - touchStartTime;
      if (touchDuration < 50) return;

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
          devLog('Touch scroll triggered', {
            from: currentSection,
            to: nextSection,
          });
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
      <title>Home – Finetune</title>
      <meta
        name="description"
        content="Expert Mobile & Laptop Repairs in Coimbatore & Palakkad"
      />
      <PageWrapper mode="reel">
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
              onClick={() => scrollToSection(index)}
              disabled={isScrolling}
              role="tab"
              aria-selected={currentSection === index}
              className={`section-indicator w-3 h-3 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ${
                currentSection === index
                  ? 'bg-secondary border-secondary'
                  : 'bg-transparent border-white hover:border-secondary disabled:opacity-50'
              }`}
              aria-label={`Go to ${reel.id} section (${index + 1} of ${sectionsCount})`}
            />
          ))}
        </nav>
      </PageWrapper>
    </>
  );
}
