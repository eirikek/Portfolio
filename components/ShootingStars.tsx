"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Meteor {
  active: boolean;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
}

/**
 * Occasional shooting stars. A small pool of streaks is recycled: each is a
 * stretched additive line that spawns off-screen, crosses the view and fades.
 * Spawn probability scales with device tier.
 */
export function ShootingStars({
  chance = 0.012,
  pool = 4,
}: {
  chance?: number;
  pool?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meteors = useMemo<Meteor[]>(
    () =>
      Array.from({ length: pool }, () => ({
        active: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
      })),
    [pool]
  );

  const trailGeo = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.06, 0.0, 1, 6, 1, true);
    // Orient the cylinder along +Z so we can point it along velocity.
    g.rotateX(Math.PI / 2);
    g.translate(0, 0, -0.5);
    return g;
  }, []);

  const spawn = (m: Meteor) => {
    const startX = -90 - Math.random() * 40;
    const startY = 30 + Math.random() * 60;
    const startZ = -40 - Math.random() * 80;
    m.pos.set(startX, startY, startZ);
    const speed = 90 + Math.random() * 70;
    m.vel.set(1, -0.45 - Math.random() * 0.3, 0.15).normalize().multiplyScalar(speed);
    m.maxLife = 1.4 + Math.random() * 0.8;
    m.life = m.maxLife;
    m.active = true;
  };

  useFrame((state, dt) => {
    const group = groupRef.current;
    if (!group) return;
    meteors.forEach((m, i) => {
      const mesh = group.children[i] as THREE.Mesh;
      if (!m.active) {
        if (Math.random() < chance) spawn(m);
        mesh.visible = false;
        return;
      }
      m.life -= dt;
      if (m.life <= 0) {
        m.active = false;
        mesh.visible = false;
        return;
      }
      m.pos.addScaledVector(m.vel, dt);
      const t = m.life / m.maxLife;
      const fade = Math.sin(t * Math.PI); // ease in and out
      const len = 6 + m.vel.length() * 0.06;
      mesh.visible = true;
      mesh.position.copy(m.pos);
      mesh.lookAt(m.pos.clone().add(m.vel));
      mesh.scale.set(1, 1, len);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = fade;
    });
  });

  return (
    <group ref={groupRef}>
      {meteors.map((_, i) => (
        <mesh key={i} geometry={trailGeo} visible={false}>
          <meshBasicMaterial
            color="#dcecff"
            transparent
            opacity={0}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
