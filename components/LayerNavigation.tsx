"use client";

import { motion } from "framer-motion";
import { layers } from "@/lib/portfolioData";
import { usePortfolioStore } from "@/lib/store";

/**
 * Vertical layer switcher (Projects / Experience / Certifications / Skills).
 * Up/down arrows rotate the camera through the orbital planes.
 */
export function LayerNavigation() {
  const layerIndex = usePortfolioStore((s) => s.layerIndex);
  const setLayer = usePortfolioStore((s) => s.setLayer);
  const prevLayer = usePortfolioStore((s) => s.prevLayer);
  const nextLayer = usePortfolioStore((s) => s.nextLayer);
  const active = layers[layerIndex];

  return (
    <div className="layer-nav">
      <button
        className="nav-btn nav-btn--round"
        aria-label="Previous layer"
        onClick={prevLayer}
      >
        ▲
      </button>

      <div className="layer-list">
        {layers.map((layer, i) => (
          <button
            key={layer.id}
            className={`layer-pill ${i === layerIndex ? "is-active" : ""}`}
            style={
              { "--accent": layer.accent } as React.CSSProperties
            }
            onClick={() => setLayer(i)}
          >
            <span className="layer-dot" />
            <span className="layer-pill__label">{layer.title}</span>
            {i === layerIndex && (
              <motion.span
                layoutId="layer-active"
                className="layer-pill__bg"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      <button
        className="nav-btn nav-btn--round"
        aria-label="Next layer"
        onClick={nextLayer}
      >
        ▼
      </button>

      <div className="layer-nav__title" style={{ color: active.accent }}>
        <span className="layer-nav__subtitle">{active.subtitle}</span>
      </div>
    </div>
  );
}
