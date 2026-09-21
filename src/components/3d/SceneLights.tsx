'use client';

import React from 'react';

export function SceneLights() {
  return (
    <>
      {/* Ambient subtle environment fill */}
      <ambientLight intensity={0.4} color="#0A0F1D" />

      {/* Main Key Studio Light */}
      <directionalLight
        position={[6, 8, 8]}
        intensity={2.2}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
      />

      {/* Rim / Backlight - High Energy Core Red glow */}
      <directionalLight
        position={[-8, -2, -6]}
        intensity={3.5}
        color="#FF2A2A"
      />

      {/* Top Cool Specular Streak Light */}
      <spotLight
        position={[0, 10, 4]}
        intensity={2.8}
        angle={0.6}
        penumbra={0.8}
        color="#E2E8F0"
      />

      {/* Bottom Subtle Metallic Ground Bounce */}
      <pointLight position={[0, -4, 2]} intensity={1.2} color="#94A3B8" />
    </>
  );
}
