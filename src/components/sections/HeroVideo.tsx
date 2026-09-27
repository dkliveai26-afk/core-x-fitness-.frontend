'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoDurationRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return '/video-for-mobile-preview.mp4';
    }
    return '/videoclip.mp4';
  });

  // Automatically update source if device crosses mobile breakpoint
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const targetSrc = isMobile ? '/video-for-mobile-preview.mp4' : '/videoclip.mp4';
      setVideoSrc((prev) => (prev !== targetSrc ? targetSrc : prev));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Framer Motion scroll tracker with Lenis smooth scroll compatibility
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth text & overlay transitions (exact original timing & curves)
  const centerMessageOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const centerMessageY = useTransform(scrollYProgress, [0, 0.06], [0, -20]);
  const centerMessageScale = useTransform(scrollYProgress, [0, 0.06], [1, 0.96]);

  const textOpacity = useTransform(scrollYProgress, [0.72, 0.85, 1.0], [0, 1, 1]);
  const textY = useTransform(scrollYProgress, [0.72, 0.85], [30, 0]);
  const textScale = useTransform(scrollYProgress, [0.72, 0.85], [0.96, 1]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // Track seeking state and target time
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  // Video initialization and decoder unlock (exact original)
  const onVideoReady = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      videoDurationRef.current = video.duration;
      setIsVideoReady(true);

      // Unlock video decoder pipeline
      video.play().then(() => {
        video.pause();
        const rawProgress = scrollYProgress.get();
        const videoProgress = Math.min(1, Math.max(0, rawProgress / 0.80));
        const initialTime = videoProgress * (video.duration - 0.02);
        video.currentTime = Math.max(0, initialTime);
        targetTimeRef.current = initialTime;
      }).catch(() => {
        // Autoplay muted fallback
      });
    }
  }, [scrollYProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setIsVideoReady(false);
    video.pause();

    if (video.readyState >= 1) {
      onVideoReady();
    } else {
      video.addEventListener('loadedmetadata', onVideoReady);
    }

    return () => {
      video.removeEventListener('loadedmetadata', onVideoReady);
    };
  }, [onVideoReady, videoSrc]);

  // Core scrub engine: exact original RAF loop with seek-safe queueing
  useEffect(() => {
    let active = true;
    const video = videoRef.current;
    if (!video) return;

    const performSeek = () => {
      if (!active || !video) return;
      const duration = videoDurationRef.current;
      if (duration <= 0) return;

      const target = Math.max(0, Math.min(duration - 0.02, targetTimeRef.current));
      const diff = Math.abs(video.currentTime - target);

      if (diff > 0.008 && !isSeekingRef.current && !video.seeking) {
        isSeekingRef.current = true;
        try {
          video.currentTime = target;
        } catch {
          isSeekingRef.current = false;
        }
      }
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
      performSeek();
    };

    const handleSeeking = () => {
      isSeekingRef.current = true;
    };

    video.addEventListener('seeked', handleSeeked);
    video.addEventListener('seeking', handleSeeking);

    let lastDispatchedTarget = -1;

    const tick = () => {
      if (!active) return;

      const duration = videoDurationRef.current;
      if (video && duration > 0) {
        const rawProgress = scrollYProgress.get();

        // 0 to 0.80 maps to full video duration
        const videoProgress = Math.min(1, Math.max(0, rawProgress / 0.80));
        const desiredTime = videoProgress * (duration - 0.02);

        // Smooth sub-frame interpolation (exact original 0.45 smoothing)
        const diff = desiredTime - targetTimeRef.current;
        if (Math.abs(diff) < 0.002) {
          targetTimeRef.current = desiredTime;
        } else {
          targetTimeRef.current += diff * 0.45;
        }

        if (Math.abs(targetTimeRef.current - lastDispatchedTarget) > 0.005) {
          lastDispatchedTarget = targetTimeRef.current;
          performSeek();
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
  }, [scrollYProgress, videoSrc]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[320vh] sm:h-[350vh] lg:h-[380vh] w-full bg-core-void select-none"
    >
      {/* Sticky Fullscreen Viewport — Seamless, immersive hero on all devices */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-core-void flex items-center justify-center">

        {/* Video Background — Single clean video element */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <video
            ref={videoRef}
            src={videoSrc}
            muted
            playsInline
            preload="auto"
            className={`w-full h-full object-cover transition-opacity duration-500 select-none pointer-events-none ${
              isVideoReady ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ willChange: 'contents' }}
          />

          {/* Premium Ambient Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-core-void via-black/25 to-core-void/80 pointer-events-none z-10" />
        </div>

        {/* Loading Spinner */}
        {!isVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-core-void z-20">
            <div className="w-8 h-8 border-2 border-core-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* 1. Initial Hero Message (fades out smoothly on first scroll) */}
        <motion.div
          style={{ opacity: centerMessageOpacity, y: centerMessageY, scale: centerMessageScale }}
          className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8 text-center pointer-events-none z-20"
        >
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center">
            <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight leading-[1.08] drop-shadow-[0_15px_40px_rgba(0,0,0,0.95)]">
              <span className="block text-white drop-shadow-[0_8px_25px_rgba(0,0,0,0.95)]">
                FORGED IN DISCIPLINE.
              </span>
              <span className="block mt-1.5 sm:mt-2.5 text-transparent bg-clip-text bg-gradient-to-r from-core-red via-core-accent to-white drop-shadow-[0_0_35px_rgba(255,42,42,0.45)]">
                BUILT FOR PERFORMANCE.
              </span>
            </h1>
          </div>
        </motion.div>

        {/* 2. Scroll Hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 sm:bottom-10 inset-x-0 flex flex-col items-center gap-1.5 sm:gap-2 z-20 pointer-events-none"
        >
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] sm:tracking-[0.35em] text-white/80 uppercase drop-shadow-lg">
            SCROLL TO EXPLORE
          </span>
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-core-red animate-bounce drop-shadow-lg" />
        </motion.div>

        {/* 3. Final Complete Hero Overlay (Proportional, Balanced, Clean Typography) */}
        <motion.div
          style={{ opacity: textOpacity, y: textY, scale: textScale }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center z-30 pointer-events-none"
        >
          <div className="space-y-3.5 sm:space-y-5 lg:space-y-6 max-w-3xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-core-red/15 border border-core-red/30 text-[10px] sm:text-xs font-mono tracking-[0.25em] sm:tracking-[0.3em] text-core-red uppercase font-bold backdrop-blur-md">
              ATHLETIC EXCELLENCE REIMAGINED
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-tight text-white leading-[1.08] drop-shadow-[0_12px_35px_rgba(0,0,0,0.95)]">
              <span className="block">
                FORGED IN <span className="text-core-red">DISCIPLINE.</span>
              </span>
              <span className="block mt-1 sm:mt-1.5">
                DEFINED BY{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-core-muted">
                  STRENGTH.
                </span>
              </span>
            </h1>

            <p className="text-[11px] sm:text-xs md:text-sm font-mono tracking-[0.16em] sm:tracking-[0.22em] text-core-muted uppercase max-w-sm sm:max-w-lg lg:max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              AN UNCOMPROMISING ATHLETIC CLUB AND HIGH-PERFORMANCE FACILITY.
            </p>

            <div className="pt-2 sm:pt-4 pointer-events-auto">
              <Link
                href="/plans"
                className="inline-flex items-center gap-2 px-7 py-2.5 sm:px-8 sm:py-3.5 rounded-full bg-red-gradient text-white text-xs sm:text-sm font-heading font-bold uppercase tracking-widest hover:shadow-glow-red hover:scale-105 active:scale-95 transition-all duration-300 border border-core-red/50 shadow-[0_0_25px_rgba(255,42,42,0.4)]"
              >
                <span>GET ACCESS</span>
                <span className="text-sm sm:text-base">↗</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
