'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Eye } from 'lucide-react';

export function GalleryHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoDurationRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Framer Motion's useScroll synchronizes with Lenis smooth scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Camera perspective movement: subtle scale and tilt through 3D space as you scroll
  const cameraScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1.02, 1.0]);
  const vignetteDarkness = useTransform(scrollYProgress, [0, 0.4, 0.85, 1], [0.35, 0.15, 0.25, 0.65]);

  // Initial Hero Center Heading — masked reveal, fades out cleanly as soon as user begins scrolling
  const initialTitleOpacity = useTransform(scrollYProgress, [0, 0.045], [1, 0]);
  const initialTitleY = useTransform(scrollYProgress, [0, 0.045], [0, -28]);
  const initialTitleScale = useTransform(scrollYProgress, [0, 0.045], [1, 0.96]);

  // Scroll Cue Indicator — fades out on first touch
  const hintOpacity = useTransform(scrollYProgress, [0, 0.035], [1, 0]);

  // Culminating Entrance Statement — reveals as video scrub reaches completion (0.84 -> 0.94)
  const finalTitleOpacity = useTransform(scrollYProgress, [0.84, 0.92, 1.0], [0, 1, 1]);
  const finalTitleY = useTransform(scrollYProgress, [0.84, 0.92], [30, 0]);

  // Video initialization and hardware decoder unlock
  const onVideoReady = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      videoDurationRef.current = video.duration;
      setIsVideoReady(true);

      // Prime the hardware decoder pipeline for zero-latency seeking
      video.play().then(() => {
        video.pause();
        video.currentTime = 0;
      }).catch(() => {
        // Fallback for muted autoplay policy
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

      const clampedTarget = Math.max(0, Math.min(duration - 0.01, target));

      // If already seeking, buffer latest target
      if (isSeeking || video.seeking) {
        pendingTarget = clampedTarget;
        return;
      }

      // Only dispatch if target differs meaningfully from current video position
      const diff = Math.abs(video.currentTime - clampedTarget);
      if (diff > 0.008) {
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

    // RAF loop updates timeline with sub-frame interpolation
    let targetTime = 0;

    const tick = () => {
      if (!active) return;

      const duration = videoDurationRef.current;
      if (video && duration > 0) {
        const rawProgress = scrollYProgress.get();

        // 0 to 0.88 maps cleanly to 100% of the video duration
        const videoProgress = Math.min(1, Math.max(0, rawProgress / 0.88));
        const desiredTime = videoProgress * (duration - 0.01);

        // High-responsiveness follow factor without jitter
        const diff = desiredTime - targetTime;
        if (Math.abs(diff) < 0.003) {
          targetTime = desiredTime;
        } else {
          targetTime += diff * 0.75;
        }

        if (Math.abs(targetTime - lastDispatchedTarget) > 0.008) {
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
      id="gallery-hero"
      ref={containerRef}
      className="relative h-[460vh] w-full bg-core-void select-none"
    >
      {/* Sticky Viewport — pinned while user scrolls through 460vh */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-core-void flex items-center justify-center">

        {/* Dynamic 3D Camera Container */}
        <motion.div
          style={{ scale: cameraScale }}
          className="relative w-full h-full will-change-transform"
        >
          {/* Gallery MP4 Video Asset (intra-frame optimized with seamless fallback) */}
          <video
            ref={videoRef}
            src="/galerypagevideo1_opt.mp4"
            muted
            playsInline
            preload="auto"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              isVideoReady ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ willChange: 'contents' }}
          />

          {/* Fallback listener in case optimized file isn't loaded */}
          <source src="/galerypagevideo1.mp4" type="video/mp4" />
        </motion.div>

        {/* Edge Atmospheric Vignettes (Blends into black void) */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-core-void via-core-void/50 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-core-void via-core-void/70 to-transparent pointer-events-none z-10" />

        {/* Dynamic Vignette Mask for cinematic depth */}
        <motion.div
          style={{ opacity: vignetteDarkness }}
          className="absolute inset-0 bg-radial-vignette pointer-events-none z-10"
        />

        {/* Ambient Center Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-radial from-core-red/15 via-core-crimson/5 to-transparent rounded-full blur-[140px] pointer-events-none z-10" />

        {/* Loading Spinner */}
        {!isVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-core-void z-20">
            <div className="w-8 h-8 border-2 border-core-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Top-Left Minimalist Archive Tag */}
        <div className="absolute top-24 sm:top-28 inset-x-0 px-6 sm:px-12 z-20 flex items-center justify-between max-w-7xl mx-auto pointer-events-none">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-core-red animate-pulse" />
            <span className="text-[11px] font-mono tracking-[0.35em] uppercase text-white/90 drop-shadow-md">
              VISUAL ARCHIVE // 01
            </span>
          </div>

          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-white/10 text-[10px] font-mono tracking-widest text-core-muted uppercase backdrop-blur-md">
            <Eye className="w-3.5 h-3.5 text-core-red" />
            <span>INTERACTIVE SCROLL ENTRANCE</span>
          </div>
        </div>

        {/* Initial Hero Statement — Masked Left-to-Right Reveal */}
        <motion.div
          style={{
            opacity: initialTitleOpacity,
            y: initialTitleY,
            scale: initialTitleScale,
          }}
          className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 text-center pointer-events-none z-20"
        >
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
            {/* Minimal Sub-Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-core-red/15 border border-core-red/30 text-[11px] font-mono tracking-[0.35em] text-core-red uppercase font-bold backdrop-blur-md mb-4 sm:mb-6">
              EXHIBITION // ATHLETIC FORM
            </div>

            {/* Main Short Strong Heading */}
            <h1 className="font-display font-black text-[clamp(1.75rem,5vw,5rem)] uppercase tracking-tight leading-[1.05] drop-shadow-[0_15px_45px_rgba(0,0,0,0.95)]">
              <span className="block text-white">
                FORGED IN TENSION.
              </span>
              <span className="block mt-1 sm:mt-2 text-transparent bg-clip-text bg-gradient-to-r from-core-red via-core-accent to-white drop-shadow-[0_0_35px_rgba(255,42,42,0.45)]">
                CAPTURED IN MOTION.
              </span>
            </h1>
          </div>
        </motion.div>

        {/* Scroll Cue Hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 inset-x-0 flex flex-col items-center gap-2 z-20 pointer-events-none"
        >
          <span className="text-[10px] font-mono tracking-[0.4em] text-white/80 uppercase drop-shadow-md">
            SCROLL TO ENTER ARCHIVE
          </span>
          <ChevronDown className="w-4 h-4 text-core-red animate-bounce drop-shadow-md" />
        </motion.div>

        {/* Culminating Entrance Statement (Appears at end of scrub) */}
        <motion.div
          style={{ opacity: finalTitleOpacity, y: finalTitleY }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-20 pointer-events-none max-w-4xl mx-auto"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-core-red/20 border border-core-red/40 text-xs font-mono tracking-[0.3em] text-core-red uppercase font-bold backdrop-blur-md">
              THE CORE X MONOLITH
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-black uppercase tracking-tight text-white leading-[1.08] drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]">
              WHERE DISCIPLINE MEETS <span className="text-core-red">GEOMETRY.</span>
            </h2>

            <p className="text-xs sm:text-sm font-mono tracking-[0.3em] text-core-muted uppercase max-w-xl mx-auto leading-relaxed drop-shadow-md">
              EXPLORE THE VISUAL SANCTUARY OF ELITE ATHLETICISM.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
