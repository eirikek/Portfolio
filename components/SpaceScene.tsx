"use client";

import { useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
} from "@react-three/postprocessing";
import { layers } from "@/lib/portfolioData";
import { usePortfolioStore } from "@/lib/store";
import { useQuality } from "@/hooks/useResponsive";
import { RigContext, type RigState } from "@/lib/rig";
import { Sun } from "./Sun";
import { StarField } from "./StarField";
import { ShootingStars } from "./ShootingStars";
import { SpaceDust } from "./SpaceDust";
import { PlanetOrbit } from "./PlanetOrbit";
import { RocketContact } from "./RocketContact";
import {
  CameraController,
  RigController,
} from "./CameraController";

function SceneContents() {
  const quality = useQuality();
  const layerIndex = usePortfolioStore((s) => s.layerIndex);
  const bodyIndex = usePortfolioStore((s) => s.bodyIndex);
  const setBody = usePortfolioStore((s) => s.setBody);
  const setDetailOpen = usePortfolioStore((s) => s.setDetailOpen);
  const detailOpen = usePortfolioStore((s) => s.detailOpen);

  const handleSelect = (layerIdx: number, i: number) => {
    if (layerIdx === layerIndex && i === bodyIndex) {
      // Clicking the already-focused planet toggles its detail panel.
      setDetailOpen(!detailOpen);
    } else {
      setBody(i);
    }
  };

  return (
    <>
      {/* Order matters: rig updates first, then layers + camera read it. */}
      <RigController />

      <ambientLight intensity={0.18} />
      <hemisphereLight intensity={0.15} groundColor="#0a0a1a" />

      <Sun radius={6} />
      <StarField count={quality.starCount} />
      <ShootingStars chance={quality.shootingStarChance} />
      <SpaceDust count={quality.dustCount} />

      {layers.map((layer, i) => (
        <PlanetOrbit
          key={layer.id}
          layer={layer}
          layerIndex={i}
          isActive={i === layerIndex}
          selectedIndex={i === layerIndex ? bodyIndex : 0}
          onSelectBody={(bi) => handleSelect(i, bi)}
        />
      ))}

      <RocketContact />

      <CameraController />

      <EffectComposer enableNormalPass={false}>
        {[
          quality.enableBloom ? (
            <Bloom
              key="bloom"
              intensity={quality.bloomIntensity}
              luminanceThreshold={0.35}
              luminanceSmoothing={0.9}
              mipmapBlur
              radius={0.8}
            />
          ) : null,
          quality.enableDof ? (
            <DepthOfField
              key="dof"
              focusDistance={0.02}
              focalLength={0.04}
              bokehScale={3}
            />
          ) : null,
          <Vignette key="vignette" eskil={false} offset={0.25} darkness={0.85} />,
        ].filter(Boolean) as JSX.Element[]}
      </EffectComposer>
    </>
  );
}

export function SpaceScene() {
  const quality = useQuality();
  const rig = useRef<RigState>({ activeFloat: 0 });

  return (
    <Canvas
      dpr={quality.dpr}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: false,
      }}
      camera={{ fov: 55, near: 0.1, far: 2000, position: [40, 18, 50] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#03040c"]} />
      <fog attach="fog" args={["#03040c", 80, 420]} />
      <RigContext.Provider value={rig}>
        <Suspense fallback={null}>
          <SceneContents />
        </Suspense>
      </RigContext.Provider>
    </Canvas>
  );
}
