import type { Shot } from '../../types';
import type { Recipe } from '../../types';

export function getRecipeRatio(shot: Shot): string | null {
  const recipe = shot.recipe;

  if (!recipe?.doseIn || !recipe?.doseOut) {
    return null;
  }

  return (recipe.doseOut / recipe.doseIn).toFixed(2);
}

export function hasRecipeStats(recipe?: Recipe): boolean {
  return Boolean(recipe?.doseIn || recipe?.doseOut || recipe?.time);
}
