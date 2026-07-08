import type { ShotLocation } from './types';

export function formatLocation(location?: ShotLocation) {
  if (!location) return '';

  const parts = Array.from(
    new Set([location.name, location.city, location.country].filter(Boolean)),
  );

  return parts.join(' - ');
}

export type { ShotLocation } from './types';
