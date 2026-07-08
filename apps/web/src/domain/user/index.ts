import type { ShotUser } from './types';

export function getDisplayName(user: ShotUser): string {
  return user.displayName?.trim() || 'BadShot user';
}

export function getUserName(user: ShotUser): string {
  return user.username?.trim() || '';
}

export function getAvatarInitial(user: ShotUser): string {
  const displayName = getDisplayName(user);
  return displayName.charAt(0).toUpperCase();
}

export type { ShotUser } from './types';
