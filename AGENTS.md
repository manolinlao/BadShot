# AGENTS.md

# BadShot

BadShot is a social network for specialty coffee espresso enthusiasts.

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite + PWA
- Tailwind CSS
- React Router v6
- Effector for client state
- Dexie + IndexedDB for offline persistence
- TanStack Query will be used once a backend is introduced.

### Backend

- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT authentication
- Cloudinary for images

## Workflow

- Work on the frontend step by step.
- Propose small changes only.
- Wait for explicit user approval before making changes.
- Do not add tests, packages, backend, or refactors unless requested.
- Keep each change easy to review and easy to revert.

## Monorepo Structure

- `apps/web`: React frontend
- `apps/api`: Node.js backend
- `packages/shared`: shared types and validation

## Architecture Rules

- Prefer offline-first designs.
- Use IndexedDB whenever local persistence is needed.
- Use Effector for client state management.
- Use TanStack Query for server state.
- Avoid React Context except for UI-only concerns.
- Shared types belong in `packages/shared`.

## Maps & Geolocation

- Use OpenStreetMap as the source of truth.
- Use Overpass API for POI searches.
- Use Nominatim for geocoding and reverse geocoding.
- Cache geolocation requests when possible.
- Avoid proprietary APIs unless explicitly requested.

## UI Rules

- Mobile-first design.
- Accessibility by default.
- Support English and Spanish.

## Coding Conventions

- Components use PascalCase.
- Hooks use `use*` naming.
- Services use `*.service.ts`.
- Use strict TypeScript.
- Handle async errors explicitly.

## API Response Format

Success:

```ts
{ success: true, data: T }
```

Error:

```ts
{ success: false, error: { message: string, code?: string } }
```

## Domain Modeling

- Keep business logic inside the `domain` folder.
- UI components should focus on rendering and user interaction.
- Prefer small domain helper functions over embedding business rules in React components.
- Domain functions should receive the smallest data structure they need (e.g. `Coffee`, `Recipe`) instead of an entire `Shot` whenever possible.
- Keep domain code framework-agnostic. It must not depend on React, Effector, Dexie, or browser APIs.

## Data Flow

The preferred data flow is:

UI
→ Effector
→ API layer
→ Persistence (IndexedDB or Backend)

React components must not access IndexedDB directly.
Business logic should not live inside React components.

## Separation of Concerns

- `domain/` contains business rules.
- `state/` contains Effector stores and effects.
- `api/` abstracts persistence and network access.
- `components/` render the UI.
