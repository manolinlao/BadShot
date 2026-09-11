# Resend

BadShot usa Resend para enviar los enlaces de recuperación de contraseña.

## Configuración local

La API key nunca debe guardarse en este documento, en Git ni compartirse por
chat. Añade estos valores a `apps/api/.env`:

```env
APP_URL="http://localhost:5173"
RESEND_API_KEY="re_pon_aqui_la_clave"
EMAIL_FROM="BadShot <onboarding@resend.dev>"
```

Después de cambiar `.env`, reinicia la API:

```bash
npm run dev
```

## Prueba gratuita

El plan gratuito de Resend permite probar el envío de emails con un límite
mensual y diario. El remitente `onboarding@resend.dev` es solo para pruebas y
Resend limita los destinatarios a la dirección asociada a la cuenta de Resend.

Para probar la recuperación local:

1. Usa como email de la cuenta BadShot la misma dirección asociada a Resend.
2. Abre `/login`.
3. Pulsa `Forgot your password?`.
4. Solicita el enlace de recuperación.
5. Revisa la bandeja de entrada y la carpeta de spam.

## Envío a otros usuarios

Para enviar enlaces a otros usuarios, verifica un dominio propio en el panel de
Resend y configura un remitente de ese dominio:

```env
EMAIL_FROM="BadShot <noreply@tudominio.com>"
```

Resend proporciona registros DNS que deben añadirse en el proveedor del
dominio. Hasta que el dominio esté verificado, `onboarding@resend.dev` no sirve
para destinatarios arbitrarios.

## Seguridad

- Guarda `RESEND_API_KEY` solo en variables de entorno.
- No la pongas en el frontend.
- No la subas a Git.
- Si una clave se expone, revócala en Resend y crea otra.
- La API responde de forma genérica al solicitar recuperación para no revelar
  si un email está registrado.

## Documentación oficial

- https://resend.com/pricing/
- https://resend.com/docs/api-reference/emails/send-email
- https://resend.com/docs/knowledge-base/how-do-I-create-an-email-address-or-sender
