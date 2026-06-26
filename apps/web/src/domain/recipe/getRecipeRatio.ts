import type { Shot } from '../../types';

export function getRecipeRatio(shot: Shot): string | null {
  const recipe = shot.recipe;

  if (!recipe?.doseIn || !recipe?.doseOut) {
    return null;
  }

  return (recipe.doseOut / recipe.doseIn).toFixed(2);
}
