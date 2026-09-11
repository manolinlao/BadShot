# Cloudflare y misterlao.com

## Objetivo

Cloudflare gestiona los DNS y proporciona HTTPS. Un Cloudflare Tunnel conecta Cloudflare con el MacBook de casa, donde se ejecutan BadShot, la API y PostgreSQL.

No se han contratado servicios de pago.

## Qué hace cada servicio

- **cdmon**: mantiene la compra del dominio y el hosting/microplan de la web antigua.
- **Cloudflare DNS**: indica a Internet a qué servicio debe dirigirse cada subdominio.
- **Cloudflare HTTPS**: proporciona HTTPS para los dominios que pasan por Cloudflare.
- **cloudflared**: programa instalado en el MacBook que mantiene la conexión con Cloudflare.
- **Docker/PostgreSQL**: guarda los datos de BadShot en el MacBook.

La web antigua sigue en cdmon. BadShot no sustituye a `misterlao.com`; usa un subdominio.

## Arquitectura actual

```text
Internet
    |
    v
Cloudflare
    |
    v
Cloudflare Tunnel: badshot-home
    |
    v
MacBook de casa
    |-- localhost:5173  Frontend de BadShot
    |-- localhost:3000  API y WebSockets
    `-- Docker          PostgreSQL
```

Las direcciones públicas son:

```text
https://badshot.misterlao.com  -> frontend en localhost:5173
https://api.misterlao.com      -> API y WebSockets en localhost:3000
https://misterlao.com          -> web antigua de cdmon
```

## Arranque de BadShot

Para publicar BadShot desde el MacBook hay que mantener abiertas tres cosas. Se pueden usar tres ventanas de Terminal.

### 1. Arrancar PostgreSQL

```bash
cd /Users/manolin/MANOLIN/dvlp/BadShot
docker compose up -d
```

Docker mantiene la base de datos local. Si el MacBook se apaga, la aplicación deja de estar disponible, pero los datos permanecen en el volumen de Docker.

### 2. Arrancar frontend y API

```bash
cd /Users/manolin/MANOLIN/dvlp/BadShot
npm run dev
```

La variable `WEB_ORIGIN` queda guardada en `apps/api/.env`, por eso ya no hay que escribirla en cada arranque.

Su valor permite que la API acepte peticiones del frontend público y del frontend local.

El frontend detecta automáticamente desde dónde se abre:

```text
http://localhost:5173
    -> http://localhost:3000

https://badshot.misterlao.com
    -> https://api.misterlao.com
```

No hay que escribir `VITE_API_URL` ni `VITE_WS_URL` al arrancar normalmente.

### 3. Arrancar el túnel

En otra Terminal:

```bash
cloudflared tunnel --config ~/.cloudflared/config.yml run badshot-home
```

Mientras esta Terminal siga abierta, Cloudflare puede llegar al MacBook. Si se cierra, BadShot seguirá funcionando en el MacBook, pero dejará de estar disponible desde Internet.

## Qué es `config.yml`

El archivo está fuera del proyecto, en:

```text
~/.cloudflared/config.yml
```

Es la configuración del túnel. Le dice a `cloudflared` qué dominio debe enviar a qué servicio local:

```yaml
tunnel: 143bca8a-9f7d-47c1-8419-17a78dfa455a
credentials-file: /Users/manolin/.cloudflared/143bca8a-9f7d-47c1-8419-17a78dfa455a.json

ingress:
  - hostname: badshot.misterlao.com
    service: http://localhost:5173
  - hostname: api.misterlao.com
    service: http://localhost:3000
  - service: http_status:404
```

La sección `ingress` significa:

- Las peticiones a `badshot.misterlao.com` van al frontend.
- Las peticiones a `api.misterlao.com` van a la API.
- Cualquier dominio no configurado devuelve `404`.

El archivo JSON indicado en `credentials-file` contiene las credenciales del túnel. No debe compartirse, subirse a Git ni publicarse.

## Por qué usamos `api.misterlao.com`

La primera idea era usar:

```text
api.badshot.misterlao.com
```

Pero ese es un subdominio de dos niveles. El certificado Universal SSL gratuito de Cloudflare cubre normalmente:

```text
*.misterlao.com
```

Por tanto cubre:

```text
badshot.misterlao.com
api.misterlao.com
```

Pero no cubre necesariamente:

```text
api.badshot.misterlao.com
```

Usar `api.misterlao.com` evita el error `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` sin contratar Advanced Certificate Manager.

Además, `api.misterlao.com` es un nombre general que puede servir para la API principal del proyecto.

## Convención para futuras aplicaciones

Para nuevas aplicaciones se deben usar subdominios de un solo nivel:

```text
otraapp.misterlao.com      -> frontend de otra aplicación
otraapp-api.misterlao.com  -> API de otra aplicación
```

También sería válido usar:

```text
api-otraapp.misterlao.com
```

Hay que evitar nombres con dos niveles, como `api.otraapp.misterlao.com`, si se quiere usar el certificado Universal SSL gratuito sin configuración adicional.

## Qué ocurre al apagar algo

- Si se apaga Docker, la API no podrá acceder a PostgreSQL.
- Si se apaga `npm run dev`, dejan de funcionar frontend y API.
- Si se apaga `cloudflared`, BadShot deja de ser accesible desde Internet.
- Nada de esto borra los datos de PostgreSQL ni las imágenes guardadas.

## DNSSEC

DNSSEC se desactivó temporalmente al cambiar los servidores DNS de cdmon a Cloudflare. Las firmas antiguas de cdmon no coincidían con las claves de Cloudflare.

Cuando todo esté estable, DNSSEC se puede activar desde Cloudflare con nuevas claves. No se debe activar desde cdmon con las claves antiguas.

## Configuración que se usa

Este proyecto usa únicamente el túnel permanente:

```text
badshot-home
```

No hay que usar Quick Tunnels ni URLs trycloudflare.com. Esas URLs fueron solo
una prueba inicial y no forman parte del arranque normal.

## Resumen rápido de arranque

Desde cero, abre tres ventanas de Terminal y ejecuta:

### Terminal 1

```bash
cd /Users/manolin/MANOLIN/dvlp/BadShot
docker compose up -d
```

### Terminal 2

```bash
cd /Users/manolin/MANOLIN/dvlp/BadShot
npm run dev
```

### Terminal 3

```bash
cloudflared tunnel --config ~/.cloudflared/config.yml run badshot-home
```

Después:

```text
En el MacBook:  http://localhost:5173
Desde Internet: https://badshot.misterlao.com
```

Hay que mantener abiertas las tres ventanas mientras se use BadShot desde fuera
de casa.

## Qué no hacer

- No cancelar el microplan de cdmon.
- No borrar el hosting de cdmon.
- No cambiar los servidores DNS otra vez.
- No compartir el archivo JSON de credenciales del túnel.
- No subir `~/.cloudflared/config.yml` ni sus credenciales a Git.
- No apagar el MacBook si se quiere mantener BadShot disponible.
- No usar `misterlao.com` para BadShot mientras se quiera conservar la web antigua de cdmon.
