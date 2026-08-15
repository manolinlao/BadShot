import { prisma } from '../../db/prisma.js';

export type CreateShotInput = {
  tastingNotes?: string;
  rating?: number;
};

export async function getShotsByUserId(userId: string) {
  return prisma.shot.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function createShotForUser(
  userId: string,
  input: CreateShotInput,
) {
  return prisma.shot.create({
    data: {
      userId,
      tastingNotes: input.tastingNotes?.trim() || null,
      rating: input.rating ?? null,
    },
  });
}

export type UpdateShotInput = {
  tastingNotes?: string;
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
      tastingNotes: input.tastingNotes?.trim() || null,
      rating: input.rating ?? null,
    },
  });

  if (result.count === 0) {
    return null;
  }

  return prisma.shot.findUnique({
    where: {
      id: shotId,
    },
  });
}

export async function deleteShotForUser(
  userId: string,
  shotId: string,
): Promise<boolean> {
  const result = await prisma.shot.deleteMany({
    where: {
      id: shotId,
      userId,
    },
  });

  return result.count > 0;
}
