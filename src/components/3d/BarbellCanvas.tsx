'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float, Preload } from '@react-three/drei';
import { BarbellModel } from './BarbellModel';
import { SceneLights } from './SceneLights';

interface BarbellCanvasProps {
  className?: string;
  scrollProgress?: number;
}

export function BarbellCanvas({ className = '', scrollProgress = 0 }: BarbellCanvasProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    // Check WebGL support
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    // Mouse movement tracking for interactive 3D parallax
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isMounted) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <div className="w-16 h-16 rounded-full border-2 border-core-red/30 border-t-core-red animate-spin" />
      </div>
    );
  }

  if (!hasWebGL) {
    return (
      <div className={`w-full h-full flex items-center justify-center relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-radial from-core-surface/80 via-core-dark/95 to-core-void" />
        <div className="relative z-10 text-center px-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-core-red/10 border border-core-red/30 flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-core-red">CORE X</span>
          </div>
          <p className="text-core-muted font-mono text-sm tracking-widest uppercase">
            3D Acceleration Mode
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0.4, 7.2], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        className="pointer-events-auto"
      >
        <Suspense fallback={null}>
          <SceneLights />

          <Float
            speed={2}
            rotationIntensity={0.2}
            floatIntensity={0.4}
            floatingRange={[-0.1, 0.1]}
          >
            <BarbellModel scrollProgress={scrollProgress} mousePos={mousePos} />
          </Float>

          {/* Realistic Floor Contact Shadow */}
          <ContactShadows
            position={[0, -2.4, 0]}
            opacity={0.75}
            scale={14}
            blur={2.5}
            far={5}
            color="#000000"
          />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
