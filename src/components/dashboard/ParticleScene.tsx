import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 15000;

interface ParticleSceneProps {
  activeStageId: string | null;
}

export function ParticleScene({ activeStageId }: ParticleSceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { camera } = useThree();

  // Initialize particle data
  const { positions, targets, colors, sizes, phases } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const targets = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT); // For random individual animation offset

    const colorObj = new THREE.Color();
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Start in a massive scattered cloud far away
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100 - 50;

      // Default target is a glowing core at origin
      targets[i * 3] = (Math.random() - 0.5) * 4;
      targets[i * 3 + 1] = (Math.random() - 0.5) * 4;
      targets[i * 3 + 2] = (Math.random() - 0.5) * 4;

      // Cyan-ish color
      colorObj.setHSL(0.5 + Math.random() * 0.1, 0.8, 0.5 + Math.random() * 0.5);
      colors[i * 3] = colorObj.r;
      colors[i * 3 + 1] = colorObj.g;
      colors[i * 3 + 2] = colorObj.b;

      sizes[i] = Math.random() * 2 + 0.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, targets, colors, sizes, phases };
  }, []);

  // Update targets based on the active stage
  useEffect(() => {
    if (!activeStageId) return;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      // Base behavior: update targets based on stage
      switch (activeStageId) {
        case 'dataset':
        case 'dictionary':
          // Converge to a tight bright core
          targets[idx] = (Math.random() - 0.5) * 2;
          targets[idx + 1] = (Math.random() - 0.5) * 2;
          targets[idx + 2] = (Math.random() - 0.5) * 2;
          break;
        case 'profiling':
          // Separate into distinct columns (3 groups)
          const group = i % 3;
          targets[idx] = (Math.random() - 0.5) * 2 + (group - 1) * 6;
          targets[idx + 1] = (Math.random() - 0.5) * 8;
          targets[idx + 2] = (Math.random() - 0.5) * 2;
          break;
        case 'quality':
          // Form a circular scanning ring
          const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
          const radius = 5 + Math.random() * 0.5;
          targets[idx] = Math.cos(angle) * radius;
          targets[idx + 1] = Math.sin(angle) * radius;
          targets[idx + 2] = (Math.random() - 0.5) * 1;
          break;
        case 'cleaning':
          // Messy block turning into a clean stream
          targets[idx] = (Math.random() - 0.5) * 10;
          targets[idx + 1] = (Math.random() - 0.5) * 1.5;
          targets[idx + 2] = (Math.random() - 0.5) * 1.5;
          break;
        case 'transformation':
        case 'feature_engineering':
          // Parallel streams
          const stream = i % 4;
          targets[idx] = (Math.random() - 0.5) * 20;
          targets[idx + 1] = (stream - 1.5) * 3;
          targets[idx + 2] = (Math.random() - 0.5) * 0.5;
          break;
        case 'synthetic_data':
          // Two big clouds
          const cloud = i < PARTICLE_COUNT * 0.75 ? -4 : 4;
          targets[idx] = cloud + (Math.random() - 0.5) * 4;
          targets[idx + 1] = (Math.random() - 0.5) * 4;
          targets[idx + 2] = (Math.random() - 0.5) * 4;
          break;
        case 'model_strategy':
        case 'model_selection':
          // Branching paths
          const path = i % 4;
          targets[idx] = (path - 1.5) * 5;
          targets[idx + 1] = (Math.random() - 0.5) * 10 - 2;
          targets[idx + 2] = (Math.random() - 0.5) * 2;
          break;
        case 'training':
        case 'validation':
        case 'prediction':
        case 'final_model':
          // Massive swirling vortex ending in a single glowing point
          const r = Math.random() * 8;
          const theta = Math.random() * Math.PI * 2;
          targets[idx] = Math.cos(theta) * r;
          targets[idx + 1] = Math.sin(theta) * r + (Math.random() - 0.5) * 2;
          targets[idx + 2] = (Math.random() - 0.5) * 2;
          break;
        default:
          targets[idx] = (Math.random() - 0.5) * 4;
          targets[idx + 1] = (Math.random() - 0.5) * 4;
          targets[idx + 2] = (Math.random() - 0.5) * 4;
      }
    }
  }, [activeStageId, targets]);

  // Animation loop
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const geom = pointsRef.current.geometry;
    const posAttribute = geom.attributes.position;
    const posArray = posAttribute.array as Float32Array;

    const time = state.clock.getElapsedTime();

    // Lerp factor
    const speed = 2.5 * delta;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      
      // Dynamic noise/swirl based on stage
      let targetX = targets[idx];
      let targetY = targets[idx + 1];
      let targetZ = targets[idx + 2];

      if (activeStageId === 'training') {
        // Swirling effect
        const currentX = posArray[idx];
        const currentY = posArray[idx + 1];
        const angle = Math.atan2(currentY, currentX) + 2.0 * delta;
        const radius = Math.sqrt(currentX * currentX + currentY * currentY) * 0.99; // pull in
        targetX = Math.cos(angle) * radius;
        targetY = Math.sin(angle) * radius;
      } else if (activeStageId === 'quality') {
        // Rotate the ring
        const currentX = posArray[idx];
        const currentY = posArray[idx + 1];
        const angle = Math.atan2(currentY, currentX) + 0.5 * delta;
        const radius = 5 + Math.sin(time * 2 + phases[i]) * 0.5;
        targetX = Math.cos(angle) * radius;
        targetY = Math.sin(angle) * radius;
      } else {
        // Standard gentle wave
        targetY += Math.sin(time * 2 + phases[i]) * 0.2;
      }

      posArray[idx] += (targetX - posArray[idx]) * speed;
      posArray[idx + 1] += (targetY - posArray[idx + 1]) * speed;
      posArray[idx + 2] += (targetZ - posArray[idx + 2]) * speed;
    }

    posAttribute.needsUpdate = true;
    
    // Slow camera orbit
    camera.position.x = Math.sin(time * 0.1) * 15;
    camera.position.z = Math.cos(time * 0.1) * 15;
    camera.position.y = Math.sin(time * 0.05) * 5;
    camera.lookAt(0, 0, 0);
  });

  // Custom material for glowing particles (Additive Blending)
  const particleMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8,
      map: createGlowTexture(),
    });
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={5} color="#22d3ee" distance={20} />
      <spotLight position={[0, 10, 0]} intensity={10} color="#8b5cf6" angle={0.5} penumbra={1} />
      
      <points ref={pointsRef} material={particleMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={PARTICLE_COUNT}
            array={positions}
            itemSize={3}
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={PARTICLE_COUNT}
            array={colors}
            itemSize={3}
            args={[colors, 3]}
          />
        </bufferGeometry>
      </points>
    </>
  );
}

// Generate a soft radial gradient texture programmatically to avoid external assets
function createGlowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
  }
  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
