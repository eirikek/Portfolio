"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitLayer } from "@/lib/portfolioData";
import { layerY } from "@/lib/orbits";
import { useRig } from "@/lib/rig";
import { Planet } from "./Planet";

interface PlanetOrbitProps {
  layer: OrbitLayer;
  layerIndex: number;
  isActive: boolean;
  selectedIndex: number;
  onSelectBody: (index: number) => void;
}

/**
 * One orbital plane: its faint orbit ring plus all of its bodies. The whole
 * group slides vertically based on how far this layer is from the active one,
 * so changing layers sweeps planes in and out of view.
 */
export function PlanetOrbit({
  layer,
  layerIndex,
  isActive,
  selectedIndex,
  onSelectBody,
}: PlanetOrbitProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rig = useRig();

  const ringGeometry = useMemo(() => {
    const segments = 128;
    const pts: number[] = [];
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(
        Math.cos(a) * layer.orbitRadius,
        0,
        Math.sin(a) * layer.orbitRadius
      );
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(pts), 3)
    );
    return g;
  }, [layer.orbitRadius]);

  const ringMatRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const y = layerY(layerIndex, rig.current.activeFloat);
    g.position.y = y;
    // Fade rings of distant layers.
    if (ringMatRef.current) {
      const dist = Math.abs(layerIndex - rig.current.activeFloat);
      ringMatRef.current.opacity = THREE.MathUtils.clamp(
        0.5 - dist * 0.35,
        0.04,
        0.5
      );
    }
  });

  return (
    <group ref={groupRef}>
      <lineLoop geometry={ringGeometry}>
        <lineBasicMaterial
          ref={ringMatRef}
          color={layer.accent}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </lineLoop>

      {layer.bodies.map((body, i) => (
        <Planet
          key={body.id}
          body={body}
          kind={layer.kind}
          orbitRadius={layer.orbitRadius}
          index={i}
          count={layer.bodies.length}
          selectedIndex={selectedIndex}
          isActiveLayer={isActive}
          ambientSpeed={layer.orbitSpeed}
          focused={isActive && i === selectedIndex}
          onSelect={() => onSelectBody(i)}
        />
      ))}
    </group>
  );
}
