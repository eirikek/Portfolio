"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { PortfolioBody, BodyKind } from "@/lib/portfolioData";
import { bodyLocalPosition, focusAngleFor } from "@/lib/orbits";
import { useRig } from "@/lib/rig";

const atmoVertex = /* glsl */ `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const atmoFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uStrength;
  varying vec3 vNormal;
  void main() {
    float fres = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), uPower);
    gl_FragColor = vec4(uColor, fres * uStrength);
  }
`;

const surfaceVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const surfaceFragment = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uDetail;
  uniform float uSeed;
  uniform float uBands;
  uniform float uSpots;
  uniform float uVariant;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.13));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += noise(p) * amplitude;
      p = p * 2.03 + 7.1;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec3 p = normalize(vPosition);
    float terrain = fbm(p * 5.0 + uSeed);
    float fine = fbm(p * 17.0 - uSeed);
    float bands = sin((p.y + terrain * 0.12) * 34.0 + uSeed) * 0.5 + 0.5;
    float mask = mix(terrain, bands, uBands);
    float crater = smoothstep(0.79, 0.83, fine) * uSpots;
    float latitude = abs(p.y);
    float ridges = abs(sin((p.x + terrain * 0.35) * 24.0));
    vec3 color;

    if (uVariant < 0.5) {
      color = mix(uBase * 0.52, uDetail, smoothstep(0.34, 0.72, terrain));
    } else if (uVariant < 1.5) {
      color = mix(uBase * 0.55, uDetail, smoothstep(0.18, 0.82, bands));
      color *= 0.88 + sin(p.y * 72.0 + uSeed) * 0.12;
    } else if (uVariant < 2.5) {
      color = mix(uBase * 0.45, uDetail * 0.72, smoothstep(0.38, 0.7, fine));
      color *= 1.0 - crater * 0.58;
    } else if (uVariant < 3.5) {
      float ice = smoothstep(0.62, 0.86, latitude + terrain * 0.12);
      color = mix(uBase * 0.48, uDetail, smoothstep(0.42, 0.64, terrain));
      color = mix(color, vec3(0.88, 0.95, 1.0), ice * 0.82);
    } else if (uVariant < 4.5) {
      float lava = smoothstep(0.78, 0.96, ridges + fine * 0.25);
      color = mix(uBase * 0.2, uDetail * 1.25, lava);
      color *= 0.72 + terrain * 0.38;
    } else {
      float swirls = sin((p.x + p.z + terrain * 0.2) * 19.0 + uSeed) * 0.5 + 0.5;
      color = mix(uBase * 0.58, uDetail, smoothstep(0.28, 0.78, swirls));
      color *= 0.82 + mask * 0.3;
    }

    vec3 lightDirection = normalize(vec3(-0.4, 0.55, 0.8));
    float diffuse = max(dot(normalize(vNormal), lightDirection), 0.0);
    float rim = pow(1.0 - max(vNormal.z, 0.0), 3.0);
    color *= 0.2 + diffuse * 0.9;
    color += uDetail * rim * 0.08;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const cloudFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uSeed;
  varying vec3 vNormal;
  varying vec3 vPosition;

  float hash(vec3 p) {
    return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453);
  }
  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
      mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
      mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  void main() {
    float cloud = noise(normalize(vPosition) * 9.0 + uSeed);
    cloud += noise(normalize(vPosition) * 19.0 - uSeed) * 0.45;
    float alpha = smoothstep(0.72, 1.05, cloud) * 0.38;
    alpha *= 0.35 + max(vNormal.z, 0.0) * 0.65;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface PlanetProps {
  body: PortfolioBody;
  kind: BodyKind;
  orbitRadius: number;
  index: number;
  count: number;
  selectedIndex: number;
  isActiveLayer: boolean;
  ambientSpeed: number;
  focused: boolean;
  onSelect: () => void;
}

export function Planet({
  body,
  kind,
  orbitRadius,
  index,
  count,
  selectedIndex,
  isActiveLayer,
  ambientSpeed,
  focused,
  onSelect,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(1);
  const [hovered, setHovered] = useState(false);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const rig = useRig();
  const visual = useMemo(() => {
    const seed = index * 4.71 + orbitRadius * 0.13;
    const isProject = kind === "project";
    const isExperience = kind === "experience";
    return {
      seed,
      variant: isProject ? 0 : isExperience ? 2 : index % 6,
      tilt: (index % 2 === 0 ? 1 : -1) * (0.08 + (index % 3) * 0.11),
      bands: 0.06,
      spots: isExperience ? 0.72 : 0.18,
      hasClouds: isProject,
      detail: isExperience ? 5 : 6,
    };
  }, [index, kind, orbitRadius]);

  const atmoUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(body.atmosphere) },
      uPower: { value: 4.0 },
      uStrength: { value: 0.42 },
    }),
    [body.atmosphere]
  );

  const surfaceUniforms = useMemo(
    () => ({
      uBase: { value: new THREE.Color(body.color) },
      uDetail: { value: new THREE.Color(body.atmosphere) },
      uSeed: { value: visual.seed },
      uBands: { value: visual.bands },
      uSpots: { value: visual.spots },
      uVariant: { value: visual.variant },
    }),
    [body.atmosphere, body.color, visual]
  );

  const cloudUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(body.atmosphere) },
      uSeed: { value: visual.seed },
    }),
    [body.atmosphere, visual.seed]
  );

  const clusterNodes = useMemo(() => {
    if (kind !== "cluster") return [];
    const tags = body.tags ?? [];
    const n = Math.max(4, tags.length);
    return Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2;
      const r = body.radius * (0.7 + Math.random() * 0.8);
      return new THREE.Vector3(
        Math.cos(a) * r,
        (Math.random() - 0.5) * body.radius,
        Math.sin(a) * r
      );
    });
  }, [kind, body]);

  useFrame((state, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const ambient = t * ambientSpeed * 0.08;
    const focusAngle = isActiveLayer
      ? rig.current.focusAngle
      : focusAngleFor(selectedIndex, count);
    bodyLocalPosition(tmp, orbitRadius, index, count, focusAngle, ambient);
    g.position.copy(tmp);
    g.position.y += Math.sin(t * 0.6 + index) * 0.25;

    const targetScale = focused ? 1.18 : hovered ? 1.08 : 1;
    scaleRef.current = THREE.MathUtils.damp(
      scaleRef.current,
      targetScale,
      6,
      dt
    );
    g.scale.setScalar(scaleRef.current);

    if (meshRef.current) {
      meshRef.current.rotation.y += dt * 0.15;
    }
  });

  const interactive = !focused;

  return (
    <group ref={groupRef}>
      <group
        onPointerOver={(e) => {
          if (!interactive) return;
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {kind === "cluster" ? (
          <group>
            <mesh>
              <icosahedronGeometry args={[body.radius * 0.45, 1]} />
              <meshStandardMaterial
                color={body.color}
                emissive={body.color}
                emissiveIntensity={0.8}
                roughness={0.4}
                metalness={0.1}
              />
            </mesh>
            {clusterNodes.map((p, i) => (
              <group key={i} position={p}>
                <mesh>
                  <sphereGeometry args={[0.16, 12, 12]} />
                  <meshStandardMaterial
                    color={body.atmosphere}
                    emissive={body.atmosphere}
                    emissiveIntensity={1.2}
                  />
                </mesh>
                <line>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      args={[
                        new Float32Array([0, 0, 0, -p.x, -p.y, -p.z]),
                        3,
                      ]}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial
                    color={body.atmosphere}
                    transparent
                    opacity={0.35}
                  />
                </line>
              </group>
            ))}
          </group>
        ) : (
          <group rotation={[visual.tilt, 0, -visual.tilt * 0.45]}>
            <mesh ref={meshRef}>
              <icosahedronGeometry args={[body.radius, visual.detail]} />
              <shaderMaterial
                vertexShader={surfaceVertex}
                fragmentShader={surfaceFragment}
                uniforms={surfaceUniforms}
              />
            </mesh>

            {visual.hasClouds && (
              <mesh scale={1.018} rotation={[0, visual.seed, 0]}>
                <icosahedronGeometry args={[body.radius, 6]} />
                <shaderMaterial
                  vertexShader={surfaceVertex}
                  fragmentShader={cloudFragment}
                  uniforms={cloudUniforms}
                  transparent
                  depthWrite={false}
                />
              </mesh>
            )}

            <mesh scale={1.045}>
              <icosahedronGeometry args={[body.radius, 5]} />
              <shaderMaterial
                vertexShader={atmoVertex}
                fragmentShader={atmoFragment}
                uniforms={atmoUniforms}
                transparent
                side={THREE.BackSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {kind === "satellite" && (
              <mesh rotation={[Math.PI / 2.4, 0, 0.4]}>
                <ringGeometry
                  args={[
                    body.radius * 1.45,
                    body.radius * 2.2,
                    96,
                  ]}
                />
                <meshBasicMaterial
                  color={body.atmosphere}
                  transparent
                  opacity={0.28}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>
            )}

          </group>
        )}
      </group>

      <Html
        center
        position={[0, body.radius * (kind === "cluster" ? 1.9 : 1.7) + 0.6, 0]}
        distanceFactor={18}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div className={`planet-label ${focused ? "is-focused" : ""}`}>
          {body.name}
        </div>
      </Html>
    </group>
  );
}
