import { createContext, useContext } from "react";

/**
 * Shared, mutable camera-rig state updated once per frame by <RigController>
 * and read by the orbital layers + camera so they stay perfectly in sync
 * during transitions (no per-component damping drift).
 */
export interface RigState {
  /** Fractional active layer index (lerped toward the store's layerIndex). */
  activeFloat: number;
  /** Damped rotation of the active layer's ring (drives the orbit spin). */
  focusAngle: number;
}

export const RigContext = createContext<{ current: RigState } | null>(null);

export function useRig() {
  const ctx = useContext(RigContext);
  if (!ctx) throw new Error("useRig must be used within RigContext");
  return ctx;
}
