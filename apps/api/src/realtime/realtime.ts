import type { IncomingMessage, Server as HttpServer } from 'node:http';
import WebSocket, { WebSocketServer } from 'ws';
import { verifyAccessToken } from '../security/jwt.js';

type RealtimeClient = {
  socket: WebSocket;
  userId: string;
  isAlive: boolean;
};

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

const clients = new Set<RealtimeClient>();

function getCookie(request: IncomingMessage, name: string): string | undefined {
  const cookies = request.headers.cookie?.split(';') ?? [];
  const cookie = cookies.find((value) => value.trim().startsWith(`${name}=`));

  if (!cookie) return undefined;

  return decodeURIComponent(cookie.trim().slice(name.length + 1));
}

async function authenticate(request: IncomingMessage): Promise<string | null> {
  const token = getCookie(request, 'access_token');
  if (!token) return null;

  try {
    return await verifyAccessToken(token);
  } catch {
    return null;
  }
}

export function createRealtimeServer(httpServer: HttpServer) {
  const websocketServer = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    if (request.url !== '/ws') {
      socket.destroy();
      return;
    }

    void authenticate(request).then((userId) => {
      if (!userId) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      websocketServer.handleUpgrade(request, socket, head, (clientSocket) => {
        websocketServer.emit('connection', clientSocket, request, userId);
      });
    });
  });

  websocketServer.on(
    'connection',
    (socket: WebSocket, _request: IncomingMessage, userId: string) => {
      const client: RealtimeClient = { socket, userId, isAlive: true };
      clients.add(client);

      socket.on('pong', () => {
        client.isAlive = true;
      });

      socket.on('close', () => {
        clients.delete(client);
      });

      socket.on('error', () => {
        clients.delete(client);
      });
    },
  );

  const heartbeat = setInterval(() => {
    for (const client of clients) {
      if (!client.isAlive) {
        client.socket.terminate();
        clients.delete(client);
        continue;
      }

      client.isAlive = false;
      client.socket.ping();
    }
  }, 30_000);

  websocketServer.on('close', () => clearInterval(heartbeat));

  return websocketServer;
}

export function broadcastLikeUpdated(
  event: Omit<LikeUpdatedEvent, 'type'>,
): void {
  const message = JSON.stringify({ type: 'shot.like.updated', ...event });

  for (const client of clients) {
    if (client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(message);
    }
  }
}

export function broadcastShotDeleted(
  event: Omit<ShotDeletedEvent, 'type'>,
): void {
  const message = JSON.stringify({ type: 'shot.deleted', ...event });

  for (const client of clients) {
    if (client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(message);
    }
  }
}
