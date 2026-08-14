# Autenticación de BadShot

## Diferencia básica

```text
Autenticación → comprobar quién eres
Autorización   → comprobar qué puedes hacer
```

Ejemplo:

```text
Login correcto              → “Este usuario es Manuel”
Editar un shot              → “Manuel puede editar este shot”
```

## Estado actual

Ya tenemos:

```text
POST /api/auth/register → crea un usuario
POST /api/auth/login    → comprueba email y contraseña
```

El usuario se guarda en PostgreSQL mediante Prisma.

La contraseña original nunca se guarda. Se guarda un hash Argon2id:

```text
contraseña → hash Argon2id → passwordHash
```

## Registro

```text
Frontend
  ↓ email, password, displayName
API
  ↓ valida los datos
  ↓ genera passwordHash
  ↓ guarda User en PostgreSQL
Respuesta
  ↓ devuelve datos públicos
```

No se devuelve `passwordHash` al cliente.

## Login actual

```text
Frontend
  ↓ email y password
API
  ↓ busca el usuario por email
  ↓ compara password con passwordHash
  ↓ correcto: devuelve el usuario
  ↓ incorrecto: devuelve 401
```

Actualmente el login todavía no mantiene una sesión.

## Próximo paso: JWT

Después de un login correcto, el backend creará un JWT.

Para generarlos y verificarlos usaremos la librería `jose`:

```bash
npm install -w apps/api jose
```

La dependencia ya está instalada, pero todavía no hemos creado ni conectado ningún JWT.

La utilidad está en:

```text
apps/api/src/security/jwt.ts
```

Funciones disponibles:

```text
createAccessToken(userId) → genera un JWT
verifyAccessToken(token)  → verifica firma, caducidad y devuelve userId
```

Configuración actual:

```text
Algoritmo: HS256
Duración:  15 minutos
Identidad: userId dentro de subject (sub)
Secreto:   JWT_SECRET en apps/api/.env
```

El secreto nunca debe escribirse directamente en el código ni compartirse.

Un JWT es una credencial firmada que representa al usuario durante un tiempo limitado:

```json
{
  "sub": "id-del-usuario",
  "iat": "fecha-de-creación",
  "exp": "fecha-de-caducidad"
}
```

El JWT no debe contener:

```text
password
passwordHash
secretos
```

## Petición autenticada

```text
Login correcto
  ↓
API crea JWT
  ↓
Cliente lo envía en futuras peticiones
  ↓
Middleware verifica el JWT
  ↓
API conoce el userId
```

Si el JWT falta, es inválido o ha caducado:

```text
401 Unauthorized
```

## Autorización futura

Con el `userId` verificado podremos comprobar permisos:

```text
Manuel quiere editar un shot
  ↓
JWT identifica a Manuel
  ↓
API comprueba que el shot pertenece a Manuel
  ↓
permitir o rechazar la operación
```

## Flujo completo previsto

```text
Registro
  → guardar usuario y passwordHash

Login
  → verificar contraseña
  → crear JWT

Petición protegida
  → verificar JWT
  → obtener userId
  → comprobar permisos
  → ejecutar operación
```
