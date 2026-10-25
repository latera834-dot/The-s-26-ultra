/**
 * Pure math and interpolation utilities for scroll-driven video scrubbing and parallax.
 */

/**
 * Clamps a number between min and max inclusive.
 */
export function clamp(value: number, min = 0, max = 1): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

/**
 * Calculates page scroll progress normalized from 0 to 1.
 */
export function calculateScrollProgress(
  scrollY: number,
  totalHeight: number,
  viewportHeight: number
): number {
  const maxScroll = totalHeight - viewportHeight;
  if (maxScroll <= 0) return 0;
  return clamp(scrollY / maxScroll, 0, 1);
}

/**
 * Exponential decay smoothing for video playhead:
 * current += (target - current) * (1 - Math.exp(-dt * decayRate))
 *
 * @param current Current smoothed playhead time (seconds)
 * @param target Target playhead time mapped from scroll progress (seconds)
 * @param dt Delta time in seconds
 * @param decayRate Smoothing factor (default 8 as specified)
 */
export function smoothPlayhead(
  current: number,
  target: number,
  dt: number,
  decayRate = 8
): number {
  if (dt <= 0 || Number.isNaN(dt)) return current;
  const alpha = 1 - Math.exp(-dt * decayRate);
  const next = current + (target - current) * alpha;
  // Snap when extremely close to avoid infinite micro-steps
  if (Math.abs(target - next) < 0.00005) {
    return target;
  }
  return next;
}

export interface ParallaxState {
  opacity: number;
  translateY: number; // in pixels
  scale: number;
  isActive: boolean;
}

/**
 * Computes smooth parallax opacity, translateY, and scale for a section
 * given the global scroll progress [0, 1].
 *
 * Handles edge cases:
 * - First section (start === 0) starts fully visible at progress 0 and fades out when scrolling away.
 * - Last section (end >= 0.99) fades in and stays visible at the end of the scroll.
 * - Middle sections fade in, remain visible, and fade out.
 */
export function calculateSectionParallax(
  progress: number,
  start: number,
  end: number,
  fadeFraction = 0.25
): ParallaxState {
  const isFirst = start === 0;
  const isLast = end >= 0.99;

  // Out of bounds check
  if (!isFirst && progress < start) {
    return {
      opacity: 0,
      translateY: 40,
      scale: 0.95,
      isActive: false,
    };
  }

  if (!isLast && progress > end) {
    return {
      opacity: 0,
      translateY: -40,
      scale: 1.05,
      isActive: false,
    };
  }

  const range = end - start;
  if (range <= 0) {
    return { opacity: 1, translateY: 0, scale: 1, isActive: true };
  }

  const local = clamp((progress - start) / range, 0, 1);

  let opacity = 1;
  let translateY = 0;
  let scale = 1;

  if (isFirst) {
    // First section: fully visible from 0 to (1 - fadeFraction), then fades out to 0
    const fadeOutStart = 1 - fadeFraction;
    if (local > fadeOutStart) {
      opacity = clamp(1 - (local - fadeOutStart) / fadeFraction, 0, 1);
    } else {
      opacity = 1;
    }
    translateY = (-local * 50) || 0; // starts at 0, drifts up as user scrolls
    scale = 1 - local * 0.05;
  } else if (isLast) {
    // Last section: fades in during first fadeFraction, then stays fully visible
    if (local < fadeFraction) {
      opacity = clamp(local / fadeFraction, 0, 1);
    } else {
      opacity = 1;
    }
    translateY = ((1 - local) * 40) || 0; // slides in from +40px to 0
    scale = 0.95 + local * 0.05;
  } else {
    // Middle section: fade in -> peak -> fade out
    if (local < fadeFraction) {
      opacity = clamp(local / fadeFraction, 0, 1);
    } else if (local > 1 - fadeFraction) {
      opacity = clamp((1 - local) / fadeFraction, 0, 1);
    } else {
      opacity = 1;
    }
    translateY = (0.5 - local) * 60; // enters at +30px, centers at 0, exits at -30px
    scale = 0.97 + Math.sin(local * Math.PI) * 0.03;
  }

  return {
    opacity,
    translateY,
    scale,
    isActive: opacity > 0.01,
  };
}

/**
 * Calculates the total fraction of video buffered from 0 to 1.
 */
export function calculateBufferedFraction(
  buffered: Array<[number, number]>,
  duration: number
): number {
  if (duration <= 0 || !buffered.length) return 0;
  let totalBuffered = 0;
  for (const [start, end] of buffered) {
    totalBuffered += Math.max(0, end - start);
  }
  return clamp(totalBuffered / duration, 0, 1);
}

/**
 * Checks if a specific target time is contained within any buffered range.
 */
export function isTimeBuffered(
  time: number,
  buffered: Array<[number, number]>,
  tolerance = 0.25
): boolean {
  if (!buffered.length) return false;
  return buffered.some(
    ([start, end]) => time >= start - tolerance && time <= end + tolerance
  );
}

/**
 * Format chapter index to two-digit string (e.g. 1 -> "01")
 */
export function formatChapter(index: number): string {
  return index.toString().padStart(2, '0');
}

