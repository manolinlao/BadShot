// serverShots → shots guardados en PostgreSQL
// shots       → shots locales de Dexie

import { createEffect, createStore } from 'effector';
import {
  createApiShot,
  deleteApiShot,
  getMyShots,
  updateApiShot,
  type ApiShot,
  type UpdateApiShotInput,
} from '../../api/shots/client';

const loadServerShotsFx = createEffect(getMyShots);
const createServerShotFx = createEffect(createApiShot);
const deleteServerShotFx = createEffect(async (serverId: string) => {
  await deleteApiShot(serverId);
  return serverId;
});
const updateServerShotFx = createEffect(
  async (input: { serverId: string; data: UpdateApiShotInput }) =>
    updateApiShot(input.serverId, input.data),
);

const $serverShots = createStore<ApiShot[]>([])
  .on(loadServerShotsFx.doneData, (_, shots) => shots)
  .on(createServerShotFx.doneData, (shots, shot) => [shot, ...shots])
  .on(deleteServerShotFx.doneData, (shots, serverId) =>
    shots.filter((shot) => shot.id !== serverId),
  )
  .on(updateServerShotFx.doneData, (shots, updatedShot) =>
    shots.map((shot) => (shot.id === updatedShot.id ? updatedShot : shot)),
  );

const $serverShotsLoading = loadServerShotsFx.pending;

export const serverShotsStores = {
  $serverShots,
  $serverShotsLoading,
};

export const serverShotsEffects = {
  loadServerShotsFx,
  createServerShotFx,
  deleteServerShotFx,
  updateServerShotFx,
};
