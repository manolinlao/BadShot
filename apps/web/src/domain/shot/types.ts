import type { Coffee } from '../coffee/types';
import type { Recipe } from '../recipe/types';
import type { ShotLocation } from '../location/types';
import type { ShotUser } from '../user/types';

export interface Shot {
  id: string;
  user: ShotUser;
  coffee: Coffee;
  location?: ShotLocation;
  recipe?: Recipe;
  tastingNotes?: string;
  rating?: number;
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
  photoId?: string;
}

export interface ShotCreationInput {
  id: string;
  user?: ShotUser;
  coffee: Coffee;
  location?: ShotLocation;
  recipe?: Recipe;
  tastingNotes?: string;
  rating?: number;
  likesCount?: number;
  commentsCount?: number;
  createdAt?: string;
  photoId?: string;
}
