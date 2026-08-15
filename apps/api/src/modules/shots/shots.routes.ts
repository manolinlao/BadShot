import { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware.js';
import {
  createShotForUser,
  deleteShotForUser,
  getShotsByUserId,
  updateShotForUser,
  type CreateShotInput,
  type UpdateShotInput,
} from './shots.service.js';

const router = Router();

router.get('/', requireAuth, async (_request, response, next) => {
  try {
    const userId = response.locals.userId as string;
    const shots = await getShotsByUserId(userId);

    response.json({
      success: true,
      data: shots,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (request, response, next) => {
  try {
    const body = (request.body ?? {}) as CreateShotInput;

    if (
      body.rating !== undefined &&
      (!Number.isInteger(body.rating) || body.rating < 0 || body.rating > 5)
    ) {
      response.status(400).json({
        success: false,
        error: {
          message: 'La valoración debe ser un número entero entre 0 y 5',
          code: 'INVALID_RATING',
        },
      });
      return;
    }

    const userId = response.locals.userId as string;
    const shot = await createShotForUser(userId, body);

    response.status(201).json({
      success: true,
      data: shot,
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:shotId', requireAuth, async (request, response, next) => {
  try {
    const { shotId } = request.params;

    if (typeof shotId !== 'string') {
      response.status(400).json({
        success: false,
        error: {
          message: 'Identificador de shot inválido',
          code: 'INVALID_SHOT_ID',
        },
      });
      return;
    }

    const body = (request.body ?? {}) as UpdateShotInput;

    if (
      body.rating !== undefined &&
      (!Number.isInteger(body.rating) || body.rating < 0 || body.rating > 5)
    ) {
      response.status(400).json({
        success: false,
        error: {
          message: 'La valoración debe ser un número entero entre 0 y 5',
          code: 'INVALID_RATING',
        },
      });
      return;
    }

    const userId = response.locals.userId as string;
    const shot = await updateShotForUser(userId, shotId, body);

    if (!shot) {
      response.status(404).json({
        success: false,
        error: {
          message: 'Shot no encontrado',
          code: 'SHOT_NOT_FOUND',
        },
      });
      return;
    }

    response.json({
      success: true,
      data: shot,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:shotId', requireAuth, async (request, response, next) => {
  try {
    const userId = response.locals.userId as string;
    const { shotId } = request.params;

    if (typeof shotId !== 'string') {
      response.status(400).json({
        success: false,
        error: {
          message: 'Identificador de shot inválido',
          code: 'INVALID_SHOT_ID',
        },
      });
      return;
    }

    const deleted = await deleteShotForUser(userId, shotId);

    if (!deleted) {
      response.status(404).json({
        success: false,
        error: {
          message: 'Shot no encontrado',
          code: 'SHOT_NOT_FOUND',
        },
      });
      return;
    }

    response.json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

export { router as shotsRouter };
