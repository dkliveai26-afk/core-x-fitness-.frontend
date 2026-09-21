'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<number>(15);
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Track scroll progress through the 480vh section container for generous full-video scroll distance
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Setup video metadata and smooth LERP scrubbing loop for the new videoclip.mp4
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setVideoDuration(video.duration);
      }
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    // Ultra-smooth RAF loop with LERP interpolation for buttery motion without frame jumps
    const updateVideoTime = () => {
      if (videoRef.current && videoDuration > 0) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        if (Math.abs(diff) > 0.001) {
          currentTimeRef.current += diff * 0.12; // Smooth lerp coefficient
          const safeTime = Math.max(0, Math.min(videoDuration - 0.02, currentTimeRef.current));
          try {
            videoRef.current.currentTime = safeTime;
          } catch (e) {
            // Ignore seek errors during mount
          }
        }
      }
      animationFrameRef.current = requestAnimationFrame(updateVideoTime);
    };

    animationFrameRef.current = requestAnimationFrame(updateVideoTime);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [videoDuration]);

  // PHASE 1 (0.00 -> 0.70 scroll): Map scroll 100% to the full video duration (frame 0 -> final frame)
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const videoProgress = Math.max(0, Math.min(1, latest / 0.70));
    targetTimeRef.current = videoProgress * videoDuration;
  });

  // PHASE 2 (>0.72 scroll): Text Reveal AFTER 100% video completion with left-side entrance animation
  const textOpacity = useTransform(scrollYProgress, [0.70, 0.80, 0.92, 0.98], [0, 1, 1, 0]);
  const textX = useTransform(scrollYProgress, [0.70, 0.82], [-60, 0]);
  const textScale = useTransform(scrollYProgress, [0.70, 0.82], [0.97, 1]);

  // Scroll Hint Indicator (visible only at the very start 0 -> 0.10 scroll)
  const hintOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[480vh] w-full bg-core-void select-none"
    >
      {/* Sticky Fullscreen Viewport Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-core-void">
        
        {/* Crisp Full-bleed Video Frame (New Unwatermarked videoclip.mp4) */}
        <div className="relative w-full h-full flex items-center justify-center z-0">
          <video
            ref={videoRef}
            src="/videoclip.mp4"
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-contain md:object-cover object-center pointer-events-none filter brightness-105 contrast-105"
          />

          {/* Minimal top and bottom gradient fades to cleanly blend video edges into black background without blur */}
          <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-core-void via-core-void/30 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-core-void via-core-void/50 to-transparent pointer-events-none z-10" />
        </div>

        {/* Minimal Initial Scroll Hint (Fades out immediately as user starts scrolling) */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-8 inset-x-0 flex flex-col items-center justify-center gap-2 z-20 pointer-events-none"
        >
          <span className="text-[11px] font-mono tracking-[0.35em] text-core-muted/90 uppercase">
            SCROLL TO CONTROL ANIMATION
          </span>
          <ChevronDown className="w-5 h-5 text-core-red animate-bounce" />
        </motion.div>

        {/* TEXT REVEAL CONTAINER — Appears ONLY AFTER the video completes 100% of its frames */}
        {/* Left-side entrance animation (textX) + smooth opacity fade */}
        <motion.div
          style={{ opacity: textOpacity, x: textX, scale: textScale }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 text-center z-30 pointer-events-none max-w-5xl mx-auto"
        >
          <div className="space-y-6 text-left sm:text-center w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-core-red/15 border border-core-red/30 text-xs font-mono tracking-[0.3em] text-core-red uppercase font-bold">
              ATHLETIC EXCELLENCE REIMAGINED
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight text-white leading-[1.05] drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)] max-w-4xl mx-auto break-words">
              FORGED IN <span className="text-core-red">DISCIPLINE.</span>
              <br className="hidden sm:block" />
              DEFINED BY <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-core-muted">STRENGTH.</span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base font-mono tracking-[0.25em] text-core-muted uppercase max-w-2xl mx-auto leading-relaxed">
              AN UNCOMPROMISING ATHLETIC CLUB AND HIGH-PERFORMANCE FACILITY.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
