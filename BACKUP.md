# Backups de BadShot

## La idea en una frase

Un backup es una copia de seguridad que permite recuperar BadShot si el
ordenador, Docker o el disco dejan de funcionar.

## Que datos tiene BadShot

BadShot tiene dos tipos de datos importantes:

1. **Base de datos PostgreSQL**

   Contiene usuarios, contrasenas cifradas, shots, likes, ubicaciones y tokens
   de recuperacion de contrasena.

2. **Imagenes**

   Se guardan actualmente en:

   ```text
   apps/api/uploads/
   ```

Si perdemos la base de datos, perdemos la informacion de la aplicacion. Si
perdemos `uploads`, los shots pueden seguir existiendo pero sus imagenes no.

## Que hace Docker

PostgreSQL funciona dentro de un contenedor Docker. Sus datos reales se guardan
en el volumen Docker `postgres_data`.

Esto significa:

```bash
docker compose down
```

detiene y elimina el contenedor, pero conserva los datos.

```bash
docker compose up -d
```

vuelve a arrancar PostgreSQL usando los mismos datos.

Pero esto es importante:

```bash
docker compose down -v
```

borra tambien el volumen `postgres_data`. En ese caso se pierde la base de
datos. Docker aporta persistencia, pero **el volumen no es un backup**.

## Que consigue `npm run backup`

El comando:

```bash
npm run backup
```

crea una carpeta como esta:

```text
backups/
  20260911-153000/
    database.sql
    uploads.tar.gz
```

Los dos archivos son:

- `database.sql`: copia de PostgreSQL.
- `uploads.tar.gz`: copia comprimida de todas las imagenes.

La carpeta `backups/` esta excluida de Git para no subir datos personales ni
imagenes al repositorio.

## Como crear un backup

Primero hay que tener Docker Desktop arrancado. El propio comando de backup
arranca el servicio PostgreSQL si el contenedor esta parado y espera a que la
base de datos este lista:

```bash
docker compose up -d
```

Despues, desde la raiz del proyecto:

```bash
npm run backup
```

No hace falta ejecutar `docker compose up -d` cada vez si Docker Desktop ya
esta abierto, pero hacerlo tampoco causa ningun problema.

Si aparece este error:

```text
Cannot connect to the Docker daemon
```

Docker Desktop esta apagado. Hay que abrirlo y repetir el comando. El backup no
se ha creado correctamente si aparece ese error.

## Donde guardar los backups

No basta con dejarlos en el mismo ordenador. Si el disco se rompe, se perderian
los datos y el backup al mismo tiempo.

Despues de crear un backup, conviene copiar `backups/` a uno de estos sitios:

- Un disco externo.
- Otro ordenador.
- Un servidor de casa diferente.
- Un servicio de almacenamiento seguro.

Para un proyecto personal, una copia en un disco externo ya es una mejora
importante.

## Como restaurar las imagenes

Si la carpeta `apps/api/uploads/` se pierde, se puede restaurar un archivo de
imagenes asi:

```bash
tar -xzf backups/AAAA-MM-DD-HHMMSS/uploads.tar.gz -C apps/api
```

Despues volveran a existir los archivos dentro de `apps/api/uploads/`.

## Como restaurar la base de datos

La restauracion de PostgreSQL debe hacerse con cuidado porque reemplaza datos.
No hay que ejecutarla como prueba sobre una base de datos que todavia contiene
informacion importante.

Para restaurar un dump en una base de datos vacia:

```bash
docker compose up -d
cat backups/AAAA-MM-DD-HHMMSS/database.sql \
  | docker compose exec -T postgres psql -U badshot -d badshot
```

La restauracion esta pensada para un ordenador nuevo o una base de datos vacia.
Si la base de datos actual todavia funciona, no se debe ejecutar este comando
sin preparar antes una restauracion controlada.

## Que hacer normalmente

No hay que crear backups cada vez que se arranca BadShot. Una rutina sencilla
seria:

1. Arrancar Docker.
2. Usar BadShot normalmente.
3. Ejecutar `npm run backup` cada cierto tiempo.
4. Copiar la carpeta `backups/` a otro disco.

## Que protegemos ahora

Con este sistema protegemos:

- Usuarios.
- Shots.
- Likes.
- Ubicaciones.
- Tokens de recuperacion.
- Imagenes subidas.

No protegemos automaticamente el propio ordenador ni hacemos copias en otro
dispositivo. Por eso la copia externa sigue siendo necesaria.
