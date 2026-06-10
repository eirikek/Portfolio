# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # dev server (localhost:3000, or next free port)
npm run build    # production build — also the type/lint gate (tsc strict + next lint)
npm start        # serve the production build
npm run lint     # next lint only
npx tsc --noEmit # fast typecheck without building
```

There is no unit-test suite. The verification harness is a browser screenshot script:

```bash
# dev server must be running first; pass its URL
URL=http://localhost:3000 node scripts/verify.mjs
```

`scripts/verify.mjs` drives system Chrome (`/Applications/Google Chrome.app`) via `playwright-core`, enters the experience, navigates a planet + a layer, opens the detail panel, and writes screenshots to `/tmp/portfolio-*.png` while collecting console/page errors.

**Critical gotcha:** headless Chrome's default ANGLE-Metal backend renders the custom GLSL shaders to **solid black** — a false alarm, not a real bug. The script forces `--use-angle=swiftshader --enable-unsafe-swiftshader` to get an accurate render. A real browser with a GPU renders correctly. If you change the GL args and the scene goes black in screenshots, suspect the backend, not the code.

## Architecture

A single-page "living solar system" portfolio. Everything is **data-driven from `lib/portfolioData.ts`** — edit `layers[]` and `contact{}` to change all content; components render whatever the data describes.

### The mental model
- The **Sun** sits at the world origin. The camera always aims to the *right* of it, which is what keeps the sun huge and half-visible on the left of the screen.
- Each **layer** (Projects / Experience / Certifications / Skills) is a horizontal orbit ring at a different radius. Layers are stacked vertically by `LAYER_GAP`: the active layer sits at y≈0 and the others slide above/below out of view. Changing layer = sweeping planes vertically through the frame.
- Within a layer, the **selected body is rotated to the front-right** (`FOCUS_ANGLE`), others spread around the ring. A tiny ambient drift term keeps everything alive.

### The single most important invariant: shared orbit math
`lib/orbits.ts` (`bodyLocalPosition`, `layerY`) is the **one source of truth** for where a body is. Both `Planet` (to place itself) and `CameraController` (to know where to look) call it with the same inputs and the same `clock.elapsedTime`-derived ambient value. This is why the camera stays locked on the focused planet even while everything drifts. **If you change the placement formula, both must keep using it** — don't recompute positions independently anywhere.

### Frame-order coupling via the rig
`lib/rig.ts` exposes a shared mutable ref (`{ activeFloat }`) through React context. `activeFloat` is the *fractional* active-layer index, damped toward the store's integer `layerIndex` so transitions are smooth. Render order inside `SpaceScene` matters:

1. `<RigController>` runs first each frame and writes `activeFloat`.
2. `<PlanetOrbit>` layers read it to set their vertical offset.
3. `<CameraController>` reads it last to compute the look target.

R3F runs `useFrame` callbacks in mount order, so keep `RigController` mounted before the layers and camera. Putting per-component damping on `activeFloat` instead would cause drift between the camera and the planes during transitions — that's the bug this design avoids.

### State
`lib/store.ts` is a zustand store: `layerIndex`, `bodyIndex`, `rocketOpen`, `detailOpen`, `entered`, `device`. Navigation actions reset `bodyIndex`/`detailOpen` appropriately. Both the 3D scene and the DOM HUD subscribe to it, so a click on a planet and an arrow-key press funnel through the same actions.

### 3D vs DOM split
- **3D** (`SpaceScene` → Sun, StarField, ShootingStars, SpaceDust, PlanetOrbit/Planet, RocketContact, CameraController) lives inside the R3F `<Canvas>`. `SpaceScene` is dynamically imported with `ssr: false` from `components/Experience.tsx` — WebGL must not run during SSR.
- **DOM** (`ResponsiveHUD` → LayerNavigation, detail panel, contact panel, hints; styled entirely in `app/globals.css`). Floating planet labels and the rocket hint use drei `<Html>` so they're DOM anchored to 3D positions.

### Input
`hooks/useInputControls.ts` wires arrow keys (←→ planets, ↑↓ layers, Enter/Esc) and touch swipes to store actions. It reads/writes the store imperatively via `getState()` inside effect listeners (not React subscriptions).

### Responsive quality tiers
`hooks/useResponsive.ts` maps viewport width → `device` tier and a `QUALITY` preset (star/dust counts, bloom, DPR, shooting-star rate, camera sweep). Mobile drops dust and bloom and uses larger touch targets / bottom-docked panels (handled in CSS). When adding scene effects, gate their cost through a quality field rather than hardcoding.

### Postprocessing caveat
`@react-three/postprocessing`'s `EffectComposer` children are typed as non-null `ReactElement` and dislike `<></>`/`null`. Build effects into an array and `.filter(Boolean)` (see `SpaceScene.tsx`) when conditionally including Bloom/DOF.
