import type { Shot } from '../../types';

export function getCoffeeTitle(shot: Shot): string {
  return (
    shot.coffee.name?.trim() || shot.coffee.origin?.trim() || 'Untitled shot'
  );
}
