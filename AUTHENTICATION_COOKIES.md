# Cookies y autenticación, explicado fácil

## ¿Qué es una cookie?

Una cookie es un pequeño dato que el navegador guarda para una web.

Sirve para que el navegador recuerde información entre peticiones, por ejemplo:

```text
“Este usuario ya inició sesión”
```

## Sin cookie

Actualmente probamos el JWT manualmente:

```text
1. Hacer login
2. Recibir accessToken
3. Copiar el token
4. Enviarlo manualmente en cada petición
```

```http
Authorization: Bearer eyJ...
```

Esto funciona con `curl`, pero no es la forma más cómoda para el navegador.

## Con cookie

El flujo sería:

```text
Login
  ↓
Backend crea JWT
  ↓
Backend pide al navegador que lo guarde en una cookie
  ↓
El navegador envía la cookie automáticamente
  ↓
Backend verifica el JWT
```

Así no tenemos que copiar ni añadir manualmente el token en cada petición.

## ¿Qué significa HttpOnly?

Una cookie `HttpOnly` no puede ser leída por JavaScript del navegador.

```text
JavaScript de la página → no puede leer el JWT
Navegador              → sí puede enviar la cookie al API
```

Esto ayuda a proteger el token si algún script malicioso se ejecuta en la página.

## Opciones importantes de la cookie

```text
HttpOnly → JavaScript no puede leerla
Secure   → solo se envía por HTTPS en producción
SameSite → reduce peticiones externas no deseadas
```

En desarrollo local normalmente `Secure` estará desactivado porque usamos `http://localhost`.

## ¿Dónde se guarda?

La cookie la guarda el navegador. No se guarda en PostgreSQL.

PostgreSQL guarda usuarios:

```text
User → email, displayName, passwordHash...
```

El navegador guarda temporalmente la sesión:

```text
Cookie → JWT
```

## ¿Qué ocurre al cerrar sesión?

El backend ordena al navegador borrar la cookie.

```text
Logout
  ↓
Cookie eliminada
  ↓
Las siguientes peticiones ya no están autenticadas
```

## Situación actual de BadShot

El login ya guarda el JWT en una cookie `HttpOnly` llamada `access_token`.

Para probarlo con `curl`:

```bash
curl -c /tmp/badshot-cookies.txt \
  -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"manuel@example.com","password":"cafetera123"}'

curl -b /tmp/badshot-cookies.txt \
  http://localhost:3000/api/auth/me
```

El middleware acepta la cookie y también el header `Authorization: Bearer <JWT>` para pruebas.

## Importante

Una cookie no sustituye al JWT.

```text
JWT    → credencial firmada
Cookie → lugar donde el navegador guarda y envía esa credencial
```
