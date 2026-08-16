import type { Coffee } from '../coffee/types';
import type { Recipe } from '../recipe/types';
import type { ShotLocation } from '../location/types';
import type { ShotUser } from '../user/types';

export interface Shot {
  id: string;
  serverId?: string;
  userId?: string;
  photoUrl?: string;
  user: ShotUser;
  coffee: Coffee;
  flavors?: string[];
  location?: ShotLocation;
  recipe?: Recipe;
  tastingNotes?: string;
  aromaScore?: number;
  acidityScore?: number;
  bodyScore?: number;
  sweetnessScore?: number;
  finishScore?: number;
  rating?: number;
  likesCount?: number;
  likedByMe?: boolean;
  createdAt: string;
  photoId?: string;
}

export interface ShotCreationInput {
  id: string;
  serverId?: string;
  photoUrl?: string;
  user?: ShotUser;
  coffee: Coffee;
  flavors?: string[];
  location?: ShotLocation;
  recipe?: Recipe;
  tastingNotes?: string;
  aromaScore?: number;
  acidityScore?: number;
  bodyScore?: number;
  sweetnessScore?: number;
  finishScore?: number;
  rating?: number;
  likesCount?: number;
  createdAt?: string;
  photoId?: string;
}
