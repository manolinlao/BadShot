import type { Coffee } from '../../types';

export function getCoffeeTitle(coffee: Coffee): string {
  return coffee.name?.trim() || coffee.origin?.trim() || 'Untitled shot';
}

export function hasCoffeeMeta(coffee: Coffee): boolean {
  return Boolean(
    coffee.origin?.trim() || coffee.roaster?.trim() || coffee.roastLevel,
  );
}
