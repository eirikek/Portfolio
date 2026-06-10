"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import type { Line2 } from "three/examples/jsm/lines/Line2.js";
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

export function PlanetOrbit({
  layer,
  layerIndex,
  isActive,
  selectedIndex,
  onSelectBody,
}: PlanetOrbitProps) {
  const groupRef = useRef<THREE.Group>(null);
  const rig = useRig();

  const ringPoints = useMemo(() => {
    const segments = 128;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      pts.push(new THREE.Vector3(
        Math.cos(a) * layer.orbitRadius,
        0,
        Math.sin(a) * layer.orbitRadius
      ));
    }
    return pts;
  }, [layer.orbitRadius]);

  const ringRef = useRef<Line2>(null);

  useFrame(() => {
    const g = groupRef.current;
    if (!g) return;
    const y = layerY(layerIndex, rig.current.activeFloat);
    g.position.y = y;
    if (ringRef.current?.material) {
      const dist = Math.abs(layerIndex - rig.current.activeFloat);
      ringRef.current.material.opacity = THREE.MathUtils.clamp(
        0.62 - dist * 0.35,
        0.08,
        0.62
      );
    }
  });

  return (
    <group ref={groupRef}>
      <Line
        ref={ringRef}
        points={ringPoints}
        color={layer.accent}
        lineWidth={1.6}
        transparent
        opacity={0.5}
        depthWrite={false}
      />

      {layer.bodies.map((body, i) => (
        <Planet
          key={body.id}
          body={body}
          kind={layer.kind}
          orbitRadius={layer.orbitRadius}
          index={i}
          count={layer.bodies.length}
          layerIndex={layerIndex}
          ambientSpeed={layer.orbitSpeed}
          focused={isActive && i === selectedIndex}
          onSelect={() => onSelectBody(i)}
        />
      ))}
    </group>
  );
}
