"use client";

import { AnimatePresence, motion } from "framer-motion";
import { layers, contact } from "@/lib/portfolioData";
import { usePortfolioStore } from "@/lib/store";
import { useInputControls } from "@/hooks/useInputControls";
import { LayerNavigation } from "./LayerNavigation";

/**
 * The full DOM overlay: intro, planet navigation, the focused-body detail
 * panel, the contact (rocket) panel and control hints. Layout adapts across
 * desktop / tablet / mobile via CSS + the device tier.
 */
export function ResponsiveHUD() {
  useInputControls();

  const layerIndex = usePortfolioStore((s) => s.layerIndex);
  const bodyIndex = usePortfolioStore((s) => s.bodyIndex);
  const entered = usePortfolioStore((s) => s.entered);
  const enter = usePortfolioStore((s) => s.enter);
  const detailOpen = usePortfolioStore((s) => s.detailOpen);
  const setDetailOpen = usePortfolioStore((s) => s.setDetailOpen);
  const rocketOpen = usePortfolioStore((s) => s.rocketOpen);
  const setRocketOpen = usePortfolioStore((s) => s.setRocketOpen);
  const nextBody = usePortfolioStore((s) => s.nextBody);
  const prevBody = usePortfolioStore((s) => s.prevBody);
  const setBody = usePortfolioStore((s) => s.setBody);
  const device = usePortfolioStore((s) => s.device);

  const layer = layers[layerIndex];
  const body = layer.bodies[bodyIndex];

  return (
    <div className="hud">
      {/* Intro overlay */}
      <AnimatePresence>
        {!entered && (
          <motion.div
            className="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
          >
            <motion.div
              className="intro__card"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <p className="intro__eyebrow">Welcome to the portfolio of</p>
              <h1 className="intro__name">{contact.name}</h1>
              <p className="intro__tagline">{contact.tagline}</p>
              <button className="cta" onClick={enter}>
                Launch experience
              </button>
              <p className="intro__hint">
                Explore a living solar system — each planet is a project.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {entered && (
        <>
          {/* Brand corner */}
          <div className="brand">
            <span className="brand__name">{contact.name}</span>
            <span className="brand__role">{contact.tagline}</span>
          </div>

          {/* Vertical layer navigation */}
          <LayerNavigation />

          {/* Planet (horizontal) navigation */}
          <div className="planet-nav">
            <button
              className="nav-btn nav-btn--lg"
              aria-label="Previous planet"
              onClick={prevBody}
            >
              ‹
            </button>

            <div className="planet-nav__center">
              <h2 className="planet-nav__title">{body.name}</h2>
              {body.meta && (
                <p className="planet-nav__meta">{body.meta}</p>
              )}
              <div className="planet-dots">
                {layer.bodies.map((b, i) => (
                  <button
                    key={b.id}
                    className={`planet-dot ${i === bodyIndex ? "is-active" : ""}`}
                    aria-label={b.name}
                    onClick={() => setBody(i)}
                  />
                ))}
              </div>
              <button
                className="details-toggle"
                onClick={() => setDetailOpen(!detailOpen)}
              >
                {detailOpen ? "Hide details" : "View details"}
              </button>
            </div>

            <button
              className="nav-btn nav-btn--lg"
              aria-label="Next planet"
              onClick={nextBody}
            >
              ›
            </button>
          </div>

          {/* Detail panel */}
          <AnimatePresence>
            {detailOpen && (
              <motion.aside
                key={body.id}
                className="detail-panel"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                style={{ "--accent": layer.accent } as React.CSSProperties}
              >
                <div className="detail-panel__head">
                  <span className="detail-panel__layer">{layer.title}</span>
                  <button
                    className="detail-panel__close"
                    aria-label="Close"
                    onClick={() => setDetailOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                <h3 className="detail-panel__title">{body.name}</h3>
                {body.meta && (
                  <p className="detail-panel__meta">{body.meta}</p>
                )}
                <p className="detail-panel__desc">{body.description}</p>
                {body.tags && (
                  <div className="tag-row">
                    {body.tags.map((t) => (
                      <span key={t} className="tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {body.link && (
                  <a
                    className="detail-link"
                    href={body.link.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {body.link.label} →
                  </a>
                )}
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Contact rocket panel */}
          <AnimatePresence>
            {rocketOpen && (
              <motion.div
                className="contact-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setRocketOpen(false)}
              >
                <motion.div
                  className="contact-panel"
                  initial={{ scale: 0.9, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.9, opacity: 0, y: 20 }}
                  transition={{ type: "spring", stiffness: 280, damping: 26 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="contact-panel__close"
                    aria-label="Close"
                    onClick={() => setRocketOpen(false)}
                  >
                    ✕
                  </button>
                  <p className="contact-panel__eyebrow">Transmission received</p>
                  <h3 className="contact-panel__title">Let&apos;s connect</h3>
                  <p className="contact-panel__sub">{contact.tagline}</p>

                  <div className="contact-links">
                    <a className="contact-link" href={`mailto:${contact.email}`}>
                      <span className="contact-link__icon">✉</span>
                      <span>
                        <strong>Email</strong>
                        <small>{contact.email}</small>
                      </span>
                    </a>
                    <a
                      className="contact-link"
                      href={contact.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="contact-link__icon">in</span>
                      <span>
                        <strong>LinkedIn</strong>
                        <small>Professional profile</small>
                      </span>
                    </a>
                    <a
                      className="contact-link"
                      href={contact.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="contact-link__icon">⌨</span>
                      <span>
                        <strong>GitHub</strong>
                        <small>Code & projects</small>
                      </span>
                    </a>
                    <a
                      className="contact-link"
                      href={contact.cv}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="contact-link__icon">⤓</span>
                      <span>
                        <strong>Download CV</strong>
                        <small>PDF résumé</small>
                      </span>
                    </a>
                  </div>

                  <a
                    className="cta cta--full"
                    href={`mailto:${contact.email}`}
                  >
                    Get in touch
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Control hints */}
          <div className="hints">
            {device === "mobile" ? (
              <span>Swipe ← → planets · ↑ ↓ sections · tap the rocket</span>
            ) : (
              <span>
                <kbd>←</kbd>
                <kbd>→</kbd> planets &nbsp; <kbd>↑</kbd>
                <kbd>↓</kbd> sections &nbsp; find the passing rocket ✦
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
