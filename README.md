# BadShot

BadShot es una red social para compartir shots de cafe espresso.

El proyecto es un monorepo con:

- Frontend: React, TypeScript, Vite, Tailwind y Effector
- Backend: Node.js, Express y Prisma
- Base de datos: PostgreSQL en Docker

## Requisitos

- Node.js `>= 22.14`
- npm
- Docker Desktop

## Arranque rapido

Desde la raiz del proyecto:

```bash
npm install
docker compose up -d
npm run db:generate -w apps/api
npm run db:migrate -w apps/api
npm run dev
```

Los comandos de Prisma (`db:generate` y `db:migrate`) preparan el cliente y la
base de datos. No hace falta ejecutarlos cada vez que arranques el proyecto.

Una vez preparado el proyecto, el arranque diario es solamente:

```bash
docker compose up -d
npm run dev
```

La aplicacion quedara disponible en:

- Frontend: http://localhost:5173
- API: http://localhost:3000
- PostgreSQL: `localhost:5432`

## Recuperar contraseña

En la pantalla de login está disponible `Forgot your password?`. El enlace de
recuperación caduca en una hora y solo puede utilizarse una vez.

En desarrollo, si no se configura un proveedor de email, la API imprime el
enlace de recuperación en la terminal del backend. Para enviar emails en
producción, configura en `apps/api/.env`:

```text
APP_URL="https://tu-dominio.com"
RESEND_API_KEY="re_..."
EMAIL_FROM="BadShot <noreply@tu-dominio.com>"
```

El dominio de envío debe estar verificado en Resend. La API nunca devuelve el
token en la respuesta HTTP ni revela si el email existe.

## Tiempo real

Los cambios de likes se propagan por WebSocket en `ws://localhost:3000/ws`.
La conexión reutiliza la cookie de sesión `httpOnly`, se autentica durante el
handshake y se reconecta automáticamente si se corta. El like se sigue
escribiendo por HTTP; el WebSocket solo distribuye el cambio confirmado por la
API.

## Arrancar por separado

Terminal 1, backend:

```bash
npm run dev:api
```

Terminal 2, frontend:

```bash
npm run dev:web
```

Antes de arrancar el backend, PostgreSQL debe estar activo:

```bash
docker compose up -d
```

## Comprobar que funciona

API:

```bash
curl http://localhost:3000/health
curl http://localhost:3000/health/db
```

Comprobaciones de codigo:

```bash
npm run typecheck:web
npm run typecheck -w apps/api
npm run build
```

## Configuracion local

La configuracion del backend esta en `apps/api/.env`.

La configuracion del frontend se puede copiar desde
`apps/web/.env.example` a `apps/web/.env`:

```env
VITE_API_URL="http://localhost:3000"
VITE_WS_URL="ws://localhost:3000/ws"
```

En el backend, `WEB_ORIGIN` indica el origen permitido del frontend:

```env
WEB_ORIGIN="http://localhost:5173"
```

En producción, sustituye estas URLs por el dominio HTTPS y el WebSocket seguro
correspondiente. El frontend mantiene valores locales por defecto si no existe
`apps/web/.env`.

## HTTPS y WebSocket seguro

En producción, configura el frontend así:

```env
VITE_API_URL="https://api.tudominio.com"
VITE_WS_URL="wss://api.tudominio.com/ws"
```

La API permite dos formas de terminar TLS:

- Recomendado: un reverse proxy como Nginx, Caddy o el balanceador del hosting
  termina HTTPS y reenvía WebSocket a la API.
- Directo: configura en `apps/api/.env` `HTTPS_CERT_PATH` y `HTTPS_KEY_PATH`
  apuntando al certificado y a la clave privada.

En ambos casos, `WEB_ORIGIN` debe contener el origen HTTPS exacto del frontend.
El servidor rechaza handshakes WebSocket procedentes de otros orígenes.

Si no existe, crearla desde el ejemplo:

```bash
cp apps/api/.env.example apps/api/.env
```

La configuracion local espera esta base de datos:

```text
postgresql://badshot:badshot@localhost:5432/badshot?schema=public
```

## Base de datos

Arrancar PostgreSQL:

```bash
docker compose up -d
```

Ver el estado:

```bash
docker compose ps
```

### Comandos de Prisma

Generar el cliente de Prisma:

```bash
npm run db:generate -w apps/api
```

Usarlo despues de instalar dependencias o cambiar
`apps/api/prisma/schema.prisma`.

Aplicar las migraciones de desarrollo:

```bash
npm run db:migrate -w apps/api
```

Usarlo despues de descargar migraciones nuevas o cambiar el schema. Este
comando puede crear y aplicar una migracion nueva y necesita PostgreSQL activo.

No hace falta ejecutar estos dos comandos en cada arranque si no ha cambiado el
schema ni se han descargado migraciones nuevas.

Parar los contenedores sin borrar datos:

```bash
docker compose down
```

No usar normalmente:

```bash
docker compose down -v
```

El parametro `-v` borra el volumen de PostgreSQL y sus datos.

## Estructura

```text
apps/web       Frontend React
apps/api       Backend Express y Prisma
packages/      Paquetes compartidos
docs/          Documentacion del proyecto
docker-compose.yml
```

## Rutas principales del frontend

- `/` Feed principal
- `/login` Inicio de sesion
- `/register` Registro
- `/create` Crear shot
- `/profile` Perfil

## Documentacion adicional

- `apps/api/README.md`: detalles del backend y Prisma
- `docs/development/WORK_PLAN.md`: plan de trabajo actual
- `docs/development/DEVELOPMENT_LOG.md`: historial de desarrollo
- `DOCKER_POSTGRES_GUIDE.md`: guia de PostgreSQL en Docker
- `AUTHENTICATION.md`: autenticacion
- `IMAGE_STORAGE.md`: almacenamiento de imagenes

## Para volver al proyecto despues de tiempo

```bash
git status
git log -5 --oneline
docker compose up -d
npm run dev
```

Si es la primera vez en ese ordenador, o han cambiado el schema o las
migraciones, ejecutar antes:

```bash
npm install
npm run db:generate -w apps/api
npm run db:migrate -w apps/api
```

## Usuarios de preuba

manuel-test@example.com 123456768
ana-test@example.com 12345678
