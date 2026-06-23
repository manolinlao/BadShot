// Avoid enum here because it emits JavaScript at runtime.
export type RoastLevel = 'light' | 'medium-light' | 'medium' | 'dark';

export const RoastLevelLabel: Record<RoastLevel, string> = {
  light: 'Light',
  'medium-light': 'Medium Light',
  medium: 'Medium',
  dark: 'Dark',
};
