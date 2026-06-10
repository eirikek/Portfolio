"use client";

import { create } from "zustand";
import { layers, layerOrder, type LayerId } from "./portfolioData";

export type DeviceTier = "desktop" | "tablet" | "mobile";

interface PortfolioState {
  /** Index of the active orbital layer. */
  layerIndex: number;
  /** Index of the focused body within the active layer. */
  bodyIndex: number;
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

  setRocketOpen: (open: boolean) => void;
  setDetailOpen: (open: boolean) => void;
  enter: () => void;
  setDevice: (device: DeviceTier) => void;
}

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  layerIndex: 0,
  bodyIndex: 0,
  rocketOpen: false,
  entered: false,
  detailOpen: false,
  device: "desktop",

  activeLayerId: () => layerOrder[get().layerIndex],

  nextLayer: () =>
    set((s) => {
      const layerIndex = (s.layerIndex + 1) % layers.length;
      return { layerIndex, bodyIndex: 0, detailOpen: false };
    }),
  prevLayer: () =>
    set((s) => {
      const layerIndex = (s.layerIndex - 1 + layers.length) % layers.length;
      return { layerIndex, bodyIndex: 0, detailOpen: false };
    }),
  setLayer: (index) =>
    set(() => ({
      layerIndex: ((index % layers.length) + layers.length) % layers.length,
      bodyIndex: 0,
      detailOpen: false,
    })),

  nextBody: () =>
    set((s) => {
      const count = layers[s.layerIndex].bodies.length;
      return { bodyIndex: (s.bodyIndex + 1) % count, detailOpen: false };
    }),
  prevBody: () =>
    set((s) => {
      const count = layers[s.layerIndex].bodies.length;
      return {
        bodyIndex: (s.bodyIndex - 1 + count) % count,
        detailOpen: false,
      };
    }),
  setBody: (index) =>
    set((s) => {
      const count = layers[s.layerIndex].bodies.length;
      return { bodyIndex: ((index % count) + count) % count, detailOpen: false };
    }),

  setRocketOpen: (open) => set(() => ({ rocketOpen: open })),
  setDetailOpen: (open) => set(() => ({ detailOpen: open })),
  enter: () => set(() => ({ entered: true })),
  setDevice: (device) => set(() => ({ device })),
}));
