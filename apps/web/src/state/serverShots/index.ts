// serverShots → shots guardados en PostgreSQL
// shots       → shots locales de Dexie

import { createEffect, createEvent, createStore } from 'effector';
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

const realtimeShotCreated = createEvent<ApiShot>();
const realtimeShotUpdated = createEvent<ApiShot>();
const realtimeShotDeleted = createEvent<string>();
const realtimeLikeUpdated = createEvent<{
  shotId: string;
  likesCount: number;
  userId: string;
}>();

const $serverShots = createStore<ApiShot[]>([])
  .on(loadServerShotsFx, () => [])
  .on(loadServerShotsFx.doneData, (_, shots) => shots)
  .on(createServerShotFx.doneData, (shots, shot) => [shot, ...shots])
  .on(deleteServerShotFx.doneData, (shots, serverId) =>
    shots.filter((shot) => shot.id !== serverId),
  )
  .on(updateServerShotFx.doneData, (shots, updatedShot) =>
    shots.map((shot) =>
      shot.id === updatedShot.id
        ? { ...shot, ...updatedShot, likedByMe: shot.likedByMe }
        : shot,
    ),
  )
  .on(uploadServerShotImageFx.doneData, (shots, updatedShot) =>
    shots.map((shot) =>
      shot.id === updatedShot.id
        ? { ...shot, ...updatedShot, likedByMe: shot.likedByMe }
        : shot,
    ),
  )
  .on(toggleLikeFx.doneData, (shots, { serverId, result }) =>
    shots.map((shot) =>
      shot.id === serverId
        ? { ...shot, likesCount: result.likesCount, likedByMe: result.liked }
        : shot,
    ),
  )
  .on(realtimeShotCreated, (shots, shot) =>
    shots.some((current) => current.id === shot.id) ? shots : [shot, ...shots],
  )
  .on(realtimeShotUpdated, (shots, updatedShot) =>
    shots.map((shot) =>
      shot.id === updatedShot.id
        ? { ...shot, ...updatedShot, likedByMe: shot.likedByMe }
        : shot,
    ),
  )
  .on(realtimeShotDeleted, (shots, shotId) =>
    shots.filter((shot) => shot.id !== shotId),
  )
  .on(realtimeLikeUpdated, (shots, { shotId, likesCount }) =>
    shots.map((shot) =>
      shot.id === shotId ? { ...shot, likesCount } : shot,
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
    aromaScore: apiShot.aromaScore ?? undefined,
    acidityScore: apiShot.acidityScore ?? undefined,
    bodyScore: apiShot.bodyScore ?? undefined,
    sweetnessScore: apiShot.sweetnessScore ?? undefined,
    finishScore: apiShot.finishScore ?? undefined,
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

export const serverShotsRealtimeEvents = {
  realtimeShotCreated,
  realtimeShotUpdated,
  realtimeShotDeleted,
  realtimeLikeUpdated,
};
