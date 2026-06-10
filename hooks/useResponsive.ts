"use client";

import { useEffect } from "react";
import { usePortfolioStore, type DeviceTier } from "@/lib/store";

function tierFor(width: number): DeviceTier {
  if (width < 768) return "mobile";
  if (width < 1200) return "tablet";
  return "desktop";
}

/**
 * Quality + layout presets per device tier. These drive particle counts,
 * postprocessing intensity and DPR so the scene stays smooth on weaker
 * devices.
 */
export interface QualityPreset {
  starCount: number;
  dustCount: number;
  bloomIntensity: number;
  enableBloom: boolean;
  enableDof: boolean;
  dpr: [number, number];
  shootingStarChance: number;
}

export const QUALITY: Record<DeviceTier, QualityPreset> = {
  desktop: {
    starCount: 6000,
    dustCount: 900,
    bloomIntensity: 0.72,
    enableBloom: true,
    enableDof: false,
    dpr: [1, 2],
    shootingStarChance: 0.012,
  },
  tablet: {
    starCount: 3500,
    dustCount: 450,
    bloomIntensity: 0.58,
    enableBloom: true,
    enableDof: false,
    dpr: [1, 1.5],
    shootingStarChance: 0.009,
  },
  mobile: {
    starCount: 1800,
    dustCount: 0,
    bloomIntensity: 0.7,
    enableBloom: false,
    enableDof: false,
    dpr: [1, 1.5],
    shootingStarChance: 0.006,
  },
};

/** Syncs the store's device tier with the viewport width. */
export function useResponsiveSync() {
  const setDevice = usePortfolioStore((s) => s.setDevice);

  useEffect(() => {
    const update = () => setDevice(tierFor(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [setDevice]);
}

export function useQuality(): QualityPreset {
  const device = usePortfolioStore((s) => s.device);
  return QUALITY[device];
}
