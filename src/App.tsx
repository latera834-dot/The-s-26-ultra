/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { ParallaxSection } from './components/ParallaxSection';
import { HeaderNav } from './components/HeaderNav';
import { LiquidGlassControls } from './components/LiquidGlassControls';
import { SpecsModal } from './components/SpecsModal';
import { PreorderModal } from './components/PreorderModal';
import {
  calculateScrollProgress,
  smoothPlayhead,
  calculateBufferedFraction,
} from './utils/scrollMath';

const VIDEO_SRC =
  'https://res.cloudinary.com/yaeekv3y/video/upload/v1792890072/8bb0bf13c7764cdf9233206bbd91be46.mp4';

interface SectionConfig {
  start: number;
  end: number;
  kicker: string;
  title: string;
  subtitle: string;
  tags: string[];
  iconType: 'shield' | 'camera' | 'cpu' | 'eye' | 'sparkles';
  verticalAlign: 'center' | 'top' | 'bottom';
  align?: 'center' | 'left' | 'right';
  isLastSection?: boolean;
}

const SECTIONS: SectionConfig[] = [
  {
    start: 0.0,
    end: 0.22,
    kicker: 'GALAXY S26 ULTRA',
    title: 'Titanium Monolith',
    subtitle: 'Sculpted from aerospace grade 5 titanium.',
    tags: ['Grade 5 Titanium', '8.2mm Profile', 'Integrated S Pen'],
    iconType: 'shield',
    verticalAlign: 'center',
  },
  {
    start: 0.22,
    end: 0.44,
    kicker: 'OPTICAL ARCHITECTURE',
    title: '200MP Quad Tele',
    subtitle: 'Next-generation periscope with lossless precision.',
    tags: ['200MP Adaptive Sensor', '50MP Periscope', '100x Space Zoom'],
    iconType: 'camera',
    verticalAlign: 'top',
  },
  {
    start: 0.44,
    end: 0.66,
    kicker: 'NEURAL ENGINE',
    title: 'Snapdragon 8 Elite Gen 2',
    subtitle: 'On-device intelligence forged for instant reality.',
    tags: ['3nm GAA Architecture', '+45% NPU Compute', 'Ray Tracing Gen 3'],
    iconType: 'cpu',
    verticalAlign: 'center',
  },
  {
    start: 0.66,
    end: 0.88,
    kicker: 'DYNAMIC AMOLED 2X',
    title: '3,200 Nits Vision',
    subtitle: 'Anti-reflective armor glass with edge-to-edge clarity.',
    tags: ['6.9" Flat AMOLED', '1-120Hz LTPO', 'Gorilla Armor 2'],
    iconType: 'eye',
    verticalAlign: 'top',
  },
  {
    start: 0.88,
    end: 1.0,
    kicker: 'THE NEW STANDARD',
    title: 'Galaxy S26 Ultra',
    subtitle: 'Beyond the horizon.',
    tags: ['Titanium Finishes', 'Galaxy AI Suite', '5,000 mAh All-Day'],
    iconType: 'sparkles',
    verticalAlign: 'center',
    isLastSection: true,
  },
];

