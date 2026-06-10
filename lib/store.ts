"use client";

import { create } from "zustand";
import { layers, layerOrder, type LayerId } from "./portfolioData";

export type DeviceTier = "desktop" | "tablet" | "mobile";

/** Immutably set one layer's remembered body index. */
function withBody(arr: number[], layerIndex: number, bodyIndex: number): number[] {
  const next = arr.slice();
  next[layerIndex] = bodyIndex;
  return next;
}

interface PortfolioState {
  /** Index of the active orbital layer. */
  layerIndex: number;
  /** Index of the focused body within the active layer. */
  bodyIndex: number;
  /** Remembered focused body per layer, so each row restores its last planet. */
  bodyByLayer: number[];
  /** Whether the contact rocket panel is open. */
  rocketOpen: boolean;
  /** Whether the intro overlay has been dismissed. */
  entered: boolean;
  /** Whether the detail panel for the focused body is open. */
  detailOpen: boolean;
  /** Current responsive device tier (drives quality + layout). */
  device: DeviceTier;

  activeLayerId: () => LayerId;

  nextLayer: () => void;
  prevLayer: () => void;
  setLayer: (index: number) => void;

  nextBody: () => void;
  prevBody: () => void;
  setBody: (index: number) => void;
  /** Jump straight to a specific body in a specific layer (e.g. clicking a
   *  planet that belongs to a different orbital layer). */
  focusBody: (layerIndex: number, bodyIndex: number) => void;

  setRocketOpen: (open: boolean) => void;
  setDetailOpen: (open: boolean) => void;
  enter: () => void;
  setDevice: (device: DeviceTier) => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  layerIndex: 0,
  bodyIndex: 0,
  bodyByLayer: layers.map(() => 0),
  rocketOpen: false,
  entered: false,
  detailOpen: false,
  device: "desktop",

  activeLayerId: () => layerOrder[get().layerIndex],

  nextLayer: () =>
    set((s) => {
      const layerIndex = (s.layerIndex + 1) % layers.length;
      // Restore the planet this layer was last focused on.
      return { layerIndex, bodyIndex: s.bodyByLayer[layerIndex] ?? 0 };
    }),
  prevLayer: () =>
    set((s) => {
      const layerIndex = (s.layerIndex - 1 + layers.length) % layers.length;
      return { layerIndex, bodyIndex: s.bodyByLayer[layerIndex] ?? 0 };
    }),
  setLayer: (index) =>
    set((s) => {
      const layerIndex = ((index % layers.length) + layers.length) % layers.length;
      return { layerIndex, bodyIndex: s.bodyByLayer[layerIndex] ?? 0 };
    }),

  nextBody: () =>
    set((s) => {
      const count = layers[s.layerIndex].bodies.length;
      const bodyIndex = (s.bodyIndex + 1) % count;
      return { bodyIndex, bodyByLayer: withBody(s.bodyByLayer, s.layerIndex, bodyIndex) };
    }),
  prevBody: () =>
    set((s) => {
      const count = layers[s.layerIndex].bodies.length;
      const bodyIndex = (s.bodyIndex - 1 + count) % count;
      return { bodyIndex, bodyByLayer: withBody(s.bodyByLayer, s.layerIndex, bodyIndex) };
    }),
  setBody: (index) =>
    set((s) => {
      const count = layers[s.layerIndex].bodies.length;
      const bodyIndex = ((index % count) + count) % count;
      return { bodyIndex, bodyByLayer: withBody(s.bodyByLayer, s.layerIndex, bodyIndex) };
    }),
  focusBody: (layerIndex, bodyIndex) =>
    set((s) => {
      const li =
        ((layerIndex % layers.length) + layers.length) % layers.length;
      const count = layers[li].bodies.length;
      const bi = ((bodyIndex % count) + count) % count;
      return { layerIndex: li, bodyIndex: bi, bodyByLayer: withBody(s.bodyByLayer, li, bi) };
    }),

  setRocketOpen: (open) => set(() => ({ rocketOpen: open })),
  setDetailOpen: (open) => set(() => ({ detailOpen: open })),
  enter: () => set(() => ({ entered: true })),
  setDevice: (device) => set(() => ({ device })),
}));
