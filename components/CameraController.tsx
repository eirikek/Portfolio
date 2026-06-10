"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { layers } from "@/lib/portfolioData";
import { bodyLocalPosition, layerY, dampV3 } from "@/lib/orbits";
import { useRig } from "@/lib/rig";
import { usePortfolioStore, type DeviceTier } from "@/lib/store";

/**
 * Updates the shared rig state (fractional active layer). Rendered first so
 * the orbital layers and the camera read a freshly-damped value each frame.
 */
export function RigController() {
  const rig = useRig();
  const layerIndex = usePortfolioStore((s) => s.layerIndex);
  useFrame((_, dt) => {
    rig.current.activeFloat = THREE.MathUtils.damp(
      rig.current.activeFloat,
      layerIndex,
      4,
      dt
    );
  });
  return null;
}

/** Per-device camera framing. Tablet/mobile reduce sweep + distance. */
const FRAMING: Record<
  DeviceTier,
  { dist: number; height: number; sideX: number; azimuth: number; lerp: number }
> = {
  desktop: { dist: 22, height: 7, sideX: 4.5, azimuth: 0.5, lerp: 2.6 },
  tablet: { dist: 26, height: 6, sideX: 3, azimuth: 0.32, lerp: 2.4 },
  mobile: { dist: 30, height: 5, sideX: 1.5, azimuth: 0.2, lerp: 2.2 },
};

export function CameraController() {
  const rig = useRig();
  const camera = useThree((s) => s.camera);

  const layerIndex = usePortfolioStore((s) => s.layerIndex);
  const bodyIndex = usePortfolioStore((s) => s.bodyIndex);
  const entered = usePortfolioStore((s) => s.entered);
  const device = usePortfolioStore((s) => s.device);

  const targetPos = useRef(new THREE.Vector3(40, 18, 50));
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));
  const desiredPos = useMemo(() => new THREE.Vector3(), []);
  const desiredLook = useMemo(() => new THREE.Vector3(), []);
  const bodyLocal = useMemo(() => new THREE.Vector3(), []);
  const offset = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const frame = FRAMING[device];
    const layer = layers[layerIndex];
    const ambient = t * layer.orbitSpeed * 0.08;

    // Focused body's world position (same maths the planet uses).
    bodyLocalPosition(
      bodyLocal,
      layer.orbitRadius,
      bodyIndex,
      layer.bodies.length,
      bodyIndex,
      ambient
    );
    const worldY = layerY(layerIndex, rig.current.activeFloat);

    if (!entered) {
      // Cinematic establishing shot: wide, sun huge on the left.
      desiredLook.set(6, 0, 0);
      desiredPos.set(34, 14, 46);
    } else {
      desiredLook.set(bodyLocal.x, worldY + bodyLocal.y, bodyLocal.z);

      // Offset rotates with the active layer so changing layers sweeps the
      // camera around the system; height varies per layer for variety.
      const az = rig.current.activeFloat * frame.azimuth;
      offset.set(frame.sideX, frame.height + rig.current.activeFloat * 1.2, frame.dist);
      offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), az);
      // Subtle idle drift so it never feels frozen.
      offset.x += Math.sin(t * 0.15) * 1.2;
      offset.y += Math.cos(t * 0.12) * 0.8;

      desiredPos.copy(desiredLook).add(offset);
    }

    dampV3(targetPos.current, desiredPos, frame.lerp, dt);
    dampV3(lookAt.current, desiredLook, frame.lerp, dt);

    camera.position.copy(targetPos.current);
    camera.lookAt(lookAt.current);
  });

  return null;
}
