"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import type { PortfolioBody, BodyKind } from "@/lib/portfolioData";
import { bodyLocalPosition } from "@/lib/orbits";

/** Fresnel atmosphere shell shader. */
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

interface PlanetProps {
  body: PortfolioBody;
  kind: BodyKind;
  orbitRadius: number;
  index: number;
  count: number;
  selectedIndex: number;
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
  ambientSpeed,
  focused,
  onSelect,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(1);
  const [hovered, setHovered] = useState(false);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  const atmoUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(body.atmosphere) },
      uPower: { value: 3.0 },
      uStrength: { value: 0.9 },
    }),
    [body.atmosphere]
  );

  // Skill clusters render as a small constellation of glowing nodes.
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
    bodyLocalPosition(tmp, orbitRadius, index, count, selectedIndex, ambient);
    g.position.copy(tmp);
    // Gentle bob.
    g.position.y += Math.sin(t * 0.6 + index) * 0.25;

    // Focused bodies grow slightly and pull forward toward the camera.
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
            {/* Constellation core */}
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
          <>
            <mesh ref={meshRef}>
              <sphereGeometry args={[body.radius, 48, 48]} />
              <meshStandardMaterial
                color={body.color}
                roughness={0.85}
                metalness={0.15}
                emissive={body.color}
                emissiveIntensity={0.08}
              />
            </mesh>
            {/* Atmosphere shell */}
            <mesh scale={1.12}>
              <sphereGeometry args={[body.radius, 48, 48]} />
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
            {/* Satellites get a thin ring for a "credential" feel */}
            {kind === "satellite" && (
              <mesh rotation={[Math.PI / 2.4, 0, 0.4]}>
                <ringGeometry args={[body.radius * 1.5, body.radius * 2.1, 64]} />
                <meshBasicMaterial
                  color={body.atmosphere}
                  transparent
                  opacity={0.4}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>
            )}
          </>
        )}
      </group>

      {/* Floating label */}
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
