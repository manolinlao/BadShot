export type RoastLevel = 'light' | 'medium-light' | 'medium' | 'dark';

export interface Coffee {
  name?: string;
  origin?: string;
  roaster?: string;
  roastLevel?: RoastLevel;
}
