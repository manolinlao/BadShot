import { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware.js';
import {
  getConversationMessages,
  getOrCreateConversation,
  getUserConversations,
  markConversationRead,
  hideConversationForUser,
  sendMessageForUser,
} from './messages.service.js';
import {
  emitConversationHidden,
  emitMessageCreated,
} from '../../realtime/realtime.js';

const router = Router();

router.get('/conversations', requireAuth, async (_request, response, next) => {
  try {
    const conversations = await getUserConversations(
      response.locals.userId as string,
    );
    response.json({ success: true, data: conversations });
  } catch (error) {
    next(error);
  }
});

router.post('/conversations', requireAuth, async (request, response, next) => {
  try {
    const body = request.body as { otherUserId?: unknown };
    if (typeof body.otherUserId !== 'string') {
      response.status(400).json({
        success: false,
        error: { message: 'otherUserId es obligatorio' },
      });
      return;
    }

    const conversation = await getOrCreateConversation(
      response.locals.userId as string,
      body.otherUserId,
    );

    if (!conversation) {
      response.status(400).json({
        success: false,
        error: { message: 'El usuario no existe o no puedes escribirte a ti mismo' },
      });
      return;
    }

    response.status(201).json({ success: true, data: conversation });
  } catch (error) {
    next(error);
  }
});

router.get(
  '/conversations/:conversationId/messages',
  requireAuth,
  async (request, response, next) => {
    try {
      const { conversationId } = request.params;
      if (typeof conversationId !== 'string') {
        response.status(400).json({
          success: false,
          error: { message: 'Identificador de conversación inválido' },
        });
        return;
      }

      const conversation = await getConversationMessages(
        response.locals.userId as string,
        conversationId,
      );
      if (!conversation) {
        response.status(404).json({
          success: false,
          error: { message: 'Conversación no encontrada' },
        });
        return;
      }

      response.json({ success: true, data: conversation });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/conversations/:conversationId/delete',
  requireAuth,
  async (request, response, next) => {
    try {
      const { conversationId } = request.params;
      if (typeof conversationId !== 'string') {
        response.status(400).json({
          success: false,
          error: { message: 'Identificador de conversación inválido' },
        });
        return;
      }

      const result = await hideConversationForUser(
        response.locals.userId as string,
        conversationId,
      );
      if (!result) {
        response.status(404).json({
          success: false,
          error: { message: 'Conversación no encontrada' },
        });
        return;
      }

      response.json({ success: true, data: null });
      emitConversationHidden(result.conversationId, result.userId);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/conversations/:conversationId/read',
  requireAuth,
  async (request, response, next) => {
    try {
      const { conversationId } = request.params;
      if (typeof conversationId !== 'string') {
        response.status(400).json({
          success: false,
          error: { message: 'Identificador de conversación inválido' },
        });
        return;
      }

      await markConversationRead(
        response.locals.userId as string,
        conversationId,
      );
      response.json({ success: true, data: null });
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  '/conversations/:conversationId/messages',
  requireAuth,
  async (request, response, next) => {
    try {
      const { conversationId } = request.params;
      const body = request.body as { body?: unknown };

      if (
        typeof conversationId !== 'string' ||
        typeof body.body !== 'string' ||
        body.body.trim().length === 0 ||
        body.body.trim().length > 2000
      ) {
        response.status(400).json({
          success: false,
          error: { message: 'El mensaje debe tener entre 1 y 2000 caracteres' },
        });
        return;
      }

      const result = await sendMessageForUser(
        response.locals.userId as string,
        conversationId,
        body.body,
      );
      if (!result) {
        response.status(404).json({
          success: false,
          error: { message: 'Conversación no encontrada' },
        });
        return;
      }

      response.status(201).json({ success: true, data: result.message });
      emitMessageCreated(result.message, result.participantIds);
    } catch (error) {
      next(error);
    }
  },
);

export { router as messagesRouter };
