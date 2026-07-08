import type { Coffee } from '../coffee/types';
import type { ShotLocation } from '../location/types';
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

export function matchesShotSearchQuery(
  shot: {
    coffee: Coffee;
    location?: ShotLocation;
    tastingNotes?: string;
  },
  query: string,
): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return true;

  const haystack = [
    shot.coffee.name,
    shot.coffee.origin,
    shot.coffee.roaster,
    shot.location?.name,
    shot.location?.city,
    shot.location?.country,
    shot.tastingNotes,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

export type ShotQuickFilter =
  | 'all'
  | 'top-rated'
  | 'with-photo'
  | 'with-location';

export function matchesShotQuickFilter(
  shot: {
    rating?: number;
    photoId?: string;
    location?: ShotLocation;
  },
  filter: ShotQuickFilter,
): boolean {
  if (filter === 'all') return true;

  if (filter === 'top-rated') {
    return (shot.rating ?? 0) >= 4;
  }

  if (filter === 'with-location') {
    return Boolean(shot.location?.name?.trim());
  }

  return Boolean(shot.photoId);
}

export type ShotDateRange = {
  from?: string;
  to?: string;
};

function getLocalDateValue(isoDate: string): string {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function matchesShotDateRange(
  shot: {
    brewedAt: string;
  },
  range: ShotDateRange,
): boolean {
  const brewedDate = getLocalDateValue(shot.brewedAt);

  if (range.from && brewedDate < range.from) {
    return false;
  }

  if (range.to && brewedDate > range.to) {
    return false;
  }

  return true;
}

export function createShot(input: ShotCreationInput) {
  return {
    id: input.id,
    user: input.user ?? { displayName: 'You', username: 'local' },
    coffee: input.coffee,
    location: input.location,
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
