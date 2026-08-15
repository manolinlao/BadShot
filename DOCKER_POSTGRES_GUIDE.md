# Guía básica de Docker y PostgreSQL para BadShot

Esta guía es para volver a consultar los comandos básicos que usamos durante el desarrollo.

## 1. Antes de empezar

Hay que tener Docker Desktop abierto y funcionando.

Todos los comandos de esta guía se ejecutan desde la raíz del proyecto, es decir, desde la carpeta que contiene:

```text
docker-compose.yml
package.json
apps/
```

## 2. ¿Qué tenemos configurado?

El archivo `docker-compose.yml` describe un servicio llamado `postgres`:

```text
Docker
└── PostgreSQL
```

La base de datos usa estos datos solo para desarrollo local:

```text
Usuario:       badshot
Contraseña:    badshot
Base de datos: badshot
Servidor:      localhost
Puerto:        5432
```

La conexión que usa Prisma es:

```text
postgresql://badshot:badshot@localhost:5432/badshot?schema=public
```

## 3. Arrancar PostgreSQL

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Este comando:

1. Lee `docker-compose.yml`.
2. Descarga la imagen `postgres:17` si todavía no existe.
3. Crea el contenedor de PostgreSQL si es necesario.
4. Arranca PostgreSQL en segundo plano.
5. Conecta el puerto `5432` de nuestro ordenador con PostgreSQL.

La opción `-d` significa “detached”: Docker queda ejecutándose en segundo plano y recuperamos la terminal.

## 4. Comprobar el estado

```bash
docker compose ps
```

Debemos ver el servicio `postgres` con un estado parecido a:

```text
Up About a minute
```

Si aparece `Up`, PostgreSQL está funcionando.

## 5. Ver los mensajes de PostgreSQL

```bash
docker compose logs postgres
```

Para seguir los mensajes en tiempo real:

```bash
docker compose logs -f postgres
```

Para salir de los logs sin detener PostgreSQL, pulsar:

```text
Ctrl + C
```

## 6. Detener PostgreSQL

```bash
docker compose down
```

Esto detiene y elimina el contenedor, pero conserva los datos guardados en el volumen `postgres_data`.

Para volver a arrancarlo:

```bash
docker compose up -d
```

## 7. El comando peligroso

```bash
docker compose down -v
```

La opción `-v` elimina también los volúmenes. En nuestro caso, elimina `postgres_data` y con él todos los datos de PostgreSQL.

No usar este comando salvo que queramos empezar la base de datos desde cero.

## 8. Flujo normal de trabajo

Al empezar a trabajar:

```bash
docker compose up -d
docker compose ps
npm run dev:api
```

Si también queremos arrancar el frontend, desde otra terminal:

```bash
npm run dev:web
```

O podemos arrancar frontend y API juntos desde la raíz:

```bash
npm run dev
```

Al terminar, podemos detener PostgreSQL:

```bash
docker compose down
```

## 9. Conceptos básicos

### Imagen

Una imagen es la plantilla que Docker usa para crear un contenedor. En este proyecto usamos:

```text
postgres:17
```

### Contenedor

Es una instancia en ejecución de una imagen. Nuestro contenedor ejecuta PostgreSQL.

### Volumen

Es el espacio donde Docker guarda los datos de forma persistente.

Nuestro volumen se llama:

```text
postgres_data
```

Gracias al volumen, los datos sobreviven a:

```bash
docker compose down
```

### Puerto

El puerto permite que el API se comunique con PostgreSQL:

```text
localhost:5432 → PostgreSQL
```

## 10. Entrar en PostgreSQL dentro de Docker

Docker ejecuta PostgreSQL dentro del contenedor `postgres`. Para abrir su consola desde la raíz del proyecto:

```bash
docker compose exec postgres psql -U badshot -d badshot
```

Significado:

```text
docker compose exec  → ejecutar un comando dentro de un contenedor
postgres              → nombre del servicio en docker-compose.yml
psql                  → consola de PostgreSQL
-U badshot            → usuario de PostgreSQL
-d badshot            → base de datos
```

Después del comando aparecerá un prompt parecido a:

```text
badshot=#
```

Ahora estamos dentro de PostgreSQL, no en la terminal normal de macOS.

### Ver las tablas

Dentro de `psql`:

```sql
\dt
```

Debería aparecer la tabla `User`.

### Ver la estructura de `User`

```sql
\d "User"
```

Muestra sus columnas, tipos y restricciones.

### Ver los usuarios de BadShot

Los usuarios de la aplicación están en la tabla `"User"`.

Para ver sus datos públicos:

```sql
SELECT id, email, "displayName", "createdAt"
FROM "User";
```

Para contar cuántos usuarios hay:

```sql
SELECT COUNT(*) FROM "User";
```

### Contraseñas

Las contraseñas originales no se pueden ver ni recuperar. Solo se guarda un hash seguro en `passwordHash`.

Un hash puede tener un formato parecido a:

```text
$argon2id$...
```

Esto no es la contraseña: es el resultado de convertirla en un valor irreversible.

Si un usuario olvida su contraseña, la aplicación tendrá que ofrecer un cambio o recuperación de contraseña.

### Salir de PostgreSQL

```sql
\q
```

Esto solo cierra la consola. No detiene Docker ni borra datos.

## 11. Errores habituales

### `Cannot connect to the Docker daemon`

Docker Desktop no está abierto o no ha terminado de arrancar.

### El puerto `5432` ya está ocupado

Otro PostgreSQL o contenedor está usando ese puerto. Hay que identificarlo antes de cambiar la configuración.

### PostgreSQL aparece como `Exited`

Ver los mensajes:

```bash
docker compose logs postgres
```

### No recuerdo si está arrancado

Ejecutar:

```bash
docker compose ps
```

## 12. Importante

Los valores `badshot` son solo para desarrollo local. Antes de publicar la aplicación cambiaremos las credenciales y las moveremos a variables de entorno seguras.
