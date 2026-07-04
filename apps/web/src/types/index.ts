import type { RoastLevel } from '../domain/coffee';

export interface ShotUser {
  displayName?: string;
  username?: string;
  avatarUrl?: string;
}

export interface Coffee {
  name?: string;
  origin?: string;
  roaster?: string;
  roastLevel?: RoastLevel;
}

export type Shot = {
  id: string;
  user: ShotUser;
  coffee: Coffee;
  location?: ShotLocation;
  recipe?: Recipe;
  tastingNotes?: string;
  rating?: number;
  likesCount?: number;
  commentsCount?: number;
  brewedAt: string; // actual coffee date as ISO
  createdAt: string; // post publication date as ISO

  photoId?: string; // de momento sólo dejo 1 foto
};

export interface PhotoEntry {
  id: string;
  shotId: string;
  blob: Blob;
}

export type ShotLocation = {
  name: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
};

export interface Recipe {
  doseIn?: number;
  doseOut?: number;
  time?: number;
}
