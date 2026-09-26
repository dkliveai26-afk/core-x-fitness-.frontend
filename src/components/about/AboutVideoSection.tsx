'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Film, Sparkles } from 'lucide-react';

export function AboutVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoDurationRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Dedicated scroll track across 480vh for natural, uncompressed video exploration
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Stage overlays that gracefully accompany the video scrub without obscuring it
  const introOverlayOpacity = useTransform(scrollYProgress, [0, 0.04, 0.18, 0.24], [0, 1, 1, 0]);
  const introOverlayY = useTransform(scrollYProgress, [0, 0.04], [20, 0]);

  const midOverlayOpacity = useTransform(scrollYProgress, [0.38, 0.44, 0.62, 0.68], [0, 1, 1, 0]);
  const midOverlayY = useTransform(scrollYProgress, [0.38, 0.44], [20, 0]);

  const finalOverlayOpacity = useTransform(scrollYProgress, [0.84, 0.92, 1.0], [0, 1, 1]);
  const finalOverlayY = useTransform(scrollYProgress, [0.84, 0.92], [25, 0]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  // Video initialization and hardware decoder unlock
  const onVideoReady = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      videoDurationRef.current = video.duration;
      setIsVideoReady(true);

      // Prime the decoder pipeline for zero-latency seeking
      video.play().then(() => {
        video.pause();
        video.currentTime = 0;
      }).catch(() => {
        // Fallback for muted autoplay
      });
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;

    if (video.readyState >= 1) {
      onVideoReady();
    } else {
      video.addEventListener('loadedmetadata', onVideoReady);
    }

    return () => {
      video.removeEventListener('loadedmetadata', onVideoReady);
    };
  }, [onVideoReady]);

  // Ultra-responsive, seek-safe scrub engine
  useEffect(() => {
    let active = true;
    const video = videoRef.current;
    if (!video) return;

    let isSeeking = false;
    let pendingTarget: number | null = null;
    let lastDispatchedTarget = -1;

    const performSeek = (target: number) => {
      if (!active || !video) return;
      const duration = videoDurationRef.current;
      if (duration <= 0) return;

      const clampedTarget = Math.max(0, Math.min(duration - 0.001, target));

      // If already seeking, queue latest target
      if (isSeeking || video.seeking) {
        pendingTarget = clampedTarget;
        return;
      }

      // Only dispatch if target differs meaningfully from current video position
      const diff = Math.abs(video.currentTime - clampedTarget);
      if (diff > 0.01) {
        isSeeking = true;
        lastDispatchedTarget = clampedTarget;
        try {
          const vid = video as HTMLVideoElement & { fastSeek?: (time: number) => void };
          if (typeof vid.fastSeek === 'function') {
            vid.fastSeek(clampedTarget);
          } else {
            vid.currentTime = clampedTarget;
          }
        } catch {
          isSeeking = false;
        }
      }
    };

    const handleSeeked = () => {
      isSeeking = false;
      if (pendingTarget !== null) {
        const next = pendingTarget;
        pendingTarget = null;
        performSeek(next);
      }
    };

    const handleSeeking = () => {
      isSeeking = true;
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('seeking', handleSeeking);

    // RAF loop updates timeline directly in sync with scroll
    let targetTime = 0;

    const tick = () => {
      if (!active) return;

      const duration = videoDurationRef.current;
      if (video && duration > 0) {
        const rawProgress = scrollYProgress.get();

        // Maps 0.0 to 1.0 continuously to the full video duration
        const clampedProgress = Math.max(0, Math.min(1, rawProgress));
        const desiredTime = clampedProgress * (duration - 0.001);

        // Responsive, low-latency follow (0.85 factor ensures instant reaction without lag)
        const diff = desiredTime - targetTime;
        if (Math.abs(diff) < 0.005) {
          targetTime = desiredTime;
        } else {
          targetTime += diff * 0.85;
        }

        if (Math.abs(targetTime - lastDispatchedTarget) > 0.01) {
          performSeek(targetTime);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('seeking', handleSeeking);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [scrollYProgress]);

  return (
    <section
      id="about-video"
      ref={containerRef}
      className="relative h-[480vh] w-full bg-core-void select-none"
    >
      {/* Sticky Fullscreen Viewport — stays pinned while user scrolls through 480vh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-core-void flex items-center justify-center">

        {/* The Clean, Sharp, Fullscreen Video without heavy blurring filters */}
        <video
          ref={videoRef}
          src="/aboutpagevideo.mp4"
          muted
          playsInline
          preload="auto"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isVideoReady ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'contents' }}
        />

        {/* Subtle Edge Transitions to blend video smoothly into black background */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-core-void via-core-void/40 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-core-void via-core-void/60 to-transparent pointer-events-none z-10" />

        {/* Video Loading State */}
        {!isVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-core-void z-20">
            <div className="w-8 h-8 border-2 border-core-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Fixed Section Index Header */}
        <div className="absolute top-8 sm:top-10 inset-x-0 px-6 sm:px-12 z-20 flex items-center justify-between max-w-7xl mx-auto pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-core-red animate-pulse" />
            <span className="text-xs font-mono tracking-[0.3em] uppercase text-white/90 drop-shadow-md">
              SECTION 04 // THE ARCHITECTURAL FILM
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[11px] font-mono tracking-widest text-core-muted uppercase backdrop-blur-md">
            <Film className="w-3 h-3 text-core-red" />
            <span>FULL SCRUB TIMELINE</span>
          </div>
        </div>

        {/* Narrative Milestone 1: Beginning of Film */}
        <motion.div
          style={{ opacity: introOverlayOpacity, y: introOverlayY }}
          className="absolute inset-x-0 top-1/3 px-6 text-center z-20 pointer-events-none max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-core-red/20 border border-core-red/40 text-xs font-mono tracking-[0.25em] text-white uppercase font-bold backdrop-blur-md mb-4">
            <Sparkles className="w-3.5 h-3.5 text-core-red" />
            THE SANCTUARY IN MOTION
          </div>
          <h3 className="text-2xl sm:text-4xl md:text-5xl font-display font-black uppercase tracking-tight text-white leading-tight drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
            CRAFTED FOR HEAVY RESISTANCE.
          </h3>
        </motion.div>

        {/* Narrative Milestone 2: Midpoint of Film */}
        <motion.div
          style={{ opacity: midOverlayOpacity, y: midOverlayY }}
          className="absolute bottom-20 sm:bottom-24 left-4 sm:left-12 lg:left-24 right-4 sm:right-auto z-20 pointer-events-none max-w-md"
        >
          <div className="p-6 rounded-2xl bg-core-dark/85 backdrop-blur-xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            <div className="text-3xl font-display font-black text-white">
              100<span className="text-core-red">%</span>
            </div>
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-white mt-1">
              SWEDISH OLYMPIC CALIBRATION
            </div>
            <p className="text-xs text-core-muted mt-2 font-sans leading-relaxed">
              Every bar tested for tensile deflection, knurling depth, and zero sleeve friction under heavy loads.
            </p>
          </div>
        </motion.div>

        {/* Narrative Milestone 3: Exact Final Frame */}
        <motion.div
          style={{ opacity: finalOverlayOpacity, y: finalOverlayY }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-30 pointer-events-none max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-core-red/20 border border-core-red/40 text-xs font-mono tracking-[0.3em] text-core-red uppercase font-bold backdrop-blur-md">
              ATHLETIC SINGULARITY
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black uppercase tracking-tight text-white leading-[1.05] drop-shadow-[0_15px_40px_rgba(0,0,0,0.95)]">
              WHERE DISCIPLINE BECOMES <span className="text-core-red">PERMANENCE.</span>
            </h2>

            <p className="text-xs sm:text-sm md:text-base font-mono tracking-[0.25em] text-core-muted uppercase max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              THE BENCHMARK OF MODERN STRENGTH ARCHITECTURE.
            </p>
          </div>
        </motion.div>

        {/* Scroll Cue Indicator */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-2 z-20 pointer-events-none"
        >
          <span className="text-[11px] font-mono tracking-[0.35em] text-white/80 uppercase drop-shadow-lg">
            SCROLL TO SCRUB TIMELINE
          </span>
          <ChevronDown className="w-5 h-5 text-core-red animate-bounce drop-shadow-lg" />
        </motion.div>
      </div>
    </section>
  );
}
