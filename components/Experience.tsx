"use client";

import dynamic from "next/dynamic";
import { useResponsiveSync } from "@/hooks/useResponsive";
import { ResponsiveHUD } from "./ResponsiveHUD";

// The WebGL scene is client-only (no SSR).
const SpaceScene = dynamic(
  () => import("./SpaceScene").then((m) => m.SpaceScene),
  {
    ssr: false,
    loading: () => <div className="scene-loading" aria-hidden />,
  }
);

export function Experience() {
  useResponsiveSync();
  return (
    <main className="experience">
      <SpaceScene />
      <ResponsiveHUD />
    </main>
  );
}
