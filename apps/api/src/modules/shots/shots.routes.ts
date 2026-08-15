import { Router } from 'express';
import { requireAuth } from '../auth/auth.middleware.js';
import {
  createShotForUser,
  getShotsByUserId,
  type CreateShotInput,
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

export { router as shotsRouter };
