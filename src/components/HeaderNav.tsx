import React from 'react';

interface HeaderNavProps {
  activeChapter: number;
  onSelectChapter: (chapterIndex: number) => void;
  onOpenSpecs: () => void;
  onOpenPreorder: () => void;
}

const CHAPTER_NAMES = [
  'Monolith',
  'Optics',
  'Silicon',
  'Display',
  'Horizon',
];

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeChapter,
  onSelectChapter,
  onOpenSpecs,
  onOpenPreorder,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3 sm:py-4 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Monogram in Liquid Glass */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => onSelectChapter(0)}
            className="flex items-center gap-2 group text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-lg p-1"
            aria-label="Scroll to Galaxy S26 Ultra Hero"
          >
            <span className="font-bold tracking-[0.22em] text-sm text-white group-hover:text-white/80 transition-colors">
              SAMSUNG
            </span>
            <span className="text-white/30 text-xs font-light">/</span>
            <span className="text-xs tracking-wider text-neutral-300 font-medium">
              S26 ULTRA
            </span>
          </button>
        </div>

        {/* Desktop Chapter Navigation Tabs */}
        <nav
          className="hidden md:flex items-center gap-1 p-1.5 rounded-full liquid-glass pointer-events-auto shadow-2xl"
          aria-label="Section chapters"
        >
          {CHAPTER_NAMES.map((name, idx) => {
            const isActive = activeChapter === idx;
            return (
              <button
                key={name}
                onClick={() => onSelectChapter(idx)}
                className={`px-3.5 py-1 text-xs font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-sm font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-[10px] opacity-60 mr-1.5">0{idx + 1}</span>
                {name}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          <button
            onClick={onOpenSpecs}
            className="px-3 sm:px-4 py-1.5 text-xs font-medium text-neutral-300 hover:text-white liquid-glass rounded-full transition-all hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Specs
          </button>

          <button
            onClick={onOpenPreorder}
            className="px-3.5 sm:px-5 py-1.5 text-xs font-semibold text-black bg-white hover:bg-neutral-200 rounded-full transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Pre-Order
          </button>
        </div>
      </div>
    </header>
  );
};
