# ¿Qué es Prisma?

Prisma es el intermediario entre nuestro código TypeScript y PostgreSQL.

```
Código TypeScript
↓
Prisma
↓
PostgreSQL
```

Nos evita escribir directamente muchas consultas SQL y nos permite trabajar con tipos de TypeScript.

## .env

Este archivo contiene datos de configuración:

```
DATABASE_URL="postgresql://badshot:badshot@localhost:5432/badshot?schema=public"
```

La URL significa:

```
usuario:       badshot
contraseña:    badshot
servidor:      localhost
puerto:        5432
base de datos: badshot
```

**.env no debe subirse a Git porque puede contener secretos.**

## prisma.config.ts

Le dice a Prisma dónde encontrar:

- El schema.
- Las migraciones.
- La URL de conexión.

Ahora mismo contiene conceptualmente:

```
Usa prisma/schema.prisma
Lee DATABASE_URL
Guarda migraciones en prisma/migrations
```

## schema.prisma

Este archivo describe cómo queremos que sea la base de datos.
Ahora solo dice:

```
generator client {
  provider = "prisma-client"
}

datasource db {
  provider = "postgresql"
}
```

Todavía no hay modelos. Por eso aún no existe ninguna tabla de usuarios.

Más adelante añadiremos:

```
model User {
  ...
}
```

## prisma generate

Este comando:

npm run db:generate -w apps/api

Lee schema.prisma y genera código TypeScript para trabajar con los modelos.

Como todavía no tenemos modelos, ha generado el cliente base, pero todavía no podemos hacer:

prisma.user.findUnique(...)

## Migraciones

Una migración es el registro de un cambio en la base de datos.

Por ejemplo:

```
Añadir el modelo User
        ↓
Crear migración
        ↓
Prisma crea la tabla User en PostgreSQL
```

El flujo será:

```
editar schema.prisma
npm run db:migrate -w apps/api
npm run db:generate -w apps/api
```
