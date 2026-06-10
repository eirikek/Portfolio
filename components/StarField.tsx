"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A deep-space star field rendered as a single additive point cloud.
 * Stars sit at varied depths (parallax), drift very slowly and twinkle via a
 * per-star phase in the shader. Count scales with device tier for performance.
 */

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute float aPhase;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  varying float vTwinkle;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    vTwinkle = 0.55 + 0.45 * sin(uTime * 1.5 + aPhase);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * uPixelRatio * (300.0 / -mvPosition.z);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vTwinkle;
  varying vec3 vColor;
  void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 1.8) * vTwinkle;
    gl_FragColor = vec4(vColor, a);
  }
`;

export function StarField({ count = 6000 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const { positions, sizes, phases, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#cfe3ff"),
      new THREE.Color("#ffe8c4"),
      new THREE.Color("#d6c4ff"),
    ];
    for (let i = 0; i < count; i++) {
      // Distribute on a large spherical shell with depth variation.
      const r = 120 + Math.random() * 260;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      sizes[i] = 1.2 + Math.random() * 3.2;
      phases[i] = Math.random() * Math.PI * 2;
      const c = palette[(Math.random() * palette.length) | 0];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, sizes, phases, colors };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1,
      },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (pointsRef.current) {
      // Very slow drift for subtle life + parallax against planets.
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
      pointsRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.02) * 0.05;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aPhase" args={[phases, 1]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
