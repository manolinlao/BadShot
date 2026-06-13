// no usamos enum porque enum se convierte en código JavaScript real en runtime
export type RoastLevel = 'light' | 'medium-light' | 'medium' | 'dark';

export const RoastLevelLabel: Record<RoastLevel, string> = {
  light: 'Light',
  'medium-light': 'Medium Light',
  medium: 'Medium',
  dark: 'Dark'
};
