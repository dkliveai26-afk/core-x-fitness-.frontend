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

  // Framer Motion's useScroll works correctly WITH Lenis smooth scroll.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Text overlays — appear ONLY after the video reaches its final frame
  const textOpacity = useTransform(scrollYProgress, [0.84, 0.90, 1.0], [0, 1, 1]);
  const textY = useTransform(scrollYProgress, [0.84, 0.90], [40, 0]);
  const textScale = useTransform(scrollYProgress, [0.84, 0.90], [0.95, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  // Initial Hero Center Heading — fades out smoothly on first scroll
  const centerMessageOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);
  const centerMessageY = useTransform(scrollYProgress, [0, 0.04], [0, -25]);
  const centerMessageScale = useTransform(scrollYProgress, [0, 0.04], [1, 0.96]);

  // Track seeking state and target time to prevent uncontrolled seek flooding
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

      // Controlled seek: only dispatch when not already seeking and gap is meaningful
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

    // RAF loop interpolates smoothly towards scroll position
    let lastDispatchedTarget = -1;

    const tick = () => {
      if (!active) return;

      const duration = videoDurationRef.current;
      if (video && duration > 0) {
        const rawProgress = scrollYProgress.get();

        // 0 to 0.84 maps to 0 to 100% of video (full duration)
        const videoProgress = Math.min(1, Math.max(0, rawProgress / 0.84));
        const desiredTime = videoProgress * (duration - 0.02);

        // Smooth sub-frame interpolation
        const diff = desiredTime - targetTimeRef.current;
        if (Math.abs(diff) < 0.002) {
          targetTimeRef.current = desiredTime;
        } else {
          // Responsive follow speed that eliminates lag while preserving smoothness
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
      className="relative h-[220vh] sm:h-[280vh] lg:h-[450vh] w-full bg-core-void select-none"
    >
      {/* Sticky viewport — stays pinned while user scrolls through the calibrated container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-core-void flex items-center justify-center">

        {/* The actual MP4 video — fullscreen immersive gym atmosphere on all devices */}
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
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

          {/* Atmospheric Ambient Overlays */}
          <div className="absolute inset-0 bg-radial-vignette opacity-50 pointer-events-none z-10" />
        </div>

        {/* Loading state */}
        {!isVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-core-void z-10">
            <div className="w-8 h-8 border-2 border-core-red border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Initial Hero Center Heading — fades out smoothly on first scroll */}
        <motion.div
          style={{ opacity: centerMessageOpacity, y: centerMessageY, scale: centerMessageScale }}
          className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8 text-center pointer-events-none z-20"
        >
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center">
            <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl uppercase tracking-tight leading-[1.08] drop-shadow-[0_15px_40px_rgba(0,0,0,0.95)]">
              <span className="block text-white drop-shadow-[0_8px_25px_rgba(0,0,0,0.95)]">
                FORGED IN DISCIPLINE.
              </span>
              <span className="block mt-1.5 sm:mt-2.5 md:mt-3.5 text-transparent bg-clip-text bg-gradient-to-r from-core-red via-core-accent to-white drop-shadow-[0_0_35px_rgba(255,42,42,0.45)]">
                BUILT FOR PERFORMANCE.
              </span>
            </h1>
          </div>
        </motion.div>

        {/* Scroll hint — fades out immediately when scrolling begins */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 sm:bottom-10 inset-x-0 flex flex-col items-center gap-1.5 sm:gap-2 z-20 pointer-events-none"
        >
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.3em] sm:tracking-[0.35em] text-white/80 uppercase drop-shadow-lg">
            SCROLL TO EXPLORE
          </span>
          <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-core-red animate-bounce drop-shadow-lg" />
        </motion.div>

        {/* Complete Hero Composition (Video + Text + CTA together as ONE unified hero!) */}
        <motion.div
          style={{ opacity: textOpacity, y: textY, scale: textScale }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center z-30 pointer-events-none"
        >
          <div className="space-y-3.5 sm:space-y-6 max-w-4xl mx-auto flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-core-red/15 border border-core-red/30 text-[10px] sm:text-xs font-mono tracking-[0.25em] sm:tracking-[0.3em] text-core-red uppercase font-bold backdrop-blur-md">
              ATHLETIC EXCELLENCE REIMAGINED
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl uppercase tracking-tight text-white leading-[1.06] drop-shadow-[0_10px_30px_rgba(0,0,0,0.95)]">
              FORGED IN <span className="text-core-red">DISCIPLINE.</span>
              <br className="hidden sm:block" />{' '}
              DEFINED BY{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-core-muted">
                STRENGTH.
              </span>
            </h1>

            <p className="text-[11px] sm:text-xs md:text-sm font-mono tracking-[0.18em] sm:tracking-[0.25em] text-core-muted uppercase max-w-md sm:max-w-xl lg:max-w-2xl mx-auto leading-relaxed drop-shadow-md">
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
