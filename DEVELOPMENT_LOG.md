# Development Log - BadShot

## Current State

- The repository is an npm monorepo.
- Root `package.json` defines workspaces for `apps/*` and `packages/*`.
- `apps/web` contains the frontend.
- The frontend is built with Vite, React, TypeScript, and Tailwind CSS.
- React Router is installed and configured for basic client-side navigation.
- The Home page renders a local mock feed using a reusable `ShotCard` component.
- The feed also includes shots created locally in the browser.
- `CreateShot` now supports a first local creation flow:
  - choose/take a photo through a file input
  - set a quick rating
  - add location
  - open a details bottom sheet
  - add coffee, recipe, and tasting notes
  - save the shot into browser `localStorage`
- `useLocalShots` combines saved local shots with mock feed data.
- The app shell has responsive navigation:
  - desktop top navigation
  - mobile bottom navigation with `lucide-react` icons
- Tailwind is configured through the official Vite plugin: `@tailwindcss/vite`.
- Framer Motion is installed and used by the `CreateShot` bottom sheet.
- `lucide-react` icons are used in navigation and creation UI.
- The frontend development server uses Vite's default port: `5173`.
- The backend has not been created yet.
- `packages/shared` exists but is still empty.
- `.gitignore` ignores `node_modules`.
- `package-lock.json` is currently modified in the working tree from before the latest saved-state update.

## Latest Saved State - 2026-06-14

- Cleaned up visible UI text and symbols so the app stays English-first and avoids corrupted characters.
- Replaced the photo placeholder emoji in `CreateShot` with a `lucide-react` camera icon.
- Removed an unused `touchStartY` ref from `CreateShot`; this was causing TypeScript build failure.
- Changed rating labels from emoji-prefixed labels to plain English labels:
  - `Bad`
  - `Meh`
  - `Ok`
  - `Good`
  - `Super!`
- Replaced non-ASCII separators in location and engagement text with ASCII separators.
- Cleaned mock shot names/cities and internal comments to avoid encoding artifacts.
- Verified the frontend build successfully after these changes.
- Added the first minimal validation to `CreateShot`: `Save shot` is now disabled until a photo exists.
- Made `ShotCard` more tolerant of incomplete shot data:
  - shows an initial avatar fallback when no avatar URL exists
  - uses `Untitled shot` when coffee name/origin are missing
  - hides empty username, coffee metadata, recipe stats, and footer sections
  - shows a simple `No photo` placeholder if a shot has no image
- Added a temporary fixed `Shot saved` toast after creating a shot, so it stays visible even when the feed is scrolled.
- The flash message uses React Router navigation state instead of global state.
- Refactored `CreateShot` into smaller pieces without changing behavior:
  - `PhotoPicker` handles photo selection and preview
  - `DetailsSheet` handles the details bottom sheet and scroll lock
  - `CreateShot` now mainly coordinates form state and saving
- Added optional `Roast level` to the create-shot details flow.
- `Not sure` is the default roast-level state and saves no `coffee.roastLevel` value.
- Created shots save `coffee.roastLevel` only when the user chooses a roast level, and `ShotCard` can display it.

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
- `apps/web/src/components/ShotCard/index.tsx` - Reusable shot card.
- `apps/web/src/components/RecipeEditor/index.tsx` - Small inline recipe editor used by `CreateShot`.
- `apps/web/src/components/RatingQuick/index.tsx` - Quick rating selector used by `CreateShot`.
- `apps/web/src/hooks/useLocalShots.ts` - Local shot persistence and merged feed hook.
- `apps/web/src/pages/CreateShot.tsx` - Local shot creation flow.
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

Continue slowly with one small frontend improvement at a time. Good next options:

- Then improve `ShotCard` interaction states such as like/comment buttons.
- Next non-social creation-flow improvements can focus on a visible recipe ratio or more espresso-specific fields.

Do this before adding backend, authentication, Effector, or PWA features.

## How To Resume With Another Assistant

Use this prompt:

```txt
Read DEVELOPMENT_LOG.md, PROJECT_SPEC.md, NEXT_STEPS.md, and inspect the repo.
I want to continue building BadShot slowly, learning each step, and I want to stay in control.
The app UI must be in English, but you can explain the work to me in Spanish.
Do not generate the whole project at once.
```
