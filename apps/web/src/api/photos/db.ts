import { db } from '../db/database';
import type { PhotoEntry } from '../../types';

export async function savePhoto(photo: PhotoEntry): Promise<void> {
  await db.photos.put(photo);
}

export async function getPhoto(id: string): Promise<PhotoEntry | undefined> {
  return db.photos.get(id);
}

export async function getPhotosByShotId(shotId: string): Promise<PhotoEntry[]> {
  return db.photos.where('shotId').equals(shotId).toArray();
}

export async function deletePhoto(id: string): Promise<void> {
  await db.photos.delete(id);
}
