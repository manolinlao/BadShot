# Backend de BadShot

Este directorio contiene el API del proyecto:

```text
Express → Prisma → PostgreSQL
```

## Arrancar el backend

Desde la raíz del proyecto:

```bash
docker compose up -d
npm run dev:api
```

El API se ejecuta en:

```text
http://localhost:3000
```

## Comprobar el backend

```text
http://localhost:3000/health
```

Comprobar la conexión con PostgreSQL:

```text
http://localhost:3000/health/db
```

## Estructura actual

```text
apps/api/
├── prisma/
│   ├── schema.prisma       # Plano de las tablas
│   └── migrations/         # Historial de cambios de la base de datos
├── src/
│   ├── db/prisma.ts        # Conexión reutilizable con Prisma
│   ├── security/password.ts # Hash y verificación de contraseñas
│   └── server.ts           # Servidor Express y rutas actuales
├── .env                    # Configuración local; no subir a Git
└── prisma.config.ts        # Configuración de Prisma
```

## Imports `.js` en archivos `.ts`

En este backend usamos Node.js con módulos ESM.

Aunque el archivo fuente sea `.ts`, TypeScript lo compilará a `.js`. Node ejecutará el archivo `.js`, por eso los imports locales terminan en `.js`:

```ts
// Este archivo fuente es db/prisma.ts.
// Al compilarse será db/prisma.js.
import { prisma } from '../db/prisma.js';
```

No hay que renombrar el archivo `prisma.ts`.

## Prisma

Después de cambiar `prisma/schema.prisma`:

```bash
npm run db:generate -w apps/api
npm run db:migrate -w apps/api -- --name nombre-del-cambio
```

`db:generate` genera el cliente TypeScript.

`db:migrate` crea y aplica un cambio real en PostgreSQL.

## PostgreSQL en Docker

Arrancar:

```bash
docker compose up -d
```

Comprobar estado:

```bash
docker compose ps
```

Detener sin borrar datos:

```bash
docker compose down
```

No usar normalmente:

```bash
docker compose down -v
```

`-v` elimina el volumen y los datos de PostgreSQL.
