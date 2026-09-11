# Cloudflare y misterlao.com

## Qué estoy haciendo

Cloudflare se ha colocado delante de la web para gestionar los DNS, el HTTPS y, más adelante, publicar BadShot desde el ordenador de casa.

La situación actual es:

```text
Alguien escribe misterlao.com
          |
          v
Cloudflare recibe la petición
          |
          v
Cloudflare la reenvía al hosting de cdmon
          |
          v
Se muestra la página actual de cdmon
```

## Qué es cada servicio

- **cdmon** sigue siendo el registrador del dominio. El dominio continúa comprado allí.
- **cdmon** sigue teniendo el hosting y el microplan actuales.
- **Cloudflare** gestiona ahora los DNS del dominio y está delante de la web.
- **DNS** es la agenda que indica a qué servidor debe dirigirse cada dominio.
- **Cloudflare Tunnel** será el sistema que permitirá publicar BadShot desde el ordenador de casa sin abrir puertos del router.

## Qué ha cambiado

Antes, cdmon respondía directamente a la pregunta:

> "¿Dónde está misterlao.com?"

Ahora responde Cloudflare. Cloudflare ha importado los registros DNS que existían en cdmon y, con ellos, continúa enviando la web a cdmon.

No se ha movido ni borrado la web de cdmon. Solo ha cambiado quién gestiona las indicaciones DNS.

## Estado actual

```text
Dominio:          sigue en cdmon
Hosting actual:   sigue en cdmon
Microplan:        sigue en cdmon
DNS:              ahora los gestiona Cloudflare
Web actual:       sigue alojada en cdmon
BadShot:          todavía no está publicado en Internet
DNSSEC:           desactivado temporalmente durante la migración
HTTPS Cloudflare: pendiente de validación inicial
```

## Por qué se desactivó DNSSEC

DNSSEC protege las respuestas DNS con firmas criptográficas. Al cambiar los servidores DNS de cdmon a Cloudflare, las firmas antiguas de cdmon dejan de coincidir con las claves de Cloudflare.

Si se mantiene DNSSEC activo durante el cambio, algunos navegadores y resolvers pueden considerar el dominio inválido y devolver errores `SERVFAIL`.

Por eso se desactivó temporalmente. Cuando Cloudflare esté completamente activo y el dominio funcione correctamente, DNSSEC se podrá volver a activar desde Cloudflare con nuevas claves.

## El certificado HTTPS

En Cloudflare, dentro de **SSL/TLS -> Edge Certificates**, el certificado puede aparecer inicialmente como:

```text
Pending Validation (TXT)
```

Esto significa que Cloudflare todavía está validando el certificado HTTPS para `misterlao.com`. Mientras esté pendiente, puede aparecer ocasionalmente:

```text
ERR_SSL_VERSION_OR_CIPHER_MISMATCH
```

No hay que activar Advanced Certificate Manager. Para este proyecto basta el certificado Universal SSL incluido en el plan gratuito.

Hay que esperar a que el certificado pase a:

```text
Active
```

## Cómo quedará BadShot

La idea es separar la web antigua de cdmon y la aplicación nueva:

```text
misterlao.com
    -> página actual alojada en cdmon

badshot.misterlao.com
    -> frontend de BadShot en el ordenador de casa

api.badshot.misterlao.com
    -> backend y WebSocket de BadShot en el ordenador de casa
```

Así no hace falta sustituir la web actual ni tocar el hosting de cdmon.

## Qué haremos después

1. Esperar a que el certificado Universal SSL aparezca como `Active`.
2. Crear un Cloudflare Tunnel desde el ordenador de casa.
3. Asociar el frontend de BadShot a `badshot.misterlao.com`.
4. Asociar la API y los WebSockets a `api.badshot.misterlao.com`.
5. Configurar el frontend y la API para usar esas direcciones HTTPS.
6. Probar BadShot desde un móvil conectado a Internet fuera de casa.

## Qué no hay que hacer

- No cancelar el microplan de cdmon.
- No borrar el hosting de cdmon.
- No cambiar otra vez los servidores DNS mientras Cloudflare está validando el dominio.
- No sustituir los registros de `misterlao.com` sin comprobar antes qué servicio apuntan.
- No publicar todavía BadShot en el dominio raíz si queremos conservar la web actual.

