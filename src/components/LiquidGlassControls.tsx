import React from 'react';
import { ChevronUp, ChevronDown, Wifi, Sparkles } from 'lucide-react';
import { formatChapter } from '../utils/scrollMath';

interface LiquidGlassControlsProps {
  progress: number;
  bufferedFraction: number;
  activeChapter: number;
  totalChapters: number;
  chapterTitle: string;
  isBuffering: boolean;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  onSeekProgress: (targetFraction: number) => void;
}

export const LiquidGlassControls: React.FC<LiquidGlassControlsProps> = ({
  progress,
  bufferedFraction,
  activeChapter,
  totalChapters,
  chapterTitle,
  isBuffering,
  onPrevChapter,
  onNextChapter,
  onSeekProgress,
}) => {
  const percent = Math.round(progress * 100);
  const bufferedPercent = Math.round(bufferedFraction * 100);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const target = x / rect.width;
    onSeekProgress(target);
  };

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-30 p-3 sm:p-5 pointer-events-none safe-pb"
      aria-label="Interactive timeline controls"
    >
      <div className="max-w-xl mx-auto pointer-events-auto">
        <div className="liquid-glass-elevated rounded-2xl p-2.5 sm:p-3 shadow-2xl transition-all">
          {/* Top Info Bar */}
          <div className="flex items-center justify-between text-xs px-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono font-semibold text-white/90">
                {formatChapter(activeChapter + 1)} / {formatChapter(totalChapters)}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-white/80 font-medium tracking-wider uppercase text-[11px] truncate max-w-[140px] sm:max-w-xs">
                {chapterTitle}
              </span>
            </div>

            {/* Network / Buffer State indicator */}
            <div className="flex items-center gap-2 text-[11px] text-white/50">
              {isBuffering ? (
                <span className="flex items-center gap-1.5 text-amber-300/90 animate-pulse">
                  <Wifi className="w-3 h-3 animate-spin" />
                  <span>Buffering...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 opacity-70">
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span>{percent}%</span>
                </span>
              )}
            </div>
          </div>

          {/* Liquid Glass Interactive Scrub Track */}
          <div
            onClick={handleTrackClick}
            className="group relative h-2.5 sm:h-3 w-full bg-white/10 hover:bg-white/15 rounded-full cursor-pointer overflow-hidden transition-all"
            role="slider"
            aria-label="Timeline scrubber"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            tabIndex={0}
          >
            {/* Network Buffer Indicator (Gray/Blue background) */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-white/20 transition-[width] duration-300 ease-out"
              style={{ width: `${bufferedPercent}%` }}
              title={`Network Buffer: ${bufferedPercent}%`}
            />

            {/* Active Playhead Progress */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-400 via-indigo-300 to-white shadow-[0_0_12px_rgba(255,255,255,0.7)] transition-[width] duration-75"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Quick Step Buttons for mobile & Android thumb reachability */}
          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-white/5 px-1 text-xs">
            <button
              onClick={onPrevChapter}
              disabled={activeChapter === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/10 active:scale-95 transition-all min-h-[36px]"
              aria-label="Previous Section"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Prev</span>
            </button>

            {/* Chapter Pill Dots */}
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalChapters }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => onSeekProgress(i / (totalChapters - 1))}
                  className={`h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white ${
                    activeChapter === i
                      ? 'w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'w-1.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Jump to Chapter ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={onNextChapter}
              disabled={activeChapter === totalChapters - 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white/70 hover:text-white disabled:opacity-30 disabled:pointer-events-none hover:bg-white/10 active:scale-95 transition-all min-h-[36px]"
              aria-label="Next Section"
            >
              <span className="hidden xs:inline">Next</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
