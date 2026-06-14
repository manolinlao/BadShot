export type Rating = 1 | 2 | 3 | 4 | 5;

export const ratingOptions: Array<{
  value: Rating;
  label: string;
}> = [
  { value: 1, label: '😬 Bad' },
  { value: 2, label: '😐 Meh' },
  { value: 3, label: '😊 Ok' },
  { value: 4, label: '😋 Good' },
  { value: 5, label: '🔥 Super!' }
];

export const ratingLabel: Record<number, string> = {
  1: '😬 Bad',
  2: '😐 Meh',
  3: '😊 Ok',
  4: '😋 Good',
  5: '🔥 Super!'
};
