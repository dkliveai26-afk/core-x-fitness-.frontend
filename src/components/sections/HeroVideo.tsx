'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

export function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoDuration, setVideoDuration] = useState<number>(15);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);
  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Track scroll progress through the 280vh section container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Smooth video scrubbing loop using RAF with lerp interpolation
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video is paused so user scroll dictates time
    video.pause();

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setVideoDuration(video.duration);
        setIsVideoReady(true);
      }
    };

    if (video.readyState >= 1) {
      handleLoadedMetadata();
    } else {
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
    }

    // Smooth LERP animation loop to scrub video time without frame stutter
    const updateVideoTime = () => {
      if (videoRef.current && videoDuration > 0) {
        const diff = targetTimeRef.current - currentTimeRef.current;
        // Smooth lerp factor (0.14 gives silky cinematic motion)
        if (Math.abs(diff) > 0.001) {
          currentTimeRef.current += diff * 0.14;
          // Clamp time to valid video duration range
          const safeTime = Math.max(0, Math.min(videoDuration - 0.05, currentTimeRef.current));
          try {
            videoRef.current.currentTime = safeTime;
          } catch (e) {
            // Ignore temporary seek errors during DOM mount
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

  // Update target time whenever scroll progress changes
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    targetTimeRef.current = latest * videoDuration;
  });

  // Animated typography opacity and transform values based on scroll progress
  const opacityStage1 = useTransform(scrollYProgress, [0, 0.25, 0.35], [1, 1, 0]);
  const scaleStage1 = useTransform(scrollYProgress, [0, 0.3], [1, 0.95]);
  const yStage1 = useTransform(scrollYProgress, [0, 0.3], [0, -40]);

  const opacityStage2 = useTransform(scrollYProgress, [0.35, 0.5, 0.7, 0.8], [0, 1, 1, 0]);
  const yStage2 = useTransform(scrollYProgress, [0.35, 0.5, 0.7, 0.8], [30, 0, 0, -30]);

  const opacityStage3 = useTransform(scrollYProgress, [0.75, 0.88, 1], [0, 1, 0.3]);
  const scaleStage3 = useTransform(scrollYProgress, [0.75, 0.95], [0.9, 1]);

  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 0.96]);
  const videoOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0.2]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[280vh] w-full bg-core-void select-none"
    >
      {/* Sticky Fullscreen Frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-core-void via-transparent to-core-void z-10 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-core-red/10 rounded-full blur-[140px] pointer-events-none z-0" />

        {/* User-Provided 15-Second MP4 Animation Container */}
        <motion.div
          style={{ scale: videoScale, opacity: videoOpacity }}
          className="relative w-full h-full flex items-center justify-center z-0"
        >
          <video
            ref={videoRef}
            src="/gym_video2.mp4"
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center pointer-events-none filter brightness-105 contrast-110"
          />

          {/* Vignette Gradients to Seamlessly Blend MP4 into Black Site Background */}
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none z-10" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-core-void via-core-void/60 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-core-void via-core-void/80 to-transparent pointer-events-none z-10" />
        </motion.div>

        {/* OVERLAY TYPOGRAPHY — STAGE 1 (0% to 30% Scroll) */}
        <motion.div
          style={{ opacity: opacityStage1, scale: scaleStage1, y: yStage1 }}
          className="absolute inset-0 flex flex-col items-center justify-between py-24 px-6 z-20 pointer-events-none"
        >
          <div className="pt-12 text-center">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-[0.3em] text-core-muted uppercase backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-core-red animate-pulse" />
              INTERACTIVE SCROLL EXPERIENCE
            </span>
          </div>

          <div className="text-center max-w-4xl mx-auto space-y-3">
            <h1 className="font-display font-black text-4xl sm:text-6xl md:text-8xl tracking-[0.15em] text-white uppercase leading-none drop-shadow-[0_10px_40px_rgba(0,0,0,0.9)]">
              CORE <span className="text-core-red">X</span> FITNESS
            </h1>
            <p className="text-xs sm:text-sm font-mono tracking-[0.4em] text-white/70 uppercase">
              FORGED IN DISCIPLINE • DEFINED BY STRENGTH
            </p>
          </div>

          <div className="flex flex-col items-center gap-2 pb-6">
            <span className="text-[10px] font-mono tracking-[0.3em] text-core-muted/80 uppercase">
              SCROLL TO SCRUB ANIMATION
            </span>
            <ChevronDown className="w-5 h-5 text-core-red animate-bounce" />
          </div>
        </motion.div>

        {/* OVERLAY TYPOGRAPHY — STAGE 2 (35% to 70% Scroll) */}
        <motion.div
          style={{ opacity: opacityStage2, y: yStage2 }}
          className="absolute inset-0 flex items-center justify-between px-8 sm:px-16 md:px-24 z-20 pointer-events-none"
        >
          {/* Left Side Floating Metric */}
          <div className="max-w-xs space-y-2 text-left hidden sm:block">
            <div className="text-3xl md:text-5xl font-display font-black text-white tracking-wider">
              01<span className="text-core-red">.</span>
            </div>
            <div className="text-sm font-heading font-bold uppercase tracking-[0.25em] text-white">
              ENGINEERED PRECISION
            </div>
            <p className="text-xs font-mono text-core-muted tracking-widest uppercase">
              Scroll-scrubbed motion matrix
            </p>
          </div>

          {/* Right Side Floating Metric */}
          <div className="max-w-xs space-y-2 text-right hidden sm:block">
            <div className="text-3xl md:text-5xl font-display font-black text-white tracking-wider">
              100<span className="text-core-red">%</span>
            </div>
            <div className="text-sm font-heading font-bold uppercase tracking-[0.25em] text-white">
              UNCOMPROMISING POWER
            </div>
            <p className="text-xs font-mono text-core-muted tracking-widest uppercase">
              Elite athletic standard
            </p>
          </div>
        </motion.div>

        {/* OVERLAY TYPOGRAPHY — STAGE 3 (75% to 100% Scroll) */}
        <motion.div
          style={{ opacity: opacityStage3, scale: scaleStage3 }}
          className="absolute inset-0 flex flex-col items-center justify-center px-6 z-20 pointer-events-none text-center"
        >
          <span className="text-xs font-mono tracking-[0.4em] text-core-red uppercase mb-4 font-bold">
            THE ATHLETIC THRESHOLD
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl md:text-7xl uppercase tracking-wider text-white max-w-4xl leading-tight">
            WHERE MOTION MEETS MASTERPIECE
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
