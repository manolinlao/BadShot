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
