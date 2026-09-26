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

  // Framer Motion scroll tracker with Lenis smooth scroll compatibility
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Desktop text overlays — appear after initial scrub on desktop
  const desktopTextOpacity = useTransform(scrollYProgress, [0.82, 0.90, 1.0], [0, 1, 1]);
  const desktopTextY = useTransform(scrollYProgress, [0.82, 0.90], [35, 0]);
  const desktopCenterOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const desktopCenterY = useTransform(scrollYProgress, [0, 0.05], [0, -20]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  // Track seeking state and target time
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  // Video initialization and decoder unlock
  const onVideoReady = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      videoDurationRef.current = video.duration;
      setIsVideoReady(true);

      // Unlock video decoder pipeline
      video.play().then(() => {
        video.pause();
        video.currentTime = 0;
      }).catch(() => {
        // Autoplay muted fallback
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

  // Core scrub engine: RAF loop with seek-safe queueing
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

        // 0 to 0.88 maps to full video duration
        const videoProgress = Math.min(1, Math.max(0, rawProgress / 0.88));
        const desiredTime = videoProgress * (duration - 0.02);

        // Smooth sub-frame interpolation
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
  }, [scrollYProgress]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[180vh] sm:h-[220vh] lg:h-[450vh] w-full bg-core-void select-none"
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-core-void flex flex-col lg:flex-row items-center justify-center pt-16 sm:pt-20 lg:pt-0 pb-4 lg:pb-0 px-4 sm:px-6 lg:px-0">
        
        {/* Loading state indicator */}
        {!isVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-core-void z-40">
            <div className="w-8 h-8 border-2 border-core-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* 
          ANIMATION / VIDEO CONTAINER:
          - On Mobile/Tablet (< lg): Framed top box matching user reference sketch
          - On Desktop (lg+): Fullscreen immersive background
        */}
        <div className="relative w-full max-w-[420px] sm:max-w-xl lg:max-w-none aspect-[16/9] sm:aspect-[16/10] lg:aspect-auto h-auto lg:h-full lg:absolute lg:inset-0 rounded-2xl lg:rounded-none overflow-hidden border border-white/15 lg:border-none bg-[#0a0a0c] lg:bg-transparent shadow-[0_12px_40px_rgba(0,0,0,0.9)] lg:shadow-none shrink-0 z-10 my-auto lg:my-0">
          <video
            ref={videoRef}
            src="/videoclip.mp4"
            muted
            playsInline
            preload="auto"
            className={`w-full h-full object-cover transition-opacity duration-500 select-none pointer-events-none ${
              isVideoReady ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ willChange: 'contents' }}
          />

          {/* Vignette & Ambient overlay */}
          <div className="absolute inset-0 bg-radial-vignette opacity-45 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 lg:hidden pointer-events-none z-10" />
        </div>

        {/* ========================================================
            MOBILE / TABLET HERO CONTENT (Stacked below animation box)
            ======================================================== */}
        <div className="w-full max-w-[420px] sm:max-w-xl mx-auto flex flex-col items-center text-center space-y-2.5 sm:space-y-3.5 z-20 pb-2 sm:pb-4 lg:hidden shrink-0 mt-2 sm:mt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-core-red/15 border border-core-red/30 text-[9px] sm:text-[10px] font-mono tracking-[0.22em] text-core-red uppercase font-bold backdrop-blur-md">
            ATHLETIC EXCELLENCE REIMAGINED
          </div>

          <h1 className="font-display font-black text-xl sm:text-2xl md:text-3xl uppercase tracking-tight text-white leading-[1.1] drop-shadow-[0_10px_25px_rgba(0,0,0,0.95)]">
            FORGED IN <span className="text-core-red">DISCIPLINE.</span>
            <br />
            DEFINED BY{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-core-muted">
              STRENGTH.
            </span>
          </h1>

          <p className="text-[10px] sm:text-[11px] font-mono tracking-[0.16em] text-core-muted uppercase max-w-sm sm:max-w-md mx-auto leading-relaxed">
            AN UNCOMPROMISING ATHLETIC CLUB AND HIGH-PERFORMANCE FACILITY.
          </p>

          <div className="pt-1 pointer-events-auto">
            <Link
              href="/plans"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-red-gradient text-white text-xs font-heading font-bold uppercase tracking-widest hover:shadow-glow-red hover:scale-105 active:scale-95 transition-all duration-300 border border-core-red/50 shadow-[0_0_20px_rgba(255,42,42,0.4)]"
            >
              <span>GET ACCESS</span>
              <span className="text-sm">↗</span>
            </Link>
          </div>
        </div>

        {/* Scroll hint on mobile */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="lg:hidden flex items-center gap-1.5 text-[9px] font-mono tracking-[0.25em] text-white/60 uppercase pt-1 pointer-events-none"
        >
          <span>SCROLL TO PLAY</span>
          <ChevronDown className="w-3 h-3 text-core-red animate-bounce" />
        </motion.div>

        {/* ========================================================
            DESKTOP-ONLY HERO OVERLAYS (Full-screen composition)
            ======================================================== */}
        {/* Desktop initial center message */}
        <motion.div
          style={{ opacity: desktopCenterOpacity, y: desktopCenterY }}
          className="hidden lg:flex absolute inset-0 items-center justify-center px-8 text-center pointer-events-none z-20"
        >
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
            <h1 className="font-display font-black text-5xl xl:text-6xl uppercase tracking-tight leading-[1.08] drop-shadow-[0_15px_40px_rgba(0,0,0,0.95)]">
              <span className="block text-white drop-shadow-[0_8px_25px_rgba(0,0,0,0.95)]">
                FORGED IN DISCIPLINE.
              </span>
              <span className="block mt-3.5 text-transparent bg-clip-text bg-gradient-to-r from-core-red via-core-accent to-white drop-shadow-[0_0_35px_rgba(255,42,42,0.45)]">
                BUILT FOR PERFORMANCE.
              </span>
            </h1>
          </div>
        </motion.div>

        {/* Desktop scroll hint */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="hidden lg:flex absolute bottom-10 inset-x-0 flex-col items-center gap-2 z-20 pointer-events-none"
        >
          <span className="text-[11px] font-mono tracking-[0.35em] text-white/80 uppercase drop-shadow-lg">
            SCROLL TO EXPLORE
          </span>
          <ChevronDown className="w-5 h-5 text-core-red animate-bounce drop-shadow-lg" />
        </motion.div>

        {/* Desktop final text composition overlay */}
        <motion.div
          style={{ opacity: desktopTextOpacity, y: desktopTextY }}
          className="hidden lg:flex absolute inset-0 flex-col items-center justify-center px-8 text-center z-30 pointer-events-none"
        >
          <div className="space-y-6 max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-core-red/15 border border-core-red/30 text-xs font-mono tracking-[0.3em] text-core-red uppercase font-bold backdrop-blur-md">
              ATHLETIC EXCELLENCE REIMAGINED
            </div>

            <h1 className="font-display font-black text-6xl xl:text-7xl uppercase tracking-tight text-white leading-[1.06] drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
              FORGED IN <span className="text-core-red">DISCIPLINE.</span>
              <br />
              DEFINED BY{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-core-muted">
                STRENGTH.
              </span>
            </h1>

            <p className="text-sm font-mono tracking-[0.25em] text-core-muted uppercase max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              AN UNCOMPROMISING ATHLETIC CLUB AND HIGH-PERFORMANCE FACILITY.
            </p>

            <div className="pt-4 pointer-events-auto">
              <Link
                href="/plans"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-red-gradient text-white text-sm font-heading font-bold uppercase tracking-widest hover:shadow-glow-red hover:scale-105 active:scale-95 transition-all duration-300 border border-core-red/50 shadow-[0_0_25px_rgba(255,42,42,0.4)]"
              >
                <span>GET ACCESS</span>
                <span className="text-base">↗</span>
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
