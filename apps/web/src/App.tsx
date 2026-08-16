import { useEffect, useRef } from 'react';
import { useUnit } from 'effector-react';
import { RouterProvider } from 'react-router-dom';
import { shotsEffects } from './state/shots';
import { router } from './routes';
import { authEffects, authStores } from './state/auth';
import { serverShotsEffects } from './state/serverShots';
import {
  serverShotsRealtimeEvents,
} from './state/serverShots';
import { connectRealtime } from './realtime/socket';
import { messagesEvents } from './state/messages';
import { messagesStores } from './state/messages';
import { markConversationRead } from './api/messages/client';

export function App() {
  const currentUser = useUnit(authStores.$currentUser);
  const activeConversationId = useUnit(
    messagesStores.$activeConversationId,
  );
  const activeConversationRef = useRef<string | null>(null);

  useEffect(() => {
    activeConversationRef.current = activeConversationId;
  }, [activeConversationId]);

  useEffect(() => {
    void shotsEffects.loadShotsFx();
  }, []);

  useEffect(() => {
    void authEffects.loadSessionFx();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    void serverShotsEffects.loadServerShotsFx();

    return connectRealtime({
      onShotCreated: serverShotsRealtimeEvents.realtimeShotCreated,
      onShotUpdated: serverShotsRealtimeEvents.realtimeShotUpdated,
      onShotDeleted: serverShotsRealtimeEvents.realtimeShotDeleted,
      onLikeUpdated: serverShotsRealtimeEvents.realtimeLikeUpdated,
      onMessageCreated: (message) => {
        messagesEvents.realtimeMessageReceived({
          message,
          currentUserId: currentUser.id,
          activeConversationId: activeConversationRef.current,
        });
        if (
          activeConversationRef.current === message.conversationId &&
          message.senderId !== currentUser.id
        ) {
          void markConversationRead(message.conversationId);
        }
      },
      onConversationHidden: messagesEvents.realtimeConversationHidden,
    });
  }, [currentUser?.id]);

  return <RouterProvider router={router} />;
}
