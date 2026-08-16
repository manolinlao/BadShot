import { Prisma } from '../../generated/prisma/client.js';
import { prisma } from '../../db/prisma.js';

type JsonObject = Record<string, unknown>;

export type CreateShotInput = {
  coffee?: JsonObject;
  flavors?: string[];
  recipe?: JsonObject;
  location?: JsonObject;
  tastingNotes?: string;
  aromaScore?: number;
  acidityScore?: number;
  bodyScore?: number;
  sweetnessScore?: number;
  finishScore?: number;
  rating?: number;
  likesCount?: number;
};

const publicUserSelect = {
  id: true,
  email: true,
  displayName: true,
} as const;

export async function getShotsByUserId(userId: string) {
  return prisma.shot.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: publicUserSelect,
      },
    },
  });
}

export async function getAllShots(userId: string) {
  const shots = await prisma.shot.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: {
        select: publicUserSelect,
      },
      likes: {
        where: { userId },
        select: { id: true },
      },
      _count: {
        select: { likes: true },
      },
    },
  });

  return shots.map(({ likes, _count, ...shot }) => ({
    ...shot,
    likesCount: _count.likes,
    likedByMe: likes.length > 0,
  }));
}

export async function toggleLikeForUser(userId: string, shotId: string) {
  const shot = await prisma.shot.findUnique({
    where: { id: shotId },
    select: { id: true },
  });

  if (!shot) return null;

  const existingLike = await prisma.like.findUnique({
    where: {
      userId_shotId: { userId, shotId },
    },
    select: { id: true },
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.like.create({ data: { userId, shotId } });
  }

  const likesCount = await prisma.like.count({ where: { shotId } });

  return {
    liked: !existingLike,
    likesCount,
  };
}

export async function createShotForUser(
  userId: string,
  input: CreateShotInput,
) {
  return prisma.shot.create({
    data: {
      userId,
      ...(input.coffee
        ? { coffee: input.coffee as Prisma.InputJsonValue }
        : {}),
      ...(input.flavors
        ? { flavors: input.flavors as Prisma.InputJsonValue }
        : {}),
      ...(input.recipe
        ? { recipe: input.recipe as Prisma.InputJsonValue }
        : {}),
      ...(input.location
        ? { location: input.location as Prisma.InputJsonValue }
        : {}),
      tastingNotes: input.tastingNotes?.trim() || null,
      aromaScore: input.aromaScore ?? null,
      acidityScore: input.acidityScore ?? null,
      bodyScore: input.bodyScore ?? null,
      sweetnessScore: input.sweetnessScore ?? null,
      finishScore: input.finishScore ?? null,
      rating: input.rating ?? null,
      likesCount: input.likesCount ?? 0,
    },
    include: {
      user: {
        select: publicUserSelect,
      },
    },
  });
}

export type UpdateShotInput = {
  coffee?: JsonObject;
  flavors?: string[];
  recipe?: JsonObject;
  location?: JsonObject;
  tastingNotes?: string;
  aromaScore?: number;
  acidityScore?: number;
  bodyScore?: number;
  sweetnessScore?: number;
  finishScore?: number;
  rating?: number;
};

export async function updateShotForUser(
  userId: string,
  shotId: string,
  input: UpdateShotInput,
) {
  const result = await prisma.shot.updateMany({
    where: {
      id: shotId,
      userId,
    },
    data: {
      ...(input.coffee
        ? { coffee: input.coffee as Prisma.InputJsonValue }
        : {}),
      ...(input.flavors
        ? { flavors: input.flavors as Prisma.InputJsonValue }
        : {}),
      ...(input.recipe
        ? { recipe: input.recipe as Prisma.InputJsonValue }
        : {}),
      ...(input.location
        ? { location: input.location as Prisma.InputJsonValue }
        : {}),
      ...(input.tastingNotes !== undefined
        ? { tastingNotes: input.tastingNotes.trim() || null }
        : {}),
      ...(input.aromaScore !== undefined ? { aromaScore: input.aromaScore } : {}),
      ...(input.acidityScore !== undefined
        ? { acidityScore: input.acidityScore }
        : {}),
      ...(input.bodyScore !== undefined ? { bodyScore: input.bodyScore } : {}),
      ...(input.sweetnessScore !== undefined
        ? { sweetnessScore: input.sweetnessScore }
        : {}),
      ...(input.finishScore !== undefined
        ? { finishScore: input.finishScore }
        : {}),
      ...(input.rating !== undefined ? { rating: input.rating } : {}),
    },
  });

  if (result.count === 0) {
    return null;
  }

  return prisma.shot.findUnique({
    where: {
      id: shotId,
    },
    include: {
      user: {
        select: publicUserSelect,
      },
    },
  });
}

export async function updateShotPhotoForUser(
  userId: string,
  shotId: string,
  photoUrl: string,
) {
  const result = await prisma.shot.updateMany({
    where: {
      id: shotId,
      userId,
    },
    data: {
      photoUrl,
    },
  });

  if (result.count === 0) {
    return null;
  }

  return prisma.shot.findUnique({
    where: {
      id: shotId,
    },
    include: {
      user: {
        select: publicUserSelect,
      },
    },
  });
}

export async function deleteShotForUser(
  userId: string,
  shotId: string,
): Promise<{ deleted: boolean; photoUrl: string | null }> {
  const shot = await prisma.shot.findFirst({
    where: {
      id: shotId,
      userId,
    },
    select: {
      photoUrl: true,
    },
  });

  if (!shot) {
    return {
      deleted: false,
      photoUrl: null,
    };
  }

  await prisma.shot.delete({
    where: {
      id: shotId,
    },
  });

  return {
    deleted: true,
    photoUrl: shot.photoUrl,
  };
}
