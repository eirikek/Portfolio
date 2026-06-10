import { createContext, useContext } from "react";

/**
 * Shared, mutable camera-rig state updated once per frame by <RigController>
 * and read by the orbital layers + camera so they stay perfectly in sync
 * during transitions (no per-component damping drift).
 */
export interface RigState {
  /** Fractional active layer index (lerped toward the store's layerIndex). */
  activeFloat: number;
  /**
   * Damped rotation of each layer's ring (one entry per layer). Each ring keeps
   * its own angle so every row remembers where it was rotated to; the active
   * ring only spins toward its focused planet once the camera has descended to
   * that row (see RigController), giving a "move to the row, then rotate" feel.
   */
  ringAngles: number[];
}

export const RigContext = createContext<{ current: RigState } | null>(null);

export function useRig() {
  const ctx = useContext(RigContext);
  if (!ctx) throw new Error("useRig must be used within RigContext");
  return ctx;
}
