import 'dotenv/config';
import { env } from 'node:process';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

const connectionString = env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL no está definida');
}

// Lee la dirección de PostgreSQL.
const adapter = new PrismaPg({
  connectionString,
});

// Crea el objeto que permitirá consultar la base de datos.
// Hace disponible esa conexión para el resto del API.
export const prisma = new PrismaClient({
  adapter,
});
