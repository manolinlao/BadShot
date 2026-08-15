import { createEffect, createEvent, createStore } from 'effector';
import { getMe, type AuthUser } from '../../api/auth/client';

const loadSessionFx = createEffect(async (): Promise<AuthUser | null> => {
  try {
    return await getMe();
  } catch {
    return null;
  }
});

const userLoggedIn = createEvent<AuthUser>();
const userLoggedOut = createEvent();

const $currentUser = createStore<AuthUser | null>(null)
  .on(loadSessionFx.doneData, (_, user) => user)
  .on(userLoggedIn, (_, user) => user)
  .reset(userLoggedOut);

const $sessionReady = createStore(false).on(loadSessionFx.finally, () => true);

const $authLoading = loadSessionFx.pending;

export const authStores = {
  $currentUser,
  $authLoading,
  $sessionReady,
};

export const authEffects = {
  loadSessionFx,
};

export const authEvents = {
  userLoggedIn,
  userLoggedOut,
};
