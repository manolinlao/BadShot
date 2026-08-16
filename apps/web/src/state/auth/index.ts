import { createEffect, createEvent, createStore } from 'effector';
import {
  getMe,
  changePassword,
  updateProfile,
  type AuthUser,
} from '../../api/auth/client';

const loadSessionFx = createEffect(async (): Promise<AuthUser | null> => {
  try {
    return await getMe();
  } catch {
    return null;
  }
});

const userLoggedIn = createEvent<AuthUser>();
const userLoggedOut = createEvent();
const updateProfileFx = createEffect(updateProfile);
const changePasswordFx = createEffect(changePassword);

const $currentUser = createStore<AuthUser | null>(null)
  .on(loadSessionFx.doneData, (_, user) => user)
  .on(userLoggedIn, (_, user) => user)
  .on(updateProfileFx.doneData, (_, user) => user)
  .reset(userLoggedOut);

const $sessionReady = createStore(false).on(loadSessionFx.finally, () => true);

const $authLoading = loadSessionFx.pending;
const $profileUpdating = updateProfileFx.pending;
const $passwordUpdating = changePasswordFx.pending;

export const authStores = {
  $currentUser,
  $authLoading,
  $profileUpdating,
  $passwordUpdating,
  $sessionReady,
};

export const authEffects = {
  loadSessionFx,
  updateProfileFx,
  changePasswordFx,
};

export const authEvents = {
  userLoggedIn,
  userLoggedOut,
};
