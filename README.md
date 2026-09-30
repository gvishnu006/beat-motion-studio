# BEAT — UI & UX Motion Studio

An animated single-page site for a fictional motion-design studio. Built as a
dependency-free static site (HTML + CSS + vanilla JS) so it deploys to Vercel
with zero build step.

## What's in it

- **Custom cursor** — lerped follow + contextual labels on hoverable elements
- **Magnetic buttons** — pointer-proximity translation
- **Scroll reveals** — `IntersectionObserver` + per-element stagger delays
- **Kinetic hero** — line reveals, SVG stroke-dash underline draw, word rotator
- **Morphing blobs** — animated organic `border-radius` + parallax on pointer
- **Card tilt** — 3D `perspective` hover on the work grid
- **Motion Lab** — hand-tuned interactive toys:
  - spring toggle
  - drag-to-fling with inertia + spring-back
  - magnifier lens that follows the pointer
  - radial ripple burst
  - easing playground with selectable curves
- **Reduced motion** — full `prefers-reduced-motion` fallback

## Run locally

```bash
npm run dev
```

## Deploy

```bash
npx vercel --prod
```

## Structure

```
index.html     markup + inline SVG art
styles.css     design tokens, layout, all keyframe animations
script.js      interactions (cursor, magnet, reveal, tilt, lab toys)
vercel.json    clean URLs + cache headers
```

## Design notes

Fonts: Bricolage Grotesque (UI), Fraunces (editorial serif accents),
JetBrains Mono (labels). Palette is warm paper + ink with orange, blue and lime
accents. A CSS film-grain overlay sits above everything for a tactile feel.
