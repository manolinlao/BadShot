import type { Server as HttpServer } from 'node:http';
import { Server } from 'socket.io';
import { verifyAccessToken } from '../security/jwt.js';

type RealtimeShot = Record<string, unknown>;

let realtimeServer: Server | undefined;

function getCookieValue(cookieHeader: string | undefined, name: string) {
  const value = cookieHeader
    ?.split(';')
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  return value ? decodeURIComponent(value.slice(name.length + 1)) : undefined;
}

export function attachRealtime(httpServer: HttpServer) {
  realtimeServer = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  realtimeServer.use(async (socket, next) => {
    const token = getCookieValue(
      socket.handshake.headers.cookie,
      'access_token',
    );

    if (!token) {
      next(new Error('Falta el token de autenticación'));
      return;
    }

    try {
      socket.data.userId = await verifyAccessToken(token);
      next();
    } catch {
      next(new Error('Token inválido o caducado'));
    }
  });

  realtimeServer.on('connection', (socket) => {
    socket.join(`user:${socket.data.userId}`);
    console.log(`Realtime client connected: ${socket.data.userId}`);
  });
}

export function emitShotCreated(shot: RealtimeShot) {
  realtimeServer?.emit('shot.created', shot);
}

export function emitShotUpdated(shot: RealtimeShot) {
  realtimeServer?.emit('shot.updated', shot);
}

export function emitShotDeleted(shotId: string) {
  realtimeServer?.emit('shot.deleted', { shotId });
}

export function emitLikeUpdated(
  shotId: string,
  likesCount: number,
  userId: string,
) {
  realtimeServer?.emit('like.updated', { shotId, likesCount, userId });
}

export function emitMessageCreated(
  message: Record<string, unknown>,
  participantIds: string[],
) {
  for (const userId of participantIds) {
    realtimeServer?.to(`user:${userId}`).emit('message.created', message);
  }
}

export function emitConversationHidden(
  conversationId: string,
  userId: string,
) {
  realtimeServer?.to(`user:${userId}`).emit('conversation.hidden', {
    conversationId,
  });
}
