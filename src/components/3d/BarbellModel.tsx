'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BarbellModelProps {
  scrollProgress?: number;
  mousePos?: { x: number; y: number };
}

export function BarbellModel({ scrollProgress = 0, mousePos = { x: 0, y: 0 } }: BarbellModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const barbellRef = useRef<THREE.Group>(null);

  // Procedural Knurling Texture generator for realistic steel grip
  const knurlTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#808080';
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 128; i += 4) {
        for (let j = 0; j < 128; j += 4) {
          if ((i + j) % 8 === 0) {
            ctx.fillRect(i, j, 2, 2);
          }
        }
      }
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(16, 2);
    return texture;
  }, []);

  // Frame animation loop for physics oscillation and mouse reaction
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.getElapsedTime();

    // Floating breathing effect (subtle anti-gravity levitation)
    const floatY = Math.sin(time * 1.2) * 0.12;
    const floatRotZ = Math.cos(time * 0.8) * 0.03;

    // Mouse responsiveness with smooth damping
    const targetRotY = mousePos.x * 0.35 + scrollProgress * 1.4;
    const targetRotX = -mousePos.y * 0.25 + 0.15 - scrollProgress * 0.3;
    const targetPosX = mousePos.x * 0.4;
    const targetPosY = floatY - mousePos.y * 0.2 - scrollProgress * 1.2;
    const targetPosZ = -scrollProgress * 2.0;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 4, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 4, delta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, floatRotZ - 0.08, 4, delta);

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetPosX, 4, delta);
    groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetPosY, 4, delta);
    groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetPosZ, 4, delta);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.15, -0.2, -0.08]}>
      <group ref={barbellRef}>
        {/* ======================================================== */}
        {/* 1. MAIN OLYMPIC STEEL SHAFT (Length: ~7.6 units, Diam: ~0.14) */}
        {/* ======================================================== */}
        
        {/* Smooth Center Shaft */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.07, 0.07, 1.2, 32]} />
          <meshStandardMaterial
            color="#D1D5DB"
            metalness={0.95}
            roughness={0.18}
          />
        </mesh>

        {/* Left Knurled Grip Section */}
        <mesh position={[-1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.071, 0.071, 1.2, 32]} />
          <meshStandardMaterial
            color="#9CA3AF"
            metalness={0.92}
            roughness={0.4}
            bumpMap={knurlTexture}
            bumpScale={0.02}
          />
        </mesh>

        {/* Right Knurled Grip Section */}
        <mesh position={[1.2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.071, 0.071, 1.2, 32]} />
          <meshStandardMaterial
            color="#9CA3AF"
            metalness={0.92}
            roughness={0.4}
            bumpMap={knurlTexture}
            bumpScale={0.02}
          />
        </mesh>

        {/* Outer Knurled Grip Section Left */}
        <mesh position={[-2.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.071, 0.071, 0.5, 32]} />
          <meshStandardMaterial
            color="#9CA3AF"
            metalness={0.92}
            roughness={0.4}
            bumpMap={knurlTexture}
            bumpScale={0.02}
          />
        </mesh>

        {/* Outer Knurled Grip Section Right */}
        <mesh position={[2.1, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.071, 0.071, 0.5, 32]} />
          <meshStandardMaterial
            color="#9CA3AF"
            metalness={0.92}
            roughness={0.4}
            bumpMap={knurlTexture}
            bumpScale={0.02}
          />
        </mesh>

        {/* ======================================================== */}
        {/* 2. ROTATING SLEEVE HUBS & COLLAR STOPS (Left & Right)   */}
        {/* ======================================================== */}
        {[-1, 1].map((side) => {
          const sleeveOffset = side * 2.5;
          return (
            <group key={`sleeve-side-${side}`}>
              {/* Inner Flange / Collar Stop */}
              <mesh position={[side * 2.45, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.18, 0.18, 0.08, 32]} />
                <meshStandardMaterial
                  color="#E2E8F0"
                  metalness={0.96}
                  roughness={0.12}
                />
              </mesh>

              {/* Red Anodized Accent Ring on Inner Flange */}
              <mesh position={[side * 2.49, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.182, 0.182, 0.02, 32]} />
                <meshStandardMaterial
                  color="#FF2A2A"
                  metalness={0.85}
                  roughness={0.25}
                  emissive="#FF2A2A"
                  emissiveIntensity={0.2}
                />
              </mesh>

              {/* Main Chrome Loading Sleeve */}
              <mesh position={[sleeveOffset + side * 0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                <cylinderGeometry args={[0.125, 0.125, 1.7, 32]} />
                <meshStandardMaterial
                  color="#F1F5F9"
                  metalness={0.98}
                  roughness={0.1}
                />
              </mesh>

              {/* Sleeve End Cap with Laser Engraved Core X logo styling */}
              <mesh position={[sleeveOffset + side * 1.75, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.124, 0.124, 0.03, 32]} />
                <meshStandardMaterial
                  color="#0F172A"
                  metalness={0.9}
                  roughness={0.3}
                />
              </mesh>

              {/* ==================================================== */}
              {/* 3. CALIBRATED COMPETITION BUMPER PLATES             */}
              {/* ==================================================== */}
              
              {/* Plate 1: 25KG Competition RED Bumper Plate */}
              <group position={[sleeveOffset + side * 0.18, 0, 0]}>
                {/* Outer Rubber Rim */}
                <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                  <cylinderGeometry args={[1.05, 1.05, 0.14, 48]} />
                  <meshStandardMaterial
                    color="#D32F2F"
                    roughness={0.45}
                    metalness={0.15}
                  />
                </mesh>
                {/* Raised Rim Outer Lip */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <torusGeometry args={[0.98, 0.06, 16, 48]} />
                  <meshStandardMaterial
                    color="#B71C1C"
                    roughness={0.4}
                    metalness={0.2}
                  />
                </mesh>
                {/* Center Chrome Hub */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.35, 0.35, 0.145, 32]} />
                  <meshStandardMaterial
                    color="#E2E8F0"
                    metalness={0.95}
                    roughness={0.15}
                  />
                </mesh>
              </group>

              {/* Plate 2: 20KG Matte Onyx & Titanium Plate */}
              <group position={[sleeveOffset + side * 0.35, 0, 0]}>
                <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                  <cylinderGeometry args={[1.02, 1.02, 0.13, 48]} />
                  <meshStandardMaterial
                    color="#1E293B"
                    roughness={0.55}
                    metalness={0.3}
                  />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <torusGeometry args={[0.95, 0.05, 16, 48]} />
                  <meshStandardMaterial
                    color="#0F172A"
                    roughness={0.5}
                    metalness={0.3}
                  />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.32, 0.32, 0.135, 32]} />
                  <meshStandardMaterial
                    color="#CBD5E1"
                    metalness={0.95}
                    roughness={0.15}
                  />
                </mesh>
              </group>

              {/* Plate 3: 10KG Precision Accent Plate (Slightly smaller diameter) */}
              <group position={[sleeveOffset + side * 0.5, 0, 0]}>
                <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.82, 0.82, 0.09, 48]} />
                  <meshStandardMaterial
                    color="#27272A"
                    roughness={0.5}
                    metalness={0.4}
                  />
                </mesh>
                {/* Crimson Accent Lip Ring */}
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <torusGeometry args={[0.76, 0.04, 16, 48]} />
                  <meshStandardMaterial
                    color="#FF2A2A"
                    roughness={0.3}
                    metalness={0.7}
                    emissive="#FF2A2A"
                    emissiveIntensity={0.15}
                  />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.3, 0.3, 0.095, 32]} />
                  <meshStandardMaterial
                    color="#E2E8F0"
                    metalness={0.95}
                    roughness={0.15}
                  />
                </mesh>
              </group>

              {/* Plate 4: 5KG Calibrated White Accent Plate */}
              <group position={[sleeveOffset + side * 0.61, 0, 0]}>
                <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow>
                  <cylinderGeometry args={[0.65, 0.65, 0.06, 48]} />
                  <meshStandardMaterial
                    color="#F8FAFC"
                    roughness={0.35}
                    metalness={0.4}
                  />
                </mesh>
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.28, 0.28, 0.065, 32]} />
                  <meshStandardMaterial
                    color="#E2E8F0"
                    metalness={0.95}
                    roughness={0.15}
                  />
                </mesh>
              </group>

              {/* ==================================================== */}
              {/* 4. OLYMPIC LOCKING COLLAR CLAMP                     */}
              {/* ==================================================== */}
              <group position={[sleeveOffset + side * 0.72, 0, 0]}>
                {/* Anodized Crimson Clamp Body */}
                <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
                  <cylinderGeometry args={[0.24, 0.24, 0.1, 32]} />
                  <meshStandardMaterial
                    color="#E11D48"
                    metalness={0.88}
                    roughness={0.2}
                    emissive="#E11D48"
                    emissiveIntensity={0.25}
                  />
                </mesh>
                {/* Quick-release lever */}
                <mesh position={[0, 0.25, 0]} rotation={[0.4, 0, 0]} castShadow>
                  <boxGeometry args={[0.06, 0.22, 0.05]} />
                  <meshStandardMaterial
                    color="#1E293B"
                    metalness={0.9}
                    roughness={0.3}
                  />
                </mesh>
              </group>
            </group>
          );
        })}
      </group>
    </group>
  );
}
