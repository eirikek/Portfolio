"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolioStore } from "@/lib/store";

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const MODEL_UP = new THREE.Vector3(0, 1, 0);

/**
 * The contact rocket. It continuously circles in the camera's view space so it
 * is *always* on screen, drifting around the upper part of the frame (above the
 * focused planet and the HUD). Built from primitives; clicking it opens the
 * contact panel. A soft glow + hint label makes it obviously interactive.
 */
export function RocketContact() {
  const groupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const setRocketOpen = usePortfolioStore((s) => s.setRocketOpen);
  const device = usePortfolioStore((s) => s.device);
  const camera = useThree((s) => s.camera);

  const v = useMemo(
    () => ({
      camPos: new THREE.Vector3(),
      fwd: new THREE.Vector3(),
      right: new THREE.Vector3(),
      up: new THREE.Vector3(),
      center: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      quat: new THREE.Quaternion(),
    }),
    []
  );

  useFrame((state) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // Build a basis from the camera so the orbit stays framed on screen.
    camera.getWorldPosition(v.camPos);
    camera.getWorldDirection(v.fwd);
    v.right.crossVectors(v.fwd, WORLD_UP).normalize();
    v.up.crossVectors(v.right, v.fwd).normalize();

    // Ellipse in front of the camera, biased upward so it clears the HUD.
    const fwdDist = 36;
    const rx = 17;
    const ry = 9;
    const upBias = 8;
    const theta = t * 0.45;
    const c = Math.cos(theta);
    const s = Math.sin(theta);

    v.center
      .copy(v.camPos)
      .addScaledVector(v.fwd, fwdDist)
      .addScaledVector(v.up, upBias);
    g.position
      .copy(v.center)
      .addScaledVector(v.right, c * rx)
      .addScaledVector(v.up, s * ry);

    // Orient the nose (+Y) along the travel tangent.
    v.vel
      .set(0, 0, 0)
      .addScaledVector(v.right, -s * rx)
      .addScaledVector(v.up, c * ry)
      .normalize();
    v.quat.setFromUnitVectors(MODEL_UP, v.vel);
    g.quaternion.copy(v.quat);

    // Flicker the flame.
    if (flameRef.current) {
      const f = 1 + Math.sin(t * 30) * 0.18;
      flameRef.current.scale.set(1, f, 1);
    }
  });

  const scale = device === "mobile" ? 1.7 : 1.25;

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
