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

  // Track scroll progress through the 350vh section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Setup video metadata and smooth LERP scrubbing loop
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

    // Smooth RAF loop with LERP interpolation for 100% stutter-free scrubbing
    const updateVideoTime = () => {
      if (videoRef.current && videoDuration > 0) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        if (Math.abs(diff) > 0.001) {
          currentTimeRef.current += diff * 0.15; // Smooth lerp speed
          const safeTime = Math.max(0, Math.min(videoDuration - 0.02, currentTimeRef.current));
          try {
            videoRef.current.currentTime = safeTime;
          } catch (e) {
            // Ignore seek errors during initial DOM mount
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

  // PHASE 1: Map 0.00 -> 0.65 scroll range to 0% -> 100% of video duration
  // This guarantees the complete MP4 plays from frame 0 to its final frame during scroll
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const videoProgress = Math.max(0, Math.min(1, latest / 0.65));
    targetTimeRef.current = videoProgress * videoDuration;
  });

  // PHASE 2: Text Reveal (Appears ONLY AFTER video reaches final frame at > 0.65 scroll)
  const textOpacity = useTransform(scrollYProgress, [0.65, 0.75, 0.90, 0.98], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.65, 0.78, 0.95], [40, 0, -20]);
  const textScale = useTransform(scrollYProgress, [0.65, 0.78], [0.96, 1]);

  // Scroll Hint Indicator (visible only at the very start 0 -> 0.12 scroll)
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[360vh] w-full bg-core-void select-none"
    >
      {/* Sticky Fullscreen Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-core-void">
        
        {/* Full-bleed Crisp MP4 Video Container */}
        <div className="relative w-full h-full flex items-center justify-center z-0">
          <video
            ref={videoRef}
            src="/gym_video2.mp4"
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-contain md:object-cover object-center pointer-events-none filter brightness-105 contrast-105"
          />

          {/* Minimal top and bottom subtle gradients for seamless black background blending */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-core-void via-core-void/40 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-core-void via-core-void/60 to-transparent pointer-events-none z-10" />
        </div>

        {/* Minimal Initial Scroll Hint (Fades out immediately as scroll begins) */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 inset-x-0 flex flex-col items-center justify-center gap-2 z-20 pointer-events-none"
        >
          <span className="text-[11px] font-mono tracking-[0.35em] text-core-muted/90 uppercase">
            SCROLL TO CONTROL ANIMATION
          </span>
          <ChevronDown className="w-5 h-5 text-core-red animate-bounce" />
        </motion.div>

        {/* TEXT REVEAL CONTAINER — Appears ONLY AFTER the video completes 100% of its frames */}
        <motion.div
          style={{ opacity: textOpacity, y: textY, scale: textScale }}
          className="absolute inset-0 flex flex-col items-center justify-center px-4 sm:px-8 text-center z-30 pointer-events-none max-w-5xl mx-auto"
        >
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-core-red/15 border border-core-red/30 text-xs font-mono tracking-[0.3em] text-core-red uppercase font-bold">
              ATHLETIC EXCELLENCE REIMAGINED
            </span>

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
