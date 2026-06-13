# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: BadShot

Red social tipo Instagram enfocada en espressos de café de especialidad. Aplicación full-stack con React + TypeScript (frontend) y Node.js + Express + Prisma (backend).

**Documentación del proyecto**:
- `PROJECT_SPEC.md`: Especificación completa, MVP, features, y modelo de datos
- `FOLDER_STRUCTURE.md`: Estructura detallada de carpetas y archivos
- `EFFECTOR_ARCHITECTURE.md`: Patrones y arquitectura de Effector
- `PWA_SETUP.md`: Configuración PWA, Service Worker, IndexedDB
- `NEXT_STEPS.md`: Plan de implementación detallado y próximos pasos

## Tech Stack

### Frontend (PWA - apps/web)
- React 18 + TypeScript + Vite + PWA Plugin
- **Tailwind CSS** (responsive design)
- React Router v6
- **Effector** (state management) + TanStack Query (server state)
- **IndexedDB** (Dexie.js) para persistencia local y offline-first
- Service Worker para caching y offline capability
- React Hook Form + Zod (validación)

### Backend (apps/api)
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT authentication + bcrypt
- Cloudinary para imágenes

## Arquitectura

Monorepo con estructura:
- `apps/web/`: Frontend React
- `apps/api/`: Backend Node.js
- `packages/shared/`: Tipos y validaciones compartidas (opcional)

## Commands

### Frontend (apps/web)
```bash
cd apps/web
npm install          # Instalar dependencias
npm run dev          # Dev server (http://localhost:5173)
npm run build        # Build producción
npm run preview      # Preview build
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

### Backend (apps/api)
```bash
cd apps/api
npm install                 # Instalar dependencias
npm run dev                 # Dev server con nodemon
npm run build               # Compilar TypeScript
npm start                   # Producción
npx prisma generate         # Generar Prisma Client
npx prisma migrate dev      # Crear/aplicar migración
npx prisma studio           # GUI para la DB
npx prisma db seed          # Seed data
npm test                    # Tests
```

### Root (monorepo)
```bash
npm install          # Instalar todas las dependencias
npm run dev          # Correr frontend + backend en paralelo
```

## Convenciones de Código

### Naming
- Componentes React: PascalCase (`ShotCard.tsx`)
- Hooks: camelCase con prefix `use` (`useAuth.ts`)
- Services: camelCase + suffix `.service` (`auth.service.ts`)
- Types/Interfaces: PascalCase (`User`, `Shot`, `ApiResponse`)

### Estructura de Componentes
```typescript
// 1. Imports
// 2. Types/Interfaces
// 3. Component
// 4. Exports
```

### API Routes Pattern
- `POST /api/auth/register` - Registro
- `POST /api/auth/login` - Login
- `GET /api/shots` - Lista paginada
- `POST /api/shots` - Crear shot
- `GET /api/shots/:id` - Detalle
- `PUT /api/shots/:id` - Actualizar
- `DELETE /api/shots/:id` - Eliminar
- `POST /api/shots/:id/like` - Like/Unlike
- `GET /api/shots/:id/comments` - Comentarios

### Response Format
```typescript
// Success
{ success: true, data: T }

// Error
{ success: false, error: { message: string, code?: string } }
```

## Database

### Prisma Workflow
1. Modificar `prisma/schema.prisma`
2. Crear migración: `npx prisma migrate dev --name descripcion`
3. Aplicar en prod: `npx prisma migrate deploy`

### Entidades Core
- **User**: Usuarios con auth
- **Shot**: Publicaciones de espressos
- **Follow**: Relación seguidor/seguido
- **Like**: Likes en shots
- **Comment**: Comentarios en shots

## Autenticación

- JWT tokens almacenados en localStorage (frontend)
- Middleware `auth.middleware.ts` protege rutas
- Token incluido en header: `Authorization: Bearer <token>`
- Refresh token pattern para producción

## Imágenes

- **Dev**: Cloudinary (free tier)
- **Prod**: Cloudinary o AWS S3
- Formato: webp, múltiples tamaños (thumbnail, medium, full)
- Límites: 5MB max, solo jpg/png/webp

## Testing

- **Frontend**: Vitest + React Testing Library
- **Backend**: Jest + Supertest
- **E2E**: Playwright (opcional para MVP)

## Environment Variables

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=xxx
VITE_CLOUDINARY_UPLOAD_PRESET=xxx
```

### Backend (.env)
```
DATABASE_URL=postgresql://user:pass@localhost:5432/badshot
JWT_SECRET=xxx
JWT_EXPIRES_IN=7d
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
PORT=3000
NODE_ENV=development
```

## Development Workflow

1. Crear feature branch: `git checkout -b feature/nombre`
2. Desarrollar con hot reload activo
3. Validar tipos: `npm run type-check`
4. Lint: `npm run lint`
5. Commit con mensaje descriptivo
6. Push y crear PR

## Claude Code Setup

Este proyecto usa un API endpoint custom de GFT. Para activar:
```cmd
claudeconfig.cmd
```

## Notas de Desarrollo

- **Validación**: Usar Zod tanto en frontend como backend
- **Error Handling**: Siempre manejar errores async con try-catch
- **Tipos Compartidos**: Considerar extraer a `packages/shared` si se repiten
- **Performance**: Implementar paginación desde el inicio (infinite scroll)
- **Seguridad**: Nunca confiar en validación de frontend únicamente
- **Mobile-first**: Diseñar para móvil primero (mayoría de usuarios)
