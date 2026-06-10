"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolioStore } from "@/lib/store";

/**
 * A discoverable contact rocket that periodically drifts across the scene.
 * Built from primitives. Clicking it opens the contact panel (DOM, in the
 * HUD). A soft pulsing glow + hint label makes it findable.
 */
export function RocketContact() {
  const groupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setRocketOpen = usePortfolioStore((s) => s.setRocketOpen);
  const device = usePortfolioStore((s) => s.device);

  // Travel period and path differ slightly so it feels organic.
  const period = 34;

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const phase = (t % period) / period; // 0..1 across the scene

    // Arc across the upper-right of the view, drifting down-left to up-right.
    const x = THREE.MathUtils.lerp(-46, 46, phase);
    const y = 16 + Math.sin(phase * Math.PI) * 10;
    const z = -18 + Math.cos(phase * Math.PI * 2) * 8;
    g.position.set(x, y, z);

    // Point the rocket along its travel direction (mostly +x, slight tilt).
    g.rotation.z = -Math.PI / 2 + Math.sin(phase * Math.PI) * 0.2;
    g.rotation.y = Math.sin(t * 0.5) * 0.15;

    // Flicker the flame.
    if (flameRef.current) {
      const s = 1 + Math.sin(t * 30) * 0.18;
      flameRef.current.scale.set(1, s, 1);
    }
  });

  const scale = device === "mobile" ? 1.5 : 1.1;

  return (
    <group ref={groupRef}>
      <group
        scale={scale}
        onPointerOver={(e) => {
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
          setRocketOpen(true);
        }}
      >
        {/* Generous invisible hitbox */}
        <mesh visible={false}>
          <boxGeometry args={[3, 6, 3]} />
          <meshBasicMaterial />
        </mesh>

        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 2.4, 24]} />
          <meshStandardMaterial color="#e8edf6" metalness={0.6} roughness={0.3} />
        </mesh>
        {/* Nose */}
        <mesh position={[0, 1.7, 0]}>
          <coneGeometry args={[0.6, 1.1, 24]} />
          <meshStandardMaterial color="#ff5a5f" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Window */}
        <mesh position={[0, 0.5, 0.55]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial
            color="#6cc6ff"
            emissive="#6cc6ff"
            emissiveIntensity={0.6}
            metalness={0.2}
            roughness={0.1}
          />
        </mesh>
        {/* Fins */}
        {[0, 1, 2].map((i) => (
          <mesh
            key={i}
            position={[0, -1.1, 0]}
            rotation={[0, (i / 3) * Math.PI * 2, 0]}
          >
            <boxGeometry args={[0.1, 0.9, 0.7]} />
            <meshStandardMaterial color="#ff5a5f" metalness={0.4} roughness={0.4} />
          </mesh>
        ))}
        {/* Flame */}
        <mesh ref={flameRef} position={[0, -1.8, 0]}>
          <coneGeometry args={[0.4, 1.4, 16]} />
          <meshBasicMaterial
            color="#ffb347"
            transparent
            opacity={0.9}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>

        {/* Discoverability glow + hint */}
        <pointLight color="#ffd9a0" intensity={hovered ? 18 : 8} distance={14} />
        <Html
          center
          position={[0, 3, 0]}
          distanceFactor={20}
          style={{ pointerEvents: "none" }}
        >
          <div className={`rocket-hint ${hovered ? "is-hovered" : ""}`}>
            Contact ✦
          </div>
        </Html>
      </group>
    </group>
  );
}
