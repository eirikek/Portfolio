"use client";

import { useEffect } from "react";
import { usePortfolioStore } from "@/lib/store";

/**
 * Wires keyboard arrows (desktop/tablet) and touch swipes (mobile) to scene
 * navigation: left/right = planets, up/down = orbital layers. Esc closes
 * panels.
 */
export function useInputControls() {
  useEffect(() => {
    const store = usePortfolioStore.getState;

    const onKey = (e: KeyboardEvent) => {
      const s = store();
      if (!s.entered) {
        if (e.key === "Enter" || e.key === " ") s.enter();
        return;
      }
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          s.prevBody();
          break;
        case "ArrowRight":
          e.preventDefault();
          s.nextBody();
          break;
        case "ArrowUp":
          e.preventDefault();
          s.prevLayer();
          break;
        case "ArrowDown":
          e.preventDefault();
          s.nextLayer();
          break;
        case "Enter":
          s.setDetailOpen(!s.detailOpen);
          break;
        case "Escape":
          if (s.rocketOpen) s.setRocketOpen(false);
          else s.setDetailOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let tracking = false;
    const THRESHOLD = 45;

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      tracking = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const onEnd = (e: TouchEvent) => {
      if (!tracking) return;
      tracking = false;
      const s = usePortfolioStore.getState();
      if (!s.entered) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) < THRESHOLD && Math.abs(dy) < THRESHOLD) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) s.nextBody();
        else s.prevBody();
      } else {
        if (dy < 0) s.nextLayer();
        else s.prevLayer();
      }
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);
}
