import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  calculateScrollProgress,
  smoothPlayhead,
  calculateSectionParallax,
  calculateBufferedFraction,
  isTimeBuffered,
  formatChapter,
} from './scrollMath';

test('clamp restricts values to min and max', () => {
  assert.equal(clamp(0.5, 0, 1), 0.5);
  assert.equal(clamp(-0.2, 0, 1), 0);
  assert.equal(clamp(1.5, 0, 1), 1);
  assert.equal(clamp(NaN, 0, 1), 0);
});

test('calculateScrollProgress maps window scroll correctly', () => {
  assert.equal(calculateScrollProgress(0, 5000, 1000), 0);
  assert.equal(calculateScrollProgress(2000, 5000, 1000), 0.5);
  assert.equal(calculateScrollProgress(4000, 5000, 1000), 1);
  assert.equal(calculateScrollProgress(5000, 5000, 1000), 1);
  assert.equal(calculateScrollProgress(0, 1000, 1000), 0);
});

test('smoothPlayhead smoothly approaches target with exponential decay', () => {
  const current = 0;
  const target = 10;
  const dt = 0.016;
  const next = smoothPlayhead(current, target, dt, 8);

  assert.ok(next > 0, 'Playhead should advance towards target');
  assert.ok(next < target, 'Playhead should not overshoot target');
  assert.ok(Math.abs(next - 1.202) < 0.02, `Expected ~1.202, got ${next}`);

  // Test snap when very close
  const nearTarget = smoothPlayhead(9.99998, 10, 0.1, 8);
  assert.equal(nearTarget, 10, 'Should snap to target when within threshold');

  // Test dt <= 0 returns current
  assert.equal(smoothPlayhead(5, 10, 0, 8), 5);
});

test('calculateSectionParallax handles initial hero section', () => {
  // Hero section starting at 0
  const initial = calculateSectionParallax(0, 0, 0.22);
  assert.equal(initial.opacity, 1, 'Initial hero should be fully visible at progress 0');
  assert.equal(initial.isActive, true);
  assert.equal(initial.translateY, 0, 'Initial hero should start at translateY 0');

  // Hero section fading out near end of its range
  const fadingOut = calculateSectionParallax(0.2, 0, 0.22);
  assert.ok(fadingOut.opacity < 1, 'Hero should fade out near its boundary');
  assert.ok(fadingOut.translateY < 0, 'Hero should drift up as user scrolls down');
});

test('calculateSectionParallax handles middle sections', () => {
  const start = 0.22;
  const end = 0.44;

  const before = calculateSectionParallax(0.1, start, end);
  assert.equal(before.opacity, 0);
  assert.equal(before.isActive, false);

  const middle = calculateSectionParallax(0.33, start, end);
  assert.equal(middle.opacity, 1);
  assert.equal(middle.isActive, true);
  assert.ok(Math.abs(middle.translateY) < 1);

  const after = calculateSectionParallax(0.5, start, end);
  assert.equal(after.opacity, 0);
  assert.equal(after.isActive, false);
});

test('calculateSectionParallax handles final section', () => {
  const finalStart = 0.88;
  const finalEnd = 1.0;

  const atBottom = calculateSectionParallax(1.0, finalStart, finalEnd);
  assert.equal(atBottom.opacity, 1, 'Final section should remain fully visible at bottom of page');
  assert.equal(atBottom.isActive, true);
  assert.equal(atBottom.translateY, 0);
});

test('calculateBufferedFraction calculates percentage properly', () => {
  assert.equal(calculateBufferedFraction([], 12), 0);
  assert.equal(calculateBufferedFraction([[0, 6]], 12), 0.5);
  assert.equal(calculateBufferedFraction([[0, 3], [6, 9]], 12), 0.5);
  assert.equal(calculateBufferedFraction([[0, 12]], 12), 1);
});

test('isTimeBuffered correctly evaluates time within ranges', () => {
  const ranges: Array<[number, number]> = [[0, 5], [8, 12]];
  assert.equal(isTimeBuffered(2.5, ranges), true);
  assert.equal(isTimeBuffered(7.0, ranges), false);
  assert.equal(isTimeBuffered(8.1, ranges), true);
  assert.equal(isTimeBuffered(0, []), false);
});

test('formatChapter formats 1 to 01', () => {
  assert.equal(formatChapter(1), '01');
  assert.equal(formatChapter(5), '05');
  assert.equal(formatChapter(12), '12');
});

