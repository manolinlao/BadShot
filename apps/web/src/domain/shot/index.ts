import type { Shot } from '../../types';

export function getCoffeeTitle(shot: Shot): string {
  return (
    shot.coffee.name?.trim() || shot.coffee.origin?.trim() || 'Untitled shot'
  );
}

export function hasCoffeeMeta(shot: Shot): boolean {
  return Boolean(
    shot.coffee.origin?.trim() ||
    shot.coffee.roaster?.trim() ||
    shot.coffee.roastLevel,
  );
}
