# Development Log - BadShot

## Current State

- The repository is an npm monorepo.
- Root `package.json` defines workspaces for `apps/*` and `packages/*`.
- `apps/web` contains the frontend.
- The frontend is built with Vite, React, TypeScript, and Tailwind CSS.
- React Router is installed and configured for basic client-side navigation.
- The Home page renders a local mock feed using a reusable `ShotCard` component.
- Tailwind is configured through the official Vite plugin: `@tailwindcss/vite`.
- The frontend development server uses Vite's default port: `5173`.
- The backend has not been created yet.
- `packages/shared` exists but is still empty.
- `.gitignore` ignores `node_modules`.

## Product Direction

- BadShot is a social app for specialty coffee espresso shots.
- The app should be built as a PWA first.
- The UI and all user-facing text should be in English.
- Code, component names, routes, API names, and data models should be in English.
- Development explanations can stay in Spanish while learning.

## Decisions Made

- Frontend port `5173` is reserved for Vite.
- Backend port `3000` should be reserved for the future API.
- Tailwind CSS is installed now, but the UI should still be built step by step.
- The flavor wheel is a future feature, not part of the first MVP build.
- When the flavor wheel is implemented, start with an accessible mobile-friendly selector before building a complex circular SVG wheel.

## Files Worth Reading First

- `PROJECT_SPEC.md` - Overall product specification.
- `NEXT_STEPS.md` - Original implementation roadmap.
- `documentacion/FLAVOR_WHEEL_SPEC.md` - Future flavor wheel notes.
- `apps/web/src/App.tsx` - Frontend app entry component.
- `apps/web/src/routes.tsx` - Frontend route map.
- `apps/web/src/components/layout/AppLayout.tsx` - Shared app layout and navigation.
- `apps/web/src/components/shot/ShotCard.tsx` - First reusable shot card.
- `apps/web/src/data/mockShots.ts` - Temporary local feed data.
- `apps/web/src/types/shot.ts` - Frontend `Shot` type.
- `apps/web/vite.config.ts` - Vite plugins for React and Tailwind.
- `apps/web/package.json` - Frontend dependencies and scripts.

## Verified Commands

```bash
npm run build -w apps/web
```

This currently compiles successfully.

To run the frontend:

```bash
npm run dev -w apps/web
```

Open:

```txt
http://127.0.0.1:5173
```

## Current Frontend Routes

- `/` - Home
- `/login` - Log in
- `/register` - Create account
- `/create` - Create shot
- `/profile` - Profile
- `*` - Not found

## Recommended Next Step

Improve the mobile app shell and start shaping the real creation flow:

- Add a mobile bottom navigation.
- Make the current top navigation more responsive.
- Start the `CreateShot` page as a static form with no backend.

Do this before adding backend, authentication, Effector, or PWA features.

## How To Resume With Another Assistant

Use this prompt:

```txt
Read DEVELOPMENT_LOG.md, PROJECT_SPEC.md, NEXT_STEPS.md, and inspect the repo.
I want to continue building BadShot slowly, learning each step, and I want to stay in control.
The app UI must be in English, but you can explain the work to me in Spanish.
Do not generate the whole project at once.
```
