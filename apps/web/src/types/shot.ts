import type { RoastLevel } from '../domain/coffee/roastLevel';

export type Shot = {
  id: string;
  user: {
    displayName?: string;
    username?: string;
    avatarUrl?: string;
  };
  coffee: {
    name?: string;
    origin?: string;
    roaster?: string;
    roastLevel?: RoastLevel;
  };
  location?: ShotLocation;
  recipe?: Recipe;
  tastingNotes?: string;
  rating?: number;
  likesCount?: number;
  commentsCount?: number;
  brewedAt: string; // actual coffee date as ISO
  createdAt: string; // post publication date as ISO
  
  imageUrl?: string;
  photoIds: string[];
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
