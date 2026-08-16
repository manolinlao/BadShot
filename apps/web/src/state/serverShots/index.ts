// serverShots → shots guardados en PostgreSQL
// shots       → shots locales de Dexie

import { createEffect, createStore } from 'effector';
import {
  createApiShot,
  deleteApiShot,
  getMyShots,
  uploadApiShotImage,
  updateApiShot,
  toggleLikeApiShot,
  type ApiShot,
  type UpdateApiShotInput,
} from '../../api/shots/client';
import { getApiAssetUrl } from '../../api/shots/client';
import type { Shot } from '../../domain/shot/types';

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
const uploadServerShotImageFx = createEffect(
  async (input: { serverId: string; file: File }) =>
    uploadApiShotImage(input.serverId, input.file),
);
const toggleLikeFx = createEffect(async (serverId: string) => ({
  serverId,
  result: await toggleLikeApiShot(serverId),
}));

const $serverShots = createStore<ApiShot[]>([])
  .on(loadServerShotsFx, () => [])
  .on(loadServerShotsFx.doneData, (_, shots) => shots)
  .on(createServerShotFx.doneData, (shots, shot) => [shot, ...shots])
  .on(deleteServerShotFx.doneData, (shots, serverId) =>
    shots.filter((shot) => shot.id !== serverId),
  )
  .on(updateServerShotFx.doneData, (shots, updatedShot) =>
    shots.map((shot) => (shot.id === updatedShot.id ? updatedShot : shot)),
  )
  .on(uploadServerShotImageFx.doneData, (shots, updatedShot) =>
    shots.map((shot) => (shot.id === updatedShot.id ? updatedShot : shot)),
  )
  .on(toggleLikeFx.doneData, (shots, { serverId, result }) =>
    shots.map((shot) =>
      shot.id === serverId
        ? { ...shot, likesCount: result.likesCount, likedByMe: result.liked }
        : shot,
    ),
  );

const $serverShotsLoading = loadServerShotsFx.pending;

export function mapApiShotToShot(apiShot: ApiShot): Shot {
  return {
    id: apiShot.id,
    serverId: apiShot.id,
    userId: apiShot.userId,
    user: {
      displayName: apiShot.user.displayName,
      username: apiShot.user.email.split('@')[0],
    },
    coffee: apiShot.coffee ?? {},
    flavors: apiShot.flavors ?? undefined,
    recipe: apiShot.recipe ?? undefined,
    location: apiShot.location ?? undefined,
    tastingNotes: apiShot.tastingNotes ?? undefined,
    rating: apiShot.rating ?? undefined,
    likesCount: apiShot.likesCount,
    likedByMe: apiShot.likedByMe,
    createdAt: apiShot.createdAt,
    photoUrl: apiShot.photoUrl
      ? getApiAssetUrl(apiShot.photoUrl)
      : undefined,
  };
}

export const serverShotsStores = {
  $serverShots,
  $serverShotsLoading,
};

export const serverShotsEffects = {
  loadServerShotsFx,
  createServerShotFx,
  deleteServerShotFx,
  updateServerShotFx,
  uploadServerShotImageFx,
  toggleLikeFx,
};
