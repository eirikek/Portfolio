/**
 * Shared navigation chevron used by both the layer sidebar and the planet
 * bottom bar. A single chevron shape rotated per direction so every nav button
 * is visually identical, differing only in which way it points.
 */
const ROTATION = { up: 0, right: 90, down: 180, left: 270 } as const;

export function NavArrow({
  direction,
}: {
  direction: keyof typeof ROTATION;
}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ transform: `rotate(${ROTATION[direction]}deg)` }}
    >
      <path
        d="M6 15l6-6 6 6"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
