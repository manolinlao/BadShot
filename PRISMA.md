# Prisma — chuleta básica de BadShot

## Qué es Prisma

Prisma es el intermediario entre el API y PostgreSQL:

```text
API TypeScript → Prisma → PostgreSQL en Docker
```

## Archivos importantes

```text
apps/api/
├── .env                    # DATABASE_URL local; no subir a Git
├── prisma.config.ts        # configuración de Prisma
├── prisma/
│   ├── schema.prisma       # plano de las tablas
│   └── migrations/         # historial de cambios aplicados
└── src/generated/prisma/   # código generado automáticamente
```

## Conexión actual

```text
PostgreSQL: localhost:5432
Usuario:     badshot
Contraseña:  badshot
Base de datos: badshot
```

La URL está en `apps/api/.env`:

```env
DATABASE_URL="postgresql://badshot:badshot@localhost:5432/badshot?schema=public"
```

## Schema

`schema.prisma` describe las tablas. Actualmente contiene `User`:

```text
User
├── id
├── email
├── displayName
├── passwordHash
├── createdAt
└── updatedAt
```

```text
schema.prisma = plano
migration     = instrucciones para aplicar el plano
PostgreSQL    = base de datos real
```

## Comandos principales

Ejecutar desde la raíz del proyecto.

### Generar el cliente

```bash
npm run db:generate -w apps/api
```

Lee el schema y genera código TypeScript. No cambia las tablas.

Usarlo después de cambiar `schema.prisma`.

### Crear y aplicar una migración local

```bash
npm run db:migrate -w apps/api -- --name nombre-del-cambio
```

Ejemplo:

```bash
npm run db:migrate -w apps/api -- --name create-user
```

Crea un archivo SQL en `prisma/migrations/` y lo aplica a PostgreSQL.

### Validar el schema

```bash
npm exec -w apps/api -- prisma validate
```

Comprueba que el schema es válido.

## Orden normal después de cambiar tablas

```text
1. Editar prisma/schema.prisma
2. Ejecutar db:generate
3. Ejecutar db:migrate con un nombre descriptivo
4. Revisar el resultado
```

## Docker y Prisma

Antes de usar Prisma, PostgreSQL debe estar arrancado:

```bash
docker compose up -d
docker compose ps
```

Para detenerlo sin borrar los datos:

```bash
docker compose down
```

No usar normalmente:

```bash
docker compose down -v
```

`-v` elimina el volumen `postgres_data` y borra los datos de la base de datos.

## Ver las tablas directamente dentro de PostgreSQL

Entrar en la consola PostgreSQL del contenedor:

```bash
docker compose exec postgres psql -U badshot -d badshot
```

Dentro de `psql`:

```sql
\dt
\d "User"
SELECT * FROM "User";
\q
```

`\q` sale de PostgreSQL. No detiene Docker.

## Recordatorio

- `schema.prisma` no es la base de datos; es su plano.
- `db:generate` no crea tablas.
- `db:migrate` sí modifica la base de datos.
- Las migraciones aplicadas forman el historial del proyecto.
- `passwordHash` se guarda; la contraseña original nunca.
