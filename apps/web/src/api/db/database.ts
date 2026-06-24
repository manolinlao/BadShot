import Dexie, { type Table } from 'dexie';
import type { PhotoEntry, Shot } from '../../types';

export const DATABASE_NAME = 'badshot-db';
export const DATABASE_VERSION = 1;

export const STORES = {
  shots: 'shots',
  photos: 'photos',
} as const;

export class BadShotDatabase extends Dexie {
  shots!: Table<Shot>;
  photos!: Table<PhotoEntry>;

  constructor() {
    super(DATABASE_NAME);

    // aquí estás definiendo el esquema de IndexedDB
    // 1 es la versión de la base de datos
    // Más adelante, si cambias la estructura:
    //      Dexie ejecutará una migración automáticamente.
    //      Por eso es importante no tocar el número sin motivo.

    // Aquí defines los object stores de IndexedDB. Piensa en ellos como tablas SQL
    // La primera propiedad es siempre la clave primaria.
    // createdAt no es obligatorio. es un "indice" que nos permitirá ordenar los shots por fecha de creación.
    // Sin índice, IndexedDB tendría que recorrer todos los registros.
    // Con índice es mucho más rápido.
    //      Lo estamos declarando porque probablemente querrás hacer:
    //      db.shots.orderBy('createdAt')
    // Regla: Solo indexa los campos por los que realmente vas a buscar u ordenar
    this.version(1).stores({
      shots: 'id, createdAt',
      photos: 'id, shotId',
    });
  }
}

export const db = new BadShotDatabase();
