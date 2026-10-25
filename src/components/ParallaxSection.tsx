import React from 'react';
import { calculateSectionParallax } from '../utils/scrollMath';
import { Sparkles, Shield, Cpu, Camera, Eye, ArrowRight } from 'lucide-react';

interface ParallaxSectionProps {
  progress: number;
  start: number;
  end: number;
  kicker: string;
  title: string;
  subtitle: string;
  tags?: string[];
  iconType?: 'shield' | 'camera' | 'cpu' | 'eye' | 'sparkles';
  verticalAlign?: 'center' | 'top' | 'bottom';
  align?: 'center' | 'left' | 'right';
  reducedMotion?: boolean;
  isLastSection?: boolean;
  onOpenPreorder?: () => void;
  onOpenSpecs?: () => void;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  progress,
  start,
  end,
  kicker,
  title,
  subtitle,
  tags,
  iconType,
  verticalAlign = 'center',
  align = 'center',
  reducedMotion = false,
  isLastSection = false,
  onOpenPreorder,
  onOpenSpecs,
}) => {
  const parallax = calculateSectionParallax(progress, start, end, 0.28);

  if (!reducedMotion && !parallax.isActive) {
    return null;
  }

  // Multi-layer parallax depth offsets for high-end cinematic feel
  const kickerOffset = reducedMotion ? 0 : parallax.translateY * 1.35;
  const titleOffset = reducedMotion ? 0 : parallax.translateY * 1.0;
  const subOffset = reducedMotion ? 0 : parallax.translateY * 0.7;
  const uiOffset = reducedMotion ? 0 : parallax.translateY * 0.45;

  const horizontalClasses =
    align === 'left'
      ? 'items-start text-left pl-6 sm:pl-16 md:pl-28'
      : align === 'right'
      ? 'items-end text-right pr-6 sm:pr-16 md:pr-28'
      : 'items-center text-center px-4 sm:px-6';

  const verticalClasses =
    verticalAlign === 'top'
      ? 'justify-start pt-20 sm:pt-28 md:pt-36'
      : verticalAlign === 'bottom'
      ? 'justify-end pb-24 sm:pb-32 md:pb-40'
      : 'justify-center';

  const renderIcon = () => {
    switch (iconType) {
      case 'shield':
        return <Shield className="w-3.5 h-3.5 text-cyan-400" />;
      case 'camera':
        return <Camera className="w-3.5 h-3.5 text-blue-400" />;
      case 'cpu':
        return <Cpu className="w-3.5 h-3.5 text-indigo-400" />;
      case 'eye':
        return <Eye className="w-3.5 h-3.5 text-violet-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-amber-300" />;
    }
  };

  return (
    <div
      className={`fixed inset-0 flex flex-col pointer-events-none select-none z-10 transition-opacity duration-150 ${verticalClasses} ${horizontalClasses}`}
      style={{
        opacity: reducedMotion ? 1 : parallax.opacity,
        willChange: 'transform, opacity',
      }}
      aria-hidden={!parallax.isActive}
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center px-3 py-2 text-center">
        {/* Kicker with Liquid Glass micro-badge */}
        <div
          className="flex items-center gap-2 mb-3"
          style={{
            transform: `translate3d(0, ${kickerOffset}px, 0)`,
            willChange: 'transform',
          }}
        >
          <span className="p-1 rounded-full liquid-glass-pill flex items-center justify-center">
            {renderIcon()}
          </span>
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-neutral-300 drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
            {kicker}
          </p>
        </div>

        {/* Title: Responsive fluid sizing optimized for Android and desktop */}
        <h2
          className="text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-3 sm:mb-4 drop-shadow-[0_4px_24px_rgba(0,0,0,1)] drop-shadow-[0_8px_48px_rgba(0,0,0,0.95)] max-w-3xl"
          style={{
            fontFamily: 'var(--font-display)',
            transform: `translate3d(0, ${titleOffset}px, 0) scale(${
              reducedMotion ? 1 : parallax.scale
            })`,
            willChange: 'transform',
          }}
        >
          {title}
        </h2>

        {/* Subtitle */}
        <p
          className="text-sm sm:text-lg md:text-xl font-light text-neutral-200 max-w-xl text-center drop-shadow-[0_2px_14px_rgba(0,0,0,1)] drop-shadow-[0_4px_28px_rgba(0,0,0,0.9)] mb-5"
          style={{
            transform: `translate3d(0, ${subOffset}px, 0)`,
            willChange: 'transform',
          }}
        >
          {subtitle}
        </p>

        {/* Liquid Glass UI Tags (Middle & Early Sections) */}
        {tags && tags.length > 0 && !isLastSection && (
          <div
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-1 pointer-events-auto"
            style={{
              transform: `translate3d(0, ${uiOffset}px, 0)`,
              willChange: 'transform',
            }}
          >
            {tags.map((tag) => (
              <span
                key={tag}
                className="liquid-glass-pill px-3 py-1 text-[11px] sm:text-xs text-white/90 font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Last Section Finale Card with Developer Credit & Pre-Order */}
        {isLastSection && (
          <div
            className="w-full max-w-md mx-auto mt-4 p-5 sm:p-6 rounded-3xl liquid-glass-elevated border border-white/20 text-white shadow-2xl pointer-events-auto"
            style={{
              transform: `translate3d(0, ${uiOffset}px, 0)`,
              willChange: 'transform',
            }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
              <button
                onClick={onOpenPreorder}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white text-black font-semibold text-xs sm:text-sm hover:bg-neutral-200 transition-all shadow-lg shadow-white/20 flex items-center justify-center gap-2 active:scale-95 min-h-[44px]"
              >
                <span>Reserve S26 Ultra</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSpecs}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full liquid-glass text-white font-medium text-xs sm:text-sm hover:bg-white/10 transition-all active:scale-95 min-h-[44px]"
              >
                Full Architecture
              </button>
            </div>

            {/* Prominent Developer Credit at the end of the website */}
            <div className="pt-4 border-t border-white/10 flex flex-col items-center justify-center text-center">
              <div className="liquid-glass-pill px-4 py-1.5 rounded-full border border-white/15 shadow-sm inline-flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
                  Developer: Latera Markos
                </span>
              </div>
              <p className="text-[11px] text-white/50 mt-2">
                Samsung Galaxy S26 Ultra · Flagship Parallax Experience
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
