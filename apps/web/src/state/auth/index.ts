import { createEffect, createStore } from 'effector';
import { getMe, type AuthUser } from '../../api/auth/client';

const loadSessionFx = createEffect(async (): Promise<AuthUser | null> => {
  try {
    return await getMe();
  } catch {
    return null;
  }
});

const $currentUser = createStore<AuthUser | null>(null).on(
  loadSessionFx.doneData,
  (_, user) => user,
);

const $authLoading = loadSessionFx.pending;

export const authStores = {
  $currentUser,
  $authLoading,
};

export const authEffects = {
  loadSessionFx,
};
