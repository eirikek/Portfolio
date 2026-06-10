import * as THREE from "three";

/** Vertical distance between stacked orbital planes (layers). */
export const LAYER_GAP = 14;

/** Where the focused body sits, in radians, around its ring (front-right). */
export const FOCUS_ANGLE = 0;

/**
 * Local position of a body on its orbit ring.
 *
 * `focusAngle` rotates the entire ring around the sun; the bodies keep their
 * fixed relative spacing. Selecting the next/previous body simply damps
 * `focusAngle` toward a new target (see `focusAngleFor`), so the whole solar
 * system visibly revolves to bring the chosen planet into focus rather than
 * snapping. A tiny ambient term adds perpetual gentle drift.
 */
export function bodyLocalPosition(
  target: THREE.Vector3,
  orbitRadius: number,
  index: number,
  count: number,
  focusAngle: number,
  ambient: number
): THREE.Vector3 {
  const base = (index / count) * Math.PI * 2;
  const a = base + focusAngle + ambient;
  return target.set(
    Math.cos(a) * orbitRadius,
    0,
    Math.sin(a) * orbitRadius
  );
}

/** The `focusAngle` that brings `bodyIndex` to the focus slot. */
export function focusAngleFor(bodyIndex: number, count: number): number {
  return FOCUS_ANGLE - (bodyIndex / count) * Math.PI * 2;
}

/**
 * World position of the (fixed) focus slot the camera looks at. The selected
 * planet rotates *into* this slot, which is what makes the rotation visible.
 */
export function frontSlotPosition(
  target: THREE.Vector3,
  orbitRadius: number,
  ambient: number
): THREE.Vector3 {
  const a = FOCUS_ANGLE + ambient;
  return target.set(
    Math.cos(a) * orbitRadius,
    0,
    Math.sin(a) * orbitRadius
  );
}

/**
 * Vertical offset of a layer's plane given the (fractional) active layer.
 *
 * Higher-index layers (further down the menu) sit lower in 3D space, so moving
 * "down" the menu descends through the stack: the next layer rises from below
 * and the current one exits via the top.
 */
export function layerY(layerIndex: number, activeFloat: number): number {
  return (activeFloat - layerIndex) * LAYER_GAP;
}

/** Smooth, frame-rate-independent damping toward a target value. */
export function damp(
  current: number,
  target: number,
  lambda: number,
  dt: number
): number {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

export function dampV3(
  current: THREE.Vector3,
  target: THREE.Vector3,
  lambda: number,
  dt: number
): void {
  current.x = THREE.MathUtils.damp(current.x, target.x, lambda, dt);
  current.y = THREE.MathUtils.damp(current.y, target.y, lambda, dt);
  current.z = THREE.MathUtils.damp(current.z, target.z, lambda, dt);
}
