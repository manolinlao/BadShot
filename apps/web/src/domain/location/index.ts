import type { ShotLocation } from '../../types';

export function formatLocation(location?: ShotLocation) {
  if (!location) return '';

  const parts = [location.name, location.city, location.country].filter(
    Boolean,
  );

  return parts.join(' - ');
}