export default function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const targetProgressRef = useRef<number>(0);
  const currentPlayheadRef = useRef<number>(0);
  const durationRef = useRef<number>(0);
  const pendingTimeRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  const [renderProgress, setRenderProgress] = useState<number>(0);
  const [bufferedFraction, setBufferedFraction] = useState<number>(0);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [isSpecsOpen, setIsSpecsOpen] = useState<boolean>(false);
  const [isPreorderOpen, setIsPreorderOpen] = useState<boolean>(false);

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Active chapter determination
  const activeChapterIndex = Math.min(
    SECTIONS.length - 1,
    Math.max(
      0,
      SECTIONS.findIndex(
        (sec) => renderProgress >= sec.start && renderProgress <= sec.end
      ) !== -1
        ? SECTIONS.findIndex(
            (sec) => renderProgress >= sec.start && renderProgress <= sec.end
          )
        : renderProgress < SECTIONS[0].end
        ? 0
        : SECTIONS.length - 1
    )
  );

  // Track reduced motion system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  // Update buffer fraction for network monitoring
  const updateBufferState = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    const ranges: Array<[number, number]> = [];
    for (let i = 0; i < video.buffered.length; i++) {
      ranges.push([video.buffered.start(i), video.buffered.end(i)]);
    }

    const fraction = calculateBufferedFraction(ranges, video.duration);
    setBufferedFraction(fraction);
  }, []);

  // Initialize and pause video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const handleLoadedMetadata = () => {
      video.pause();
      if (video.duration && !Number.isNaN(video.duration)) {
        durationRef.current = video.duration;
      }
      if (video.currentTime === 0) {
        try {
          video.currentTime = 0.001;
        } catch {
          // ignore
        }
      }
      updateBufferState();
    };

    const handlePlayAttempt = () => {
      video.pause();
    };

    const handleWaiting = () => setIsBuffering(true);
    const handleCanPlay = () => setIsBuffering(false);

    const handleSeeked = () => {
      setIsBuffering(false);
      if (pendingTimeRef.current !== null && videoRef.current) {
        const nextTime = pendingTimeRef.current;
        pendingTimeRef.current = null;
        if (Math.abs(videoRef.current.currentTime - nextTime) > 0.002) {
          try {
            videoRef.current.currentTime = nextTime;
          } catch {
            // ignore
          }
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlayAttempt);
    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('progress', updateBufferState);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('canplay', handleCanPlay);

    if (video.readyState >= 1 && video.duration) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlayAttempt);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('progress', updateBufferState);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [updateBufferState]);

  // Scroll listener to compute normalized progress [0, 1]
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const innerHeight = window.innerHeight;
      const progress = calculateScrollProgress(scrollY, scrollHeight, innerHeight);
      targetProgressRef.current = progress;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Smooth playhead animation loop (decoupled from network latency)
  useEffect(() => {
    let rafId: number;

    const animate = (now: DOMHighResTimeStamp) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (reducedMotion) {
        if (videoRef.current && videoRef.current.currentTime !== 0) {
          videoRef.current.currentTime = 0;
        }
        setRenderProgress(0);
      } else {
        const duration = durationRef.current;
        const targetProgress = targetProgressRef.current;
        const targetTime = duration > 0 ? targetProgress * duration : 0;

        // Formula: current += (target - current) * (1 - Math.exp(-dt * 8))
        const smoothed = smoothPlayhead(
          currentPlayheadRef.current,
          targetTime,
          dt,
          8
        );
        currentPlayheadRef.current = smoothed;

        // Scrub video currentTime with non-blocking seek queue
        const video = videoRef.current;
        if (video && duration > 0) {
          if (Math.abs(video.currentTime - smoothed) > 0.002) {
            if (!video.seeking) {
              try {
                video.currentTime = smoothed;
              } catch {
                // Ignore fast seeks
              }
            } else {
              pendingTimeRef.current = smoothed;
            }
          }
        }

        const normalizedProgress = duration > 0 ? smoothed / duration : targetProgress;
        setRenderProgress(normalizedProgress);
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  // Chapter jump navigation handlers
  const scrollToChapter = (chapterIndex: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetScroll = (chapterIndex / (SECTIONS.length - 1)) * totalHeight;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  const handlePrevChapter = () => {
    if (activeChapterIndex > 0) {
      scrollToChapter(activeChapterIndex - 1);
    }
  };

  const handleNextChapter = () => {
    if (activeChapterIndex < SECTIONS.length - 1) {
      scrollToChapter(activeChapterIndex + 1);
    }
  };

  const handleSeekProgress = (fraction: number) => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: fraction * totalHeight,
      behavior: 'smooth',
    });
  };

  return (
    <main className="relative w-full bg-black text-white min-h-[550vh] selection:bg-white selection:text-black">
      {/* Floating Liquid Glass Top Navigation */}
      <HeaderNav
        activeChapter={activeChapterIndex}
        onSelectChapter={scrollToChapter}
        onOpenSpecs={() => setIsSpecsOpen(true)}
        onOpenPreorder={() => setIsPreorderOpen(true)}
      />

      {/* Full-viewport muted video that scrubs with scroll */}
      <video
        ref={videoRef}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover pointer-events-none z-0"
        style={{ objectFit: 'cover' }}
        aria-label="Samsung Galaxy S26 Ultra cinematic 3D demonstration"
      />

      {/* Atmospheric vignette layer for contrast */}
      <div className="fixed inset-0 pointer-events-none z-[1] cinematic-vignette" />

      {/* 5 Parallax Sections with Liquid Glass UI & original text content */}
      {SECTIONS.map((section, idx) => (
        <ParallaxSection
          key={idx}
          progress={renderProgress}
          start={section.start}
          end={section.end}
          kicker={section.kicker}
          title={section.title}
          subtitle={section.subtitle}
          tags={section.tags}
          iconType={section.iconType}
          verticalAlign={section.verticalAlign}
          align={section.align}
          reducedMotion={reducedMotion}
          isLastSection={section.isLastSection}
          onOpenPreorder={() => setIsPreorderOpen(true)}
          onOpenSpecs={() => setIsSpecsOpen(true)}
        />
      ))}

      {/* Floating Bottom Liquid Glass Scrubber Controls */}
      <LiquidGlassControls
        progress={renderProgress}
        bufferedFraction={bufferedFraction}
        activeChapter={activeChapterIndex}
        totalChapters={SECTIONS.length}
        chapterTitle={SECTIONS[activeChapterIndex]?.title || 'Galaxy S26 Ultra'}
        isBuffering={isBuffering}
        onPrevChapter={handlePrevChapter}
        onNextChapter={handleNextChapter}
        onSeekProgress={handleSeekProgress}
      />

      {/* Technical Specifications Liquid Glass Modal */}
      <SpecsModal
        isOpen={isSpecsOpen}
        onClose={() => setIsSpecsOpen(false)}
        onPreorder={() => setIsPreorderOpen(true)}
      />

      {/* Pre-Order Liquid Glass Reservation Modal */}
      <PreorderModal
        isOpen={isPreorderOpen}
        onClose={() => setIsPreorderOpen(false)}
      />
    </main>
  );
}
