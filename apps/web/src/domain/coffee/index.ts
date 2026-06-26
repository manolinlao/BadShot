import { Flame, Frown, Laugh, Meh, Smile, type LucideIcon } from 'lucide-react';

export type Rating = 1 | 2 | 3 | 4 | 5;

export const ratingOptions: Array<{
  value: Rating;
  label: string;
}> = [
  { value: 1, label: 'Bad' },
  { value: 2, label: 'Meh' },
  { value: 3, label: 'Ok' },
  { value: 4, label: 'Good' },
  { value: 5, label: 'Super!' },
];

export const ratingLabel: Record<number, string> = {
  1: 'Bad',
  2: 'Meh',
  3: 'Ok',
  4: 'Good',
  5: 'Super!',
};

export function isRating(value: number | undefined): value is Rating {
  return (
    value === 1 || value === 2 || value === 3 || value === 4 || value === 5
  );
}

export const ratingIcon = {
  1: { icon: Frown, color: 'text-red-500', activeBg: 'bg-red-50' },
  2: { icon: Meh, color: 'text-amber-500', activeBg: 'bg-amber-50' },
  3: { icon: Smile, color: 'text-sky-500', activeBg: 'bg-sky-50' },
  4: { icon: Laugh, color: 'text-emerald-500', activeBg: 'bg-emerald-50' },
  5: { icon: Flame, color: 'text-orange-500', activeBg: 'bg-orange-50' },
} satisfies Record<
  Rating,
  {
    icon: LucideIcon;
    color: string;
    activeBg: string;
  }
>;

// Avoid enum here because it emits JavaScript at runtime.
export type RoastLevel = 'light' | 'medium-light' | 'medium' | 'dark';

export const RoastLevelLabel: Record<RoastLevel, string> = {
  light: 'Light',
  'medium-light': 'Medium Light',
  medium: 'Medium',
  dark: 'Dark',
};
