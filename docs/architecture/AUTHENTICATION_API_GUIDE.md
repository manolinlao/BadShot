# Guía de autenticación del API

Esta guía describe cómo prepararemos la autenticación de BadShot. El objetivo no es añadir todavía todo el código, sino tener claro qué piezas necesitamos y en qué orden construirelas.

## 1. Qué significa autenticar

Hay dos preguntas distintas:

- **Autenticación:** ¿quién es esta persona?
- **Autorización:** ¿qué puede hacer esta persona?

Cuando alguien inicia sesión correctamente, el API emite una credencial. En nuestro caso usaremos un JWT. En cada petición protegida, el API comprobará ese JWT antes de ejecutar la operación.

El frontend no debe decidir si un usuario está autenticado. Puede mostrar una pantalla u ocultarla, pero la decisión válida siempre la toma el backend.

## 2. Flujo completo

```text
Registro
  → validar datos
  → convertir contraseña en hash
  → guardar usuario en PostgreSQL

Login
  → buscar usuario por email
  → comparar contraseña con el hash
  → crear JWT
  → devolverlo mediante cookie HttpOnly

Petición protegida
  → leer cookie
  → verificar firma y expiración del JWT
  → obtener userId
  → ejecutar la ruta con req.user
```

La contraseña original nunca se guarda y nunca se devuelve en una respuesta.

## 3. Modelo de datos inicial

En Prisma necesitaremos algo parecido a esto:

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  displayName  String
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

Decisiones importantes:

- El email se normaliza a minúsculas antes de guardar y buscar.
- `email` es único.
- El campo se llama `passwordHash`, nunca `password`.
- Las respuestas públicas usan un DTO sin `passwordHash`.
- Más adelante podremos añadir avatar, preferencias, roles o cuentas sociales sin mezclarlo con el primer login.

## 4. Rutas del API

Todas usarán el formato de respuesta del proyecto: `{ success, data }` o `{ success, error }`.

### Públicas

`POST /api/auth/register`

Recibe:

```json
{
  "email": "ana@example.com",
  "password": "una-contraseña-segura",
  "displayName": "Ana"
}
```

Devuelve el usuario público y deja iniciada la sesión.

`POST /api/auth/login`

Recibe email y contraseña. Si son correctos, crea la sesión.

Para evitar revelar si un email existe, el error de credenciales debe ser genérico: `Email o contraseña incorrectos`.

### Protegidas

`GET /api/auth/me`

Devuelve el usuario autenticado. El frontend la usará al arrancar para recuperar el estado de sesión.

`POST /api/auth/logout`

Borra la cookie de sesión.

Las futuras rutas protegidas, por ejemplo `POST /api/shots`, usarán el mismo middleware de autenticación.

## 5. JWT y cookie

Para el navegador usaremos inicialmente un JWT dentro de una cookie:

- `HttpOnly`: JavaScript del navegador no puede leerla.
- `Secure`: en producción solo viaja por HTTPS.
- `SameSite=Lax`: reduce peticiones cross-site no deseadas.
- Expiración corta, por ejemplo 15 minutos.
- El secreto se configura mediante una variable de entorno, nunca en Git.

En desarrollo, frontend y API pueden estar en puertos distintos. Habrá que configurar CORS con un origen explícito y activar `credentials` en cliente y servidor.

Más adelante podremos añadir refresh tokens para mantener sesiones largas sin alargar demasiado la vida del access token.

## 6. Estructura propuesta para `apps/api`

El API todavía no está creado en el repositorio. Cuando lo implementemos, mantendremos la separación del proyecto:

```text
apps/api/src/
├── app.ts
├── server.ts
├── config/
│   └── env.ts
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.schemas.ts
│   │   └── auth.types.ts
│   └── shots/
│       ├── shots.routes.ts
│       ├── shots.controller.ts
│       ├── shots.service.ts
│       └── shots.schemas.ts
├── middleware/
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── db/
│   └── prisma.ts
└── domain/
    └── user/
        └── user.types.ts
```

`auth` será el primer módulo, pero no el único. Cuando trabajemos con shots añadiremos `modules/shots` con sus propias rutas, controladores, servicios y validaciones.

Responsabilidades:

- `routes`: define las URLs y conecta métodos HTTP con controladores del módulo.
- `controller`: traduce HTTP a una llamada del servicio y construye la respuesta.
- `service`: contiene registro, login y logout.
- `middleware`: verifica el JWT antes de una ruta protegida.
- `schemas`: valida y transforma la entrada.
- `domain`: tipos y reglas independientes de Express.

## 7. Autenticación frente a autorización

El flujo para un shot será:

```text
Petición a POST /api/shots
  → auth.middleware verifica el JWT
  → req.user.userId identifica al autor
  → shots.service crea el shot con ese userId
```

La autenticación responde: “este usuario es Ana”.

La autorización responde: “Ana puede editar este shot porque es suyo”.

Por ejemplo, para editar o borrar un shot nunca aceptaremos el autor desde el body. El servicio buscará el shot y comprobará que su `userId` coincide con el usuario autenticado. Esta regla se reutilizará también para comentarios, recetas y perfiles.

Express permite montar routers y aplicar middleware a un conjunto de rutas. El middleware de autenticación deberá añadir un `userId` verificado a la petición o devolver `401`.

## 8. Validaciones mínimas

En registro:

- email con formato válido;
- email normalizado;
- `displayName` no vacío;
- contraseña con una longitud mínima razonable;
- email no duplicado.

En login:

- validar formato básico;
- responder igual ante email inexistente o contraseña incorrecta;
- no registrar contraseñas ni JWT en logs.

## 9. Códigos HTTP

Usaremos estos códigos:

- `201`: usuario creado.
- `200`: login, logout o `/me` correctos.
- `400`: datos de entrada inválidos.
- `401`: falta autenticación o las credenciales no son válidas.
- `409`: email ya registrado.
- `500`: error inesperado del servidor.

## 10. Orden de implementación

1. Crear `apps/api` con Express y TypeScript.
2. Configurar variables de entorno y conexión Prisma/PostgreSQL.
3. Crear el modelo `User` y ejecutar la primera migración.
4. Añadir validación de entrada.
5. Añadir hash de contraseñas.
6. Implementar registro.
7. Implementar login y emisión de cookie.
8. Implementar `auth.middleware.ts`.
9. Implementar `/auth/me` y `/auth/logout`.
10. Conectar el frontend y proteger una primera ruta real.

Cada etapa debe probarse antes de avanzar a la siguiente.

## 11. Reglas de seguridad que no debemos romper

- Nunca guardar contraseñas en texto plano.
- Nunca enviar `passwordHash` al frontend.
- Nunca poner secretos JWT en el código o en el repositorio.
- No aceptar un `userId` del cliente para decidir quién realiza una acción; usar siempre el `userId` verificado por el middleware.
- No distinguir entre “email inexistente” y “contraseña incorrecta” en el login.
- Añadir limitación de intentos de login antes de publicar el API.
- Usar HTTPS en producción.

## Referencias

- [Express: middleware y routers](https://expressjs.com/en/guide/using-middleware.html)
- [Express: manejo de errores](https://expressjs.com/en/guide/error-handling.html)
- [Prisma: modelos y restricciones](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)
- [Prisma: migraciones](https://www.prisma.io/docs/orm/prisma-migrate)
