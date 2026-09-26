'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float, Preload } from '@react-three/drei';
import { BarbellModel } from '@/components/3d/BarbellModel';
import { SceneLights } from '@/components/3d/SceneLights';
import { ShieldCheck } from 'lucide-react';

interface Contact3DCanvasProps {
  className?: string;
}

export function Contact3DCanvas({ className = '' }: Contact3DCanvasProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse offset between -1 and 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isMounted) {
    return (
      <div className={`w-full h-full flex items-center justify-center min-h-[320px] ${className}`}>
        <div className="w-12 h-12 rounded-full border-2 border-core-red/20 border-t-core-red animate-spin" />
      </div>
    );
  }

  if (!hasWebGL) {
    return (
      <div className={`w-full h-full flex items-center justify-center p-8 bg-core-dark/50 border border-white/10 rounded-2xl ${className}`}>
        <div className="text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-core-red/10 border border-core-red/30 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-core-red" />
          </div>
          <span className="text-xs font-mono text-white uppercase tracking-widest block font-bold">
            IPF CALIBRATED SWEDISH STEEL
          </span>
          <p className="text-[11px] font-mono text-core-muted uppercase tracking-wider">
            HIGH-TENSILE BAR ARCHITECTURE
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[360px] sm:min-h-[440px] overflow-hidden select-none pointer-events-none ${className}`}>
      {/* Ambient background glow behind 3D object */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-gradient-radial from-core-red/20 via-core-crimson/5 to-transparent rounded-full blur-[100px] pointer-events-none -z-10" />

      <Canvas
        camera={{ position: [0, 0.2, 6.8], fov: 40 }}
        dpr={[1, 1.8]}
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

          {/* Gentle anti-gravity levitation */}
          <Float
            speed={2.2}
            rotationIntensity={0.25}
            floatIntensity={0.45}
            floatingRange={[-0.12, 0.12]}
          >
            <BarbellModel scrollProgress={0} mousePos={mousePos} />
          </Float>

          {/* Realistic Contact Shadows on the floor plane */}
          <ContactShadows
            position={[0, -2.1, 0]}
            opacity={0.65}
            scale={12}
            blur={2.2}
            far={4.5}
            color="#000000"
          />

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
