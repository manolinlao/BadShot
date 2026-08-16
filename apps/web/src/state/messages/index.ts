import { createEffect, createEvent, createStore, sample } from 'effector';
import {
  createConversation,
  deleteConversation,
  getConversations,
  getMessages,
  sendMessage,
  type ApiConversation,
  type ApiMessage,
} from '../../api/messages/client';

const loadConversationsFx = createEffect(getConversations);
const openConversationFx = createEffect(getMessages);
const startConversationFx = createEffect(createConversation);
const sendMessageFx = createEffect(
  async (input: { conversationId: string; body: string }) =>
    sendMessage(input.conversationId, input.body),
);
const deleteConversationFx = createEffect(async (conversationId: string) => {
  await deleteConversation(conversationId);
  return conversationId;
});

const conversationSelected = createEvent<string>();
const realtimeMessageReceived = createEvent<{
  message: ApiMessage;
  currentUserId: string;
  activeConversationId: string | null;
}>();
const realtimeMessageForActiveConversation = createEvent<ApiMessage>();
const realtimeConversationHidden = createEvent<string>();
const conversationCleared = createEvent();

function updateConversationPreview(
  conversations: ApiConversation[],
  message: ApiMessage,
  currentUserId?: string,
  activeConversationId?: string | null,
) {
  const updated = conversations.map((conversation) =>
    conversation.id === message.conversationId
      ? {
          ...conversation,
          updatedAt: message.createdAt,
          messages: [message],
          unreadCount:
            currentUserId &&
            message.senderId !== currentUserId &&
            activeConversationId !== message.conversationId
              ? (conversation.unreadCount ?? 0) + 1
              : 0,
        }
      : conversation,
  );

  const conversation = updated.find(
    (item) => item.id === message.conversationId,
  );
  if (!conversation) return updated;

  return [
    conversation,
    ...updated.filter((item) => item.id !== message.conversationId),
  ];
}

const $conversations = createStore<ApiConversation[]>([])
  .on(loadConversationsFx.doneData, (_, conversations) => conversations)
  .on(startConversationFx.doneData, (conversations, conversation) => {
    const exists = conversations.some((item) => item.id === conversation.id);
    return exists
      ? conversations.map((item) =>
          item.id === conversation.id ? conversation : item,
        )
      : [conversation, ...conversations];
  })
  .on(sendMessageFx.doneData, (conversations, message) =>
    updateConversationPreview(conversations, message),
  )
  .on(
    realtimeMessageReceived,
    (conversations, { message, currentUserId, activeConversationId }) =>
      updateConversationPreview(
        conversations,
        message,
        currentUserId,
        activeConversationId,
      ),
  )
  .on(conversationSelected, (conversations, conversationId) =>
    conversations.map((conversation) =>
      conversation.id === conversationId
        ? { ...conversation, unreadCount: 0 }
        : conversation,
    ),
  )
  .on(deleteConversationFx.doneData, (conversations, conversationId) =>
    conversations.filter((conversation) => conversation.id !== conversationId),
  )
  .on(realtimeConversationHidden, (conversations, conversationId) =>
    conversations.filter((conversation) => conversation.id !== conversationId),
  );

const $activeConversationId = createStore<string | null>(null).on(
  conversationSelected,
  (_, conversationId) => conversationId,
).reset(conversationCleared);

const $messages = createStore<ApiMessage[]>([])
  .on(openConversationFx.doneData, (_, conversation) => conversation.messages)
  .on(sendMessageFx.doneData, (messages, message) =>
    messages.some((item) => item.id === message.id)
      ? messages
      : [...messages, message],
  )
  .on(realtimeMessageForActiveConversation, (messages, message) =>
    messages.some((item) => item.id === message.id)
      ? messages
      : [...messages, message],
  )
  .reset(conversationCleared);

sample({
  source: $activeConversationId,
  clock: realtimeMessageReceived,
  filter: (conversationId, { message }) =>
    conversationId === message.conversationId,
  fn: (_conversationId, { message }) => message,
  target: realtimeMessageForActiveConversation,
});

export const messagesStores = {
  $conversations,
  $activeConversationId,
  $messages,
};

export const messagesEffects = {
  loadConversationsFx,
  openConversationFx,
  startConversationFx,
  sendMessageFx,
  deleteConversationFx,
};

export const messagesEvents = {
  conversationSelected,
  realtimeMessageReceived,
  realtimeConversationHidden,
  conversationCleared,
};
