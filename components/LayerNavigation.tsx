"use client";

import { layers } from "@/lib/portfolioData";
import { usePortfolioStore } from "@/lib/store";

export function LayerNavigation() {
  const layerIndex = usePortfolioStore((s) => s.layerIndex);
  const setLayer = usePortfolioStore((s) => s.setLayer);
  const prevLayer = usePortfolioStore((s) => s.prevLayer);
  const nextLayer = usePortfolioStore((s) => s.nextLayer);
  return (
    <div className="layer-nav">
      <button
        className="nav-btn"
        aria-label="Previous layer"
        onClick={prevLayer}
      >
        <span aria-hidden>↑</span>
      </button>

      <div className="layer-list">
        {layers.map((layer, i) => (
          <button
            key={layer.id}
            className={`layer-link ${i === layerIndex ? "is-active" : ""}`}
            onClick={() => setLayer(i)}
          >
            <span className="nav-marker" />
            <span className="layer-link__label">{layer.title}</span>
          </button>
        ))}
      </div>

      <button
        className="nav-btn"
        aria-label="Next layer"
        onClick={nextLayer}
      >
        <span aria-hidden>↓</span>
      </button>
    </div>
  );
}
