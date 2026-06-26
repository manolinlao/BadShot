import { createEffect, createStore } from 'effector';
import type { Shot } from '../../types';
import { deleteShot, getAllShots, saveShot } from '../../api/shots/db';
import { deletePhoto } from '../../api/photos/db';

const loadShotsFx = createEffect(async () => {
  return getAllShots();
});
const saveShotFx = createEffect(async (shot: Shot) => {
  await saveShot(shot);
  return shot;
});
const deleteShotFx = createEffect(async (shot: Shot) => {
  if (shot.photoId) {
    await deletePhoto(shot.photoId);
  }
  await deleteShot(shot.id);
  return shot.id;
});
const $shots = createStore<Shot[]>([])
  .on(loadShotsFx.doneData, (_, shots) => shots)
  .on(saveShotFx.doneData, (shots, savedShot) => {
    const filtered = shots.filter((shot) => shot.id !== savedShot.id);

    return [savedShot, ...filtered];
  })
  .on(deleteShotFx.doneData, (shots, shotId) =>
    shots.filter((shot) => shot.id !== shotId),
  );

const $shotsLoading = loadShotsFx.pending;

export const shotsStores = {
  $shots,
  $shotsLoading,
};

export const shotsEffects = {
  loadShotsFx,
  saveShotFx,
  deleteShotFx,
};
