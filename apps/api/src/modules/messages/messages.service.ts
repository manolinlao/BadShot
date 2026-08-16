import { prisma } from '../../db/prisma.js';

const publicUserSelect = {
  id: true,
  email: true,
  displayName: true,
} as const;

function orderUserIds(firstUserId: string, secondUserId: string) {
  return firstUserId < secondUserId
    ? { userOneId: firstUserId, userTwoId: secondUserId }
    : { userOneId: secondUserId, userTwoId: firstUserId };
}

export async function getOrCreateConversation(
  userId: string,
  otherUserId: string,
) {
  if (userId === otherUserId) return null;

  const otherUser = await prisma.user.findUnique({
    where: { id: otherUserId },
    select: { id: true },
  });
  if (!otherUser) return null;

  const pair = orderUserIds(userId, otherUserId);

  return prisma.conversation.upsert({
    where: {
      userOneId_userTwoId: pair,
    },
    create: pair,
    update: {},
    include: {
      userOne: { select: publicUserSelect },
      userTwo: { select: publicUserSelect },
    },
  });
}

export async function getUserConversations(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ userOneId: userId }, { userTwoId: userId }],
      hiddenFor: { none: { userId } },
    },
    orderBy: { updatedAt: 'desc' },
    include: {
      userOne: { select: publicUserSelect },
      userTwo: { select: publicUserSelect },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          id: true,
          body: true,
          senderId: true,
          createdAt: true,
          readAt: true,
        },
      },
    },
  });

  return Promise.all(
    conversations.map(async (conversation) => ({
      ...conversation,
      unreadCount: await prisma.message.count({
        where: {
          conversationId: conversation.id,
          senderId: { not: userId },
          readAt: null,
        },
      }),
    })),
  );
}

export function getConversationMessages(
  userId: string,
  conversationId: string,
) {
  return prisma.$transaction(async (transaction) => {
    const conversation = await transaction.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ userOneId: userId }, { userTwoId: userId }],
    },
    include: {
      userOne: { select: publicUserSelect },
      userTwo: { select: publicUserSelect },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: publicUserSelect } },
      },
    },
    });

    if (!conversation) return null;

    await transaction.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return conversation;
  });
}

export async function sendMessageForUser(
  userId: string,
  conversationId: string,
  body: string,
) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ userOneId: userId }, { userTwoId: userId }],
    },
    select: { userOneId: true, userTwoId: true },
  });

  if (!conversation) return null;

  const message = await prisma.$transaction(async (transaction) => {
    await transaction.conversationHidden.deleteMany({
      where: { conversationId, userId },
    });

    const createdMessage = await transaction.message.create({
      data: {
        conversationId,
        senderId: userId,
        body: body.trim(),
      },
      include: { sender: { select: publicUserSelect } },
    });

    await transaction.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return createdMessage;
  });

  return {
    message,
    participantIds: [conversation.userOneId, conversation.userTwoId],
  };
}

export function markConversationRead(userId: string, conversationId: string) {
  return prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      readAt: null,
      conversation: {
        OR: [{ userOneId: userId }, { userTwoId: userId }],
      },
    },
    data: { readAt: new Date() },
  });
}

export async function hideConversationForUser(
  userId: string,
  conversationId: string,
) {
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      OR: [{ userOneId: userId }, { userTwoId: userId }],
    },
    select: { userOneId: true, userTwoId: true },
  });

  if (!conversation) return null;

  await prisma.conversationHidden.upsert({
    where: {
      conversationId_userId: { conversationId, userId },
    },
    create: { conversationId, userId },
    update: { hiddenAt: new Date() },
  });

  return {
    conversationId,
    userId,
  };
}
