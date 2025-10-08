/**
 * @param {number} t
 * @returns {number}
 */
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * @param {{
 *  element: HTMLElement,
 *  to: number,
 *  duration: number,
 *  axis: 'x' | 'y',
 *  onComplete?: () => void
 * }} options
 * @returns {{cancel: () => void}}
 */
export function animateScroll({ element, to, duration, axis, onComplete }) {
  const start = axis === 'y' ? element.scrollTop : element.scrollLeft;
  const change = to - start;
  let startTime = null;
  let animationFrameId = null;
  let cancelled = false;

  const animate = (currentTime) => {
    if (cancelled) return;

    if (startTime === null) {
      startTime = currentTime;
    }

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    if (axis === 'y') {
      element.scrollTop = start + change * easedProgress;
    } else {
      element.scrollLeft = start + change * easedProgress;
    }

    if (elapsed < duration) {
      animationFrameId = requestAnimationFrame(animate);
    } else if (onComplete) {
      onComplete();
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  return {
    cancel: () => {
      cancelled = true;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    },
  };
}