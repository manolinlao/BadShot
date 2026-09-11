// Los archivos fuente son .ts, pero Node ejecutará los archivos compilados .js.
// Por eso los imports locales del backend terminan en .js.
import express from 'express';
import { createServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { readFileSync } from 'node:fs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { prisma } from './db/prisma.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { shotsRouter } from './modules/shots/shots.routes.js';
import { uploadDir } from './modules/shots/upload.js';
import { createRealtimeServer } from './realtime/realtime.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);
const webOrigins = (process.env.WEB_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || webOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(uploadDir));
app.use('/api/auth', authRouter);
app.use('/api/shots', shotsRouter);

app.get('/health', (_request, response) => {
  response.json({
    success: true,
    data: {
      status: 'ok',
    },
  });
});

app.get('/health/db', async (_request, response) => {
  try {
    const userCount = await prisma.user.count();

    response.json({
      success: true,
      data: {
        database: 'connected',
        users: userCount,
      },
    });
  } catch (error) {
    console.error(error);

    response.status(500).json({
      success: false,
      error: {
        message: 'No se pudo conectar con la base de datos',
      },
    });
  }
});

/** para probar esto desde un terminal de bash hacer
 * 
  curl -X POST http://localhost:3000/demo \
  -H "Content-Type: application/json" \
  -d '{"name":"Ana"}'

  curl es un programa de terminal para hacer peticiones HTTP. 
  Es como un navegador muy sencillo, 
  pero en vez de abrir una página, 
  muestra la respuesta directamente en la consola.
  El carácter \ al final de cada línea solo permite escribir el comando en varias líneas. También podrías escribirlo todo en una línea:

    -X POST
        Indica el método HTTP: queremos enviar datos mediante POST.
    -H "Content-Type: application/json"
        Añade una cabecera HTTP. Le dice al backend: Los datos que te envío están en formato JSON
    -d '{"name":"Ana"}'
        Envía el cuerpo de la petición:

    response.json envia una respuesta http en formato json al cliente, 
        si el cliente se hizo con curl --> aparece en la terminal
        con el navegador --> aparece en la página
        con el frontend --> lo recibirá el JS
        con postman --> aparecerá en el panel de respuesta
 * 
 */
app.post('/demo', (request, response) => {
  const { name } = request.body as { name?: string };

  if (typeof name !== 'string' || name.trim().length === 0) {
    response.status(400).json({
      success: false,
      error: {
        message: 'name es obligatorio',
      },
    });
    return;
  }

  response.json({
    success: true,
    data: {
      message: `Hola, ${name.trim()}`,
    },
  });
});

app.use(errorMiddleware);

const httpsCertificatePath = process.env.HTTPS_CERT_PATH;
const httpsKeyPath = process.env.HTTPS_KEY_PATH;
const httpServer =
  httpsCertificatePath && httpsKeyPath
    ? createHttpsServer(
        {
          cert: readFileSync(httpsCertificatePath),
          key: readFileSync(httpsKeyPath),
        },
        app,
      )
    : createServer(app);
createRealtimeServer(httpServer, webOrigins);

httpServer.listen(port, () => {
  const protocol = httpsCertificatePath && httpsKeyPath ? 'https' : 'http';
  console.log(`API listening on ${protocol}://localhost:${port}`);
});
