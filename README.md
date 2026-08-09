# Elijah Christian M. De Dios — Digital Universe

An immersive, cinematic 3D space-exploration portfolio built with **React 19 + TypeScript + Three.js (React Three Fiber)**. The visitor scrolls through a continuous space environment — a procedurally generated spiral galaxy, a starfield, and a foreground planet — while the camera drifts through scroll-mapped waypoints from Home to a final "Transmission Center" contact section.

## Tech stack

- **Vite** — build tool / dev server
- **React 19 + TypeScript**
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — the 3D scene
- Hand-written CSS (design tokens in `src/styles/global.css`) — no CSS framework
- **Web Audio API** — plays your uploaded ambient track with a live analyser for subtle audio-reactive visuals

No backend. No CMS. Content lives in `src/data/*.ts`.

## Project structure

```
src/
 ├── components/
 │    ├── SpaceScene/     StarField, Galaxy, Planet, CameraRig, SpaceScene (Canvas wrapper)
 │    ├── HUD/             Decorative coordinates / system-status overlay
 │    ├── Navigation/      Floating spacecraft-HUD nav (desktop + mobile)
 │    ├── LoadingScreen/   Cinematic intro + "ENTER UNIVERSE" gesture gate
 │    ├── MusicControl/    Persistent music on/off HUD control
 │    ├── Hero/            Landing section
 │    ├── About/           "Mission Profile" panel
 │    ├── Skills/          Floating skill category panels
 │    ├── Projects/        "Missions" (project cards) + MissionCard
 │    ├── Experience/      "Experience Log" timeline
 │    └── Contact/         "Transmission Center" (form + social links)
 ├── context/
 │    └── SceneContext.tsx Shared mouse/scroll/audio state for the 3D layer
 ├── data/                 skills.ts, projects.ts, experience.ts — edit these to update content
 ├── hooks/                useReducedMotion, useScrollProgress, useSpaceAudio
 ├── utils/
 │    └── particleTexture.ts  Runtime-generated soft circular sprite for all particles
 ├── styles/global.css     Full design system (colors, typography, every component's CSS)
 ├── App.tsx               Top-level composition
 └── main.tsx              Entry point

public/
 └── audio/morning-light.mp3   Your uploaded ambient track
```

## Getting started

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build for production

```bash
npm run build      # type-checks with tsc, then builds to dist/
npm run preview    # serve the production build locally to sanity-check it
```

## Editing content

You don't need to touch any component code to update your info:

- **Skills** → `src/data/skills.ts`
- **Projects / missions** → `src/data/projects.ts`
- **Experience log** → `src/data/experience.ts`
- **Contact links** → `src/components/Contact/Contact.tsx` (`SOCIALS` array near the top)
- **Hero copy** → `src/components/Hero/Hero.tsx`

## Deploying

### Vercel
Push this folder to a GitHub repo, then import it in Vercel. It auto-detects Vite — no config needed. Build command `npm run build`, output directory `dist`.

### GitHub Pages
Add a `base` path in `vite.config.ts` matching your repo name (e.g. `base: '/your-repo-name/'`), then build and deploy the `dist/` folder (e.g. with the `gh-pages` package or a GitHub Actions workflow).

## Notes on behavior

- **Music autoplay**: browsers block audio until a real user gesture. Music starts when the visitor clicks **ENTER UNIVERSE**, and can be toggled anytime via the HUD music control (bottom-left). The on/off state is remembered for the session.
- **Reduced motion**: if the visitor's OS has "reduce motion" enabled, camera drift, mouse parallax, and particle rotation are disabled automatically.
- **Mobile**: particle counts are reduced (~40% of desktop) for performance; all sections remain fully readable and functional.
- **Contact form**: currently opens a pre-filled `mailto:` link (no backend exists). To wire up real submissions, swap the `handleSubmit` logic in `src/components/Contact/Contact.tsx` for a call to your form endpoint of choice (Formspree, a serverless function, etc.).
- **No external space image was used** — the galaxy, starfield, and planet are all procedurally generated in Three.js rather than an image texture, per the "not a flat background" requirement.

## Known trade-off

`npm run build` currently emits one JS bundle (~300KB gzipped) due to Three.js. This is normal for a Three.js app and loads fine, but if you want to optimize further later, code-splitting the `SpaceScene` behind `React.lazy` is the natural next step.
