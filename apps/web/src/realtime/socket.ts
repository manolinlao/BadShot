import { io } from 'socket.io-client';
import type { ApiShot } from '../api/shots/client';
import type { ApiMessage } from '../api/messages/client';

const API_URL = 'http://localhost:3000';

type RealtimeLike = {
  shotId: string;
  likesCount: number;
  userId: string;
};

type RealtimeHandlers = {
  onShotCreated: (shot: ApiShot) => void;
  onShotUpdated: (shot: ApiShot) => void;
  onShotDeleted: (shotId: string) => void;
  onLikeUpdated: (like: RealtimeLike) => void;
  onMessageCreated: (message: ApiMessage) => void;
  onConversationHidden: (conversationId: string) => void;
};

export function connectRealtime(handlers: RealtimeHandlers) {
  const socket = io(API_URL, {
    withCredentials: true,
  });

  socket.on('shot.created', handlers.onShotCreated);
  socket.on('shot.updated', handlers.onShotUpdated);
  socket.on('shot.deleted', ({ shotId }: { shotId: string }) =>
    handlers.onShotDeleted(shotId),
  );
  socket.on('like.updated', handlers.onLikeUpdated);
  socket.on('message.created', handlers.onMessageCreated);
  socket.on(
    'conversation.hidden',
    ({ conversationId }: { conversationId: string }) =>
      handlers.onConversationHidden(conversationId),
  );

  socket.on('connect_error', (error) => {
    console.warn('Realtime connection failed:', error.message);
  });

  return () => {
    socket.disconnect();
  };
}
