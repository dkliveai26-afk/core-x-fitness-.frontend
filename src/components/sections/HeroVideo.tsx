'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const desktopDurationRef = useRef<number>(0);
  const mobileDurationRef = useRef<number>(0);
  const rafIdRef = useRef<number>(0);
  const [isDesktopReady, setIsDesktopReady] = useState(false);
  const [isMobileReady, setIsMobileReady] = useState(false);

  // Framer Motion scroll tracker with Lenis smooth scroll compatibility
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth text & overlay transitions (identical timing & sequences on desktop and mobile)
  const centerMessageOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const centerMessageY = useTransform(scrollYProgress, [0, 0.06], [0, -20]);
  const centerMessageScale = useTransform(scrollYProgress, [0, 0.06], [1, 0.96]);

  const textOpacity = useTransform(scrollYProgress, [0.72, 0.85, 1.0], [0, 1, 1]);
  const textY = useTransform(scrollYProgress, [0.72, 0.85], [30, 0]);
  const textScale = useTransform(scrollYProgress, [0.72, 0.85], [0.96, 1]);

  const hintOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  // Track seeking state and target times
  const targetTimeRef = useRef<number>(0);
  const isSeekingDesktopRef = useRef<boolean>(false);
  const isSeekingMobileRef = useRef<boolean>(false);
  const pendingDesktopTargetRef = useRef<number | null>(null);
  const pendingMobileTargetRef = useRef<number | null>(null);

  // Initialize and prime video decoders
  const initVideo = useCallback((video: HTMLVideoElement, isMob: boolean) => {
    if (!video || !video.duration || isNaN(video.duration) || video.duration <= 0) return;

    if (isMob) {
      mobileDurationRef.current = video.duration;
      setIsMobileReady(true);
    } else {
      desktopDurationRef.current = video.duration;
      setIsDesktopReady(true);
    }

    video.play().then(() => {
      video.pause();
      const rawProgress = scrollYProgress.get();
      const videoProgress = Math.min(1, Math.max(0, rawProgress / 0.80));
      const initialTime = videoProgress * (video.duration - 0.02);
      video.currentTime = Math.max(0, initialTime);
    }).catch(() => {
      // Autoplay muted fallback
    });
  }, [scrollYProgress]);

  useEffect(() => {
    const dVideo = desktopVideoRef.current;
    const mVideo = mobileVideoRef.current;

    const onDesktopMeta = () => { if (dVideo) initVideo(dVideo, false); };
    const onMobileMeta = () => { if (mVideo) initVideo(mVideo, true); };

    if (dVideo) {
      dVideo.pause();
      if (dVideo.readyState >= 1) onDesktopMeta();
      else {
        dVideo.addEventListener('loadedmetadata', onDesktopMeta);
        dVideo.addEventListener('loadeddata', onDesktopMeta);
        dVideo.addEventListener('canplay', onDesktopMeta);
      }
    }

    if (mVideo) {
      mVideo.pause();
      if (mVideo.readyState >= 1) onMobileMeta();
      else {
        mVideo.addEventListener('loadedmetadata', onMobileMeta);
        mVideo.addEventListener('loadeddata', onMobileMeta);
        mVideo.addEventListener('canplay', onMobileMeta);
      }
    }

    return () => {
      if (dVideo) {
        dVideo.removeEventListener('loadedmetadata', onDesktopMeta);
        dVideo.removeEventListener('loadeddata', onDesktopMeta);
        dVideo.removeEventListener('canplay', onDesktopMeta);
      }
      if (mVideo) {
        mVideo.removeEventListener('loadedmetadata', onMobileMeta);
        mVideo.removeEventListener('loadeddata', onMobileMeta);
        mVideo.removeEventListener('canplay', onMobileMeta);
      }
    };
  }, [initVideo]);

  // Core scrub engine: continuous RAF sync across active responsive video
  useEffect(() => {
    let active = true;

    const performSeek = (video: HTMLVideoElement, isMob: boolean, targetTime: number) => {
      if (!active || !video) return;
      const duration = isMob ? mobileDurationRef.current : desktopDurationRef.current;
      if (duration <= 0) return;

      const target = Math.max(0, Math.min(duration - 0.02, targetTime));
      const isSeeking = isMob ? isSeekingMobileRef : isSeekingDesktopRef;
      const pendingTarget = isMob ? pendingMobileTargetRef : pendingDesktopTargetRef;

      if (isSeeking.current || video.seeking) {
        pendingTarget.current = target;
        return;
      }

      const diff = Math.abs(video.currentTime - target);
      if (diff > 0.005) {
        isSeeking.current = true;
        try {
          video.currentTime = target;
        } catch {
          isSeeking.current = false;
        }
      }
    };

    const dVideo = desktopVideoRef.current;
    const mVideo = mobileVideoRef.current;

    const handleDesktopSeeked = () => {
      isSeekingDesktopRef.current = false;
      if (pendingDesktopTargetRef.current !== null && dVideo) {
        const next = pendingDesktopTargetRef.current;
        pendingDesktopTargetRef.current = null;
        performSeek(dVideo, false, next);
      }
    };

    const handleMobileSeeked = () => {
      isSeekingMobileRef.current = false;
      if (pendingMobileTargetRef.current !== null && mVideo) {
        const next = pendingMobileTargetRef.current;
        pendingMobileTargetRef.current = null;
        performSeek(mVideo, true, next);
      }
    };

    if (dVideo) {
      dVideo.addEventListener('seeked', handleDesktopSeeked);
      dVideo.addEventListener('seeking', () => { isSeekingDesktopRef.current = true; });
    }
    if (mVideo) {
      mVideo.addEventListener('seeked', handleMobileSeeked);
      mVideo.addEventListener('seeking', () => { isSeekingMobileRef.current = true; });
    }

    let lastDispatchedTarget = -1;

    const tick = () => {
      if (!active) return;

      const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768;
      const activeVideo = isMobileScreen ? mobileVideoRef.current : desktopVideoRef.current;
      const activeDuration = isMobileScreen ? mobileDurationRef.current : desktopDurationRef.current;

      if (activeVideo && activeDuration > 0) {
        const rawProgress = scrollYProgress.get();

        // 0 to 0.80 maps to full video duration smoothly
        const videoProgress = Math.min(1, Math.max(0, rawProgress / 0.80));
        const desiredTime = videoProgress * (activeDuration - 0.02);

        // Responsive, low-latency follow for instant silky-smooth reaction
        const diff = desiredTime - targetTimeRef.current;
        if (Math.abs(diff) < 0.001) {
          targetTimeRef.current = desiredTime;
        } else {
          targetTimeRef.current += diff * 0.85;
        }

        if (Math.abs(targetTimeRef.current - lastDispatchedTarget) > 0.003) {
          lastDispatchedTarget = targetTimeRef.current;
          performSeek(activeVideo, isMobileScreen, targetTimeRef.current);
        }
      }

      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (dVideo) dVideo.removeEventListener('seeked', handleDesktopSeeked);
      if (mVideo) mVideo.removeEventListener('seeked', handleMobileSeeked);
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [scrollYProgress]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[320vh] sm:h-[350vh] lg:h-[380vh] w-full bg-core-void select-none"
    >
      {/* Sticky Fullscreen Viewport — Seamless, immersive hero on all devices */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-core-void flex items-center justify-center">

        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* 1. Desktop Video — rendered for md (>= 768px) and larger screens */}
          <video
            ref={desktopVideoRef}
            src="/videoclip.mp4"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            className={`hidden md:block w-full h-full object-cover transition-opacity duration-500 select-none pointer-events-none ${
              isDesktopReady ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ willChange: 'contents, transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
          />

          {/* 2. Mobile Video — specifically loaded for mobile (< 768px) screens */}
          <video
            ref={mobileVideoRef}
            src="/video-for-mobile-preview.mp4"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            className={`block md:hidden w-full h-full object-cover transition-opacity duration-500 select-none pointer-events-none ${
              isMobileReady ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ willChange: 'contents, transform', transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
          />

          {/* Premium Ambient Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-core-void via-black/25 to-core-void/80 pointer-events-none z-10" />
        </div>

        {/* Loading Spinner */}
        {!isDesktopReady && !isMobileReady && (
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
