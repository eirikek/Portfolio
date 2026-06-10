"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolioStore } from "@/lib/store";

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const MODEL_UP = new THREE.Vector3(0, 1, 0);

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
      pos: new THREE.Vector3(),
      prev: new THREE.Vector3(),
      vel: new THREE.Vector3(),
      quat: new THREE.Quaternion(),
    }),
    []
  );
  const ready = useRef(false);

  useFrame((state, dt) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    camera.getWorldPosition(v.camPos);
    camera.getWorldDirection(v.fwd);
    v.right.crossVectors(v.fwd, WORLD_UP).normalize();
    v.up.crossVectors(v.right, v.fwd).normalize();

    const offRight =
      14 * Math.sin(t * 0.27 + 0.0) + 6.5 * Math.sin(t * 0.61 + 1.3);
    const offUp =
      7 +
      6 * Math.sin(t * 0.34 + 2.1) +
      3.5 * Math.sin(t * 0.19 + 0.7);
    const fwdDist = 35 + 5 * Math.sin(t * 0.12 + 0.4);

    v.pos
      .copy(v.camPos)
      .addScaledVector(v.fwd, fwdDist)
      .addScaledVector(v.right, offRight)
      .addScaledVector(v.up, offUp);

    if (!ready.current) {
      v.prev.copy(v.pos);
      ready.current = true;
    }
    g.position.copy(v.pos);

    v.vel.subVectors(v.pos, v.prev);
    v.prev.copy(v.pos);
    if (v.vel.lengthSq() > 1e-6) {
      v.vel.normalize();
      v.quat.setFromUnitVectors(MODEL_UP, v.vel);
      g.quaternion.slerp(v.quat, 1 - Math.exp(-6 * dt));
    }

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
        <mesh visible={false}>
          <boxGeometry args={[3, 6, 3]} />
          <meshBasicMaterial />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.6, 0.6, 2.4, 24]} />
          <meshStandardMaterial color="#e8edf6" metalness={0.6} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.7, 0]}>
          <coneGeometry args={[0.6, 1.1, 24]} />
          <meshStandardMaterial color="#ff5a5f" metalness={0.5} roughness={0.3} />
        </mesh>
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

        <pointLight color="#ffd9a0" intensity={hovered ? 18 : 8} distance={14} />
        <Html
          center
          position={[0, 3, 0]}
          distanceFactor={20}
          style={{ pointerEvents: "none" }}
        >
          <div className={`rocket-hint ${hovered ? "is-hovered" : ""}`}>
            Contact
          </div>
        </Html>
      </group>
    </group>
  );
}
