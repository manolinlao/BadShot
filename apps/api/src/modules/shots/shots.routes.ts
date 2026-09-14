import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { Router } from 'express';
import {
  requireAuth,
  requireWritableUser,
} from '../auth/auth.middleware.js';
import {
  createShotForUser,
  deleteShotForUser,
  getAllShots,
  getShotsByUserId,
  toggleLikeForUser,
  updateShotPhotoForUser,
  updateShotForUser,
  type CreateShotInput,
  type UpdateShotInput,
} from './shots.service.js';
import {
  normalizeUploadedImage,
  shotImageUpload,
  uploadDir,
} from './upload.js';
import {
  broadcastLikeUpdated,
  broadcastShotDeleted,
} from '../../realtime/realtime.js';
const router = Router();

router.get('/', requireAuth, async (_request, response, next) => {
  try {
    const shots = await getAllShots(response.locals.userId as string);

    response.json({
      success: true,
      data: shots,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/user/:userId', requireAuth, async (request, response, next) => {
  try {
    const { userId } = request.params;
    if (typeof userId !== 'string') {
      response.status(400).json({
        success: false,
        error: { message: 'Identificador de usuario inválido' },
      });
      return;
    }

    const shots = await getShotsByUserId(
      userId,
      response.locals.userId as string,
    );

    response.json({
      success: true,
      data: shots,
    });
  } catch (error) {
    next(error);
  }
});

router.post(
  '/:shotId/like',
  requireAuth,
  requireWritableUser,
  async (request, response, next) => {
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

    const result = await toggleLikeForUser(
      response.locals.userId as string,
      shotId,
    );

    if (!result) {
      response.status(404).json({
        success: false,
        error: {
          message: 'Shot no encontrado',
          code: 'SHOT_NOT_FOUND',
        },
      });
      return;
    }

    broadcastLikeUpdated({
      shotId,
      actorUserId: response.locals.userId as string,
      liked: result.liked,
      likesCount: result.likesCount,
    });

    response.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
  },
);

router.post('/', requireAuth, requireWritableUser, async (request, response, next) => {
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

router.patch(
  '/:shotId',
  requireAuth,
  requireWritableUser,
  async (request, response, next) => {
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
  },
);

router.post(
  '/:shotId/image',
  requireAuth,
  requireWritableUser,
  shotImageUpload.single('image'),
  async (request, response, next) => {
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

      if (!request.file) {
        response.status(400).json({
          success: false,
          error: {
            message: 'La imagen es obligatoria',
            code: 'IMAGE_REQUIRED',
          },
        });
        return;
      }

      const filename = await normalizeUploadedImage(request.file);
      const userId = response.locals.userId as string;
      const shot = await updateShotPhotoForUser(
        userId,
        shotId,
        `/uploads/${filename}`,
      );

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
  },
);

router.delete(
  '/:shotId',
  requireAuth,
  requireWritableUser,
  async (request, response, next) => {
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

    const deletion = await deleteShotForUser(userId, shotId);

    if (!deletion.deleted) {
      response.status(404).json({
        success: false,
        error: {
          message: 'Shot no encontrado',
          code: 'SHOT_NOT_FOUND',
        },
      });
      return;
    }

    if (deletion.photoUrl) {
      const filename = path.basename(deletion.photoUrl);

      try {
        await unlink(path.join(uploadDir, filename));
      } catch (error) {
        console.error('No se pudo eliminar el archivo de imagen', error);
      }
    }

    broadcastShotDeleted({
      shotId,
      actorUserId: userId,
    });

    response.json({
      success: true,
      data: null,
    });
  } catch (error) {
    next(error);
  }
  },
);

export { router as shotsRouter };
