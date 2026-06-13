import type { RoastLevel } from '../domain/coffee/roastLevel';

export type Shot = {
  id: string;
  user: {
    displayName?: string;
    username?: string;
    avatarUrl?: string;
  };
  imageUrl?: string;
  coffee: {
    name?: string;
    origin?: string;
    roaster?: string;
    roastLevel?: RoastLevel;
  };
  location?: ShotLocation;
  recipe?: {
    doseIn?: number;
    doseOut?: number;
    time?: number;
  };
  tastingNotes?: string;
  rating?: number;
  likesCount?: number;
  commentsCount?: number;
  brewedAt: string; // fecha real del café ISO
  createdAt: string; // fecha de publicación ISO
};

export type ShotLocation = {
  name: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
};
