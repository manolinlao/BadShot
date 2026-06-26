import { db } from '../db/database';
import type { Shot } from '../../types';

// La idea es que el resto de la aplicación no conozca Dexie.

export async function getAllShots(): Promise<Shot[]> {
  return db.shots.toArray();
}

// put sirve tanto para add como update
export async function saveShot(shot: Shot): Promise<Shot> {
  await db.shots.put(shot);
  return shot;
}

export async function deleteShot(id: string): Promise<void> {
  await db.shots.delete(id);
}
