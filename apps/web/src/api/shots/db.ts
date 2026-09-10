import { db } from '../db/database';
import type { Shot } from '../../domain/shot/types';

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

export async function deleteMissingServerShots(
  serverIds: string[],
): Promise<void> {
  const serverIdSet = new Set(serverIds);
  const localShots = await db.shots.toArray();
  const staleShots = localShots.filter(
    (shot) => shot.serverId && !serverIdSet.has(shot.serverId),
  );

  if (staleShots.length === 0) return;

  await db.transaction('rw', db.shots, db.photos, async () => {
    for (const shot of staleShots) {
      await db.photos.where('shotId').equals(shot.id).delete();
    }

    await db.shots.bulkDelete(staleShots.map((shot) => shot.id));
  });
}
