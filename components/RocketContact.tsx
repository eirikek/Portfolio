"use client";

import { useRef, useMemo, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePortfolioStore } from "@/lib/store";

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const MODEL_UP = new THREE.Vector3(0, 1, 0);
const WINDOW_BLUE = new THREE.Color("#6cc6ff");
const WINDOW_RED = new THREE.Color("#ff3048");

export function RocketContact() {
  const groupRef = useRef<THREE.Group>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const letterMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const windowMatRef = useRef<THREE.MeshStandardMaterial>(null);
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

  // "CONTACT ME" painted around the hull like ship lettering. Repeated several
  // times around the circumference so a copy is almost always facing the
  // viewer as the rocket tumbles along its path.
  const contactTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const w = 3072;
    const h = 512;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.clearRect(0, 0, w, h);
    ctx.font = "900 150px var(--font-heading), Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const reps = 3;
    for (let i = 0; i < reps; i++) {
      const x = (w * (i + 0.5)) / reps;
      ctx.lineWidth = 20;
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(255,255,255,0.95)";
      ctx.strokeText("CONTACT ME", x, h / 2);
      ctx.fillStyle = "#ff5a5f";
      ctx.fillText("CONTACT ME", x, h / 2);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    return tex;
  }, []);

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

    // Keep the rocket clear of the sun (at the origin, radius 6) so it never
    // clips through it. Pushing radially outward is continuous at the boundary,
    // so there's no visible pop — it just glances around the star.
    const SUN_KEEPOUT = 16;
    const distFromSun = v.pos.length();
    if (distFromSun < SUN_KEEPOUT) {
      v.pos.multiplyScalar(SUN_KEEPOUT / Math.max(distFromSun, 0.0001));
    }

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

    if (letterMatRef.current) {
      const idle = 0.55 + Math.sin(t * 2.4) * 0.12;
      const target = hovered ? 1.6 : idle;
      letterMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        letterMatRef.current.emissiveIntensity,
        target,
        1 - Math.exp(-8 * dt)
      );
    }

    if (windowMatRef.current) {
      const redBlink = hovered && Math.sin(t * 11) > 0;
      const targetColor = redBlink ? WINDOW_RED : WINDOW_BLUE;
      windowMatRef.current.color.lerp(targetColor, 1 - Math.exp(-18 * dt));
      windowMatRef.current.emissive.lerp(targetColor, 1 - Math.exp(-18 * dt));
      windowMatRef.current.emissiveIntensity = redBlink ? 1.8 : 0.6;
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
        {contactTex && (
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.605, 0.605, 1.5, 24, 1, true]} />
            <meshStandardMaterial
              ref={letterMatRef}
              map={contactTex}
              emissive="#ff5a5f"
              emissiveMap={contactTex}
              emissiveIntensity={0.55}
              metalness={0.3}
              roughness={0.45}
              transparent
              alphaTest={0.05}
            />
          </mesh>
        )}
        <mesh position={[0, 1.7, 0]}>
          <coneGeometry args={[0.6, 1.1, 24]} />
          <meshStandardMaterial color="#ff5a5f" metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.5, 0.55]}>
          <sphereGeometry args={[0.28, 16, 16]} />
          <meshStandardMaterial
            ref={windowMatRef}
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
      </group>
    </group>
  );
}
