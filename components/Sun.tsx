"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";

/**
 * The Sun. A shader-driven sphere with flowing surface noise, a pulsing
 * emissive core, plus two additive glow billboards that make it read as a
 * huge living star with a soft halo. A point light casts warm light onto
 * nearby planets.
 */

const surfaceVertex = /* glsl */ `
  varying vec3 vPosition;
  varying vec3 vNormal;
  void main() {
    vPosition = position;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const surfaceFragment = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorHot;
  uniform vec3 uColorCold;
  varying vec3 vPosition;
  varying vec3 vNormal;

  // Classic 3D simplex-ish value noise (cheap, good enough for a sun).
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)),
             dot(p, vec3(269.5, 183.3, 246.1)),
             dot(p, vec3(113.5, 271.9, 124.6)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(dot(hash3(i + vec3(0,0,0)), f - vec3(0,0,0)),
              dot(hash3(i + vec3(1,0,0)), f - vec3(1,0,0)), u.x),
          mix(dot(hash3(i + vec3(0,1,0)), f - vec3(0,1,0)),
              dot(hash3(i + vec3(1,1,0)), f - vec3(1,1,0)), u.x), u.y),
      mix(mix(dot(hash3(i + vec3(0,0,1)), f - vec3(0,0,1)),
              dot(hash3(i + vec3(1,0,1)), f - vec3(1,0,1)), u.x),
          mix(dot(hash3(i + vec3(0,1,1)), f - vec3(0,1,1)),
              dot(hash3(i + vec3(1,1,1)), f - vec3(1,1,1)), u.x), u.y),
      u.z);
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec3 p = normalize(vPosition);
    float t = uTime * 0.12;
    // Two layers of drifting noise = churning plasma surface.
    float n = fbm(p * 2.2 + vec3(t, t * 0.6, -t));
    float n2 = fbm(p * 5.0 - vec3(t * 0.4, t, t * 0.7));
    float surface = n * 0.65 + n2 * 0.35;
    surface = surface * 0.5 + 0.5;

    // Pulsing brightness.
    float pulse = 0.85 + 0.15 * sin(uTime * 1.4);

    vec3 col = mix(uColorCold, uColorHot, smoothstep(0.35, 0.85, surface));
    col *= 0.7 + surface * 0.9;
    col *= pulse;

    // Limb brightening near the silhouette edge.
    float fres = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
    col += uColorHot * fres * 0.6;

    gl_FragColor = vec4(col, 1.0);
  }
`;

const glowVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;
  varying vec2 vUv;
  void main() {
    float d = distance(vUv, vec2(0.5));
    float pulse = 0.9 + 0.1 * sin(uTime * 1.2);
    float a = smoothstep(0.5, 0.0, d);
    a = pow(a, 2.2) * uIntensity * pulse;
    gl_FragColor = vec4(uColor, a);
  }
`;

export function Sun({ radius = 6 }: { radius?: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const glowRef = useRef<THREE.ShaderMaterial>(null);
  const glow2Ref = useRef<THREE.ShaderMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const surfaceUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorHot: { value: new THREE.Color("#fff3b0") },
      uColorCold: { value: new THREE.Color("#ff6a00") },
    }),
    []
  );

  const glowUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#ffae42") },
      uIntensity: { value: 1.0 },
    }),
    []
  );

  const glow2Uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#ff7b00") },
      uIntensity: { value: 0.55 },
    }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    surfaceUniforms.uTime.value = t;
    glowUniforms.uTime.value = t;
    glow2Uniforms.uTime.value = t;
    if (lightRef.current) {
      lightRef.current.intensity = 900 + Math.sin(t * 1.4) * 120;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh>
        <sphereGeometry args={[radius, 96, 96]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={surfaceVertex}
          fragmentShader={surfaceFragment}
          uniforms={surfaceUniforms}
          toneMapped={false}
        />
      </mesh>

      {/* Inner halo */}
      <Billboard>
        <mesh>
          <planeGeometry args={[radius * 4.2, radius * 4.2]} />
          <shaderMaterial
            ref={glowRef}
            vertexShader={glowVertex}
            fragmentShader={glowFragment}
            uniforms={glowUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </Billboard>

      {/* Outer atmosphere bloom */}
      <Billboard>
        <mesh>
          <planeGeometry args={[radius * 8, radius * 8]} />
          <shaderMaterial
            ref={glow2Ref}
            vertexShader={glowVertex}
            fragmentShader={glowFragment}
            uniforms={glow2Uniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      </Billboard>

      <pointLight
        ref={lightRef}
        color="#ffd9a0"
        intensity={900}
        distance={120}
        decay={1.6}
      />
    </group>
  );
}
