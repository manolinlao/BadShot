import type { Coffee } from '../coffee/types';
import type { ShotCreationInput } from './types';

export function getCoffeeTitle(coffee: Coffee): string {
  return coffee.name?.trim() || coffee.origin?.trim() || 'Untitled shot';
}

export function hasCoffeeMeta(coffee: Coffee): boolean {
  return Boolean(
    coffee.origin?.trim() || coffee.roaster?.trim() || coffee.roastLevel,
  );
}

export function getShotPreviewTitle(shot: {
  coffee: Coffee;
  brewedAt: string;
}): string {
  return getCoffeeTitle(shot.coffee);
}

export function createShot(input: ShotCreationInput) {
  return {
    id: input.id,
    user: input.user ?? { displayName: 'You', username: 'local' },
    coffee: input.coffee,
    location: input.location ?? { name: 'Home' },
    recipe: input.recipe,
    tastingNotes: input.tastingNotes,
    rating: input.rating,
    likesCount: input.likesCount ?? 0,
    commentsCount: input.commentsCount ?? 0,
    brewedAt: input.brewedAt ?? new Date().toISOString(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    photoId: input.photoId,
  };
}

export type { Shot } from './types';
