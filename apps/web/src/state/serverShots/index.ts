// serverShots → shots guardados en PostgreSQL
// shots       → shots locales de Dexie

import { createEffect, createStore } from 'effector';
import {
  createApiShot,
  getMyShots,
  type ApiShot,
} from '../../api/shots/client';

const loadServerShotsFx = createEffect(getMyShots);
const createServerShotFx = createEffect(createApiShot);

const $serverShots = createStore<ApiShot[]>([])
  .on(loadServerShotsFx.doneData, (_, shots) => shots)
  .on(createServerShotFx.doneData, (shots, shot) => [shot, ...shots]);

const $serverShotsLoading = loadServerShotsFx.pending;

export const serverShotsStores = {
  $serverShots,
  $serverShotsLoading,
};

export const serverShotsEffects = {
  loadServerShotsFx,
  createServerShotFx,
};
