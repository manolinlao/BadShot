import { appConfig } from '../config/env';

export type LikeUpdatedEvent = {
  type: 'shot.like.updated';
  shotId: string;
  actorUserId: string;
  liked: boolean;
  likesCount: number;
};

export type ShotDeletedEvent = {
  type: 'shot.deleted';
  shotId: string;
  actorUserId: string;
};

export type RealtimeEvent = LikeUpdatedEvent | ShotDeletedEvent;

const WS_URL = appConfig.websocketUrl;

export function connectRealtime(
  onEvent: (event: RealtimeEvent) => void,
  onReconnect?: () => void,
): () => void {
  let socket: WebSocket | null = null;
  let reconnectTimer: number | undefined;
  let reconnectDelay = 500;
  let closed = false;
  let hasConnected = false;

  const connect = () => {
    if (closed) return;

    socket = new WebSocket(WS_URL);

    socket.addEventListener('open', () => {
      if (hasConnected) {
        onReconnect?.();
      }

      hasConnected = true;
      reconnectDelay = 500;
    });

    socket.addEventListener('message', (message) => {
      try {
        const event = JSON.parse(message.data) as RealtimeEvent;
        if (event.type === 'shot.like.updated' || event.type === 'shot.deleted') {
          onEvent(event);
        }
      } catch {
        // Ignore malformed messages from the realtime transport.
      }
    });

    socket.addEventListener('close', () => {
      socket = null;
      if (closed) return;

      reconnectTimer = window.setTimeout(connect, reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 2, 10_000);
    });

    socket.addEventListener('error', () => {
      socket?.close();
    });
  };

  connect();

  return () => {
    closed = true;
    if (reconnectTimer !== undefined) {
      window.clearTimeout(reconnectTimer);
    }
    socket?.close();
    socket = null;
  };
}
