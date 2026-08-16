import { Router } from 'express';
import {
  getUserById,
  changeUserPassword,
  loginUser,
  registerUser,
  updateUserDisplayName,
} from './auth.service.js';
import { requireAuth } from './auth.middleware.js';
import { env } from 'node:process';

export const authRouter = Router();

authRouter.post('/register', async (request, response, next) => {
  try {
    const body = request.body as {
      email?: unknown;
      password?: unknown;
      displayName?: unknown;
    };

    if (
      typeof body.email !== 'string' ||
      typeof body.password !== 'string' ||
      typeof body.displayName !== 'string' ||
      body.email.trim().length === 0 ||
      body.password.length < 8 ||
      body.displayName.trim().length === 0
    ) {
      response.status(400).json({
        success: false,
        error: {
          message:
            'email, password y displayName son obligatorios; la contraseña debe tener al menos 8 caracteres',
        },
      });
      return;
    }

    const user = await registerUser(request.body);

    response.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (request, response, next) => {
  try {
    const body = request.body as {
      email?: unknown;
      password?: unknown;
    };

    if (
      typeof body.email !== 'string' ||
      typeof body.password !== 'string' ||
      body.email.trim().length === 0 ||
      body.password.length === 0
    ) {
      response.status(400).json({
        success: false,
        error: {
          message: 'email y password son obligatorios',
        },
      });
      return;
    }

    const user = await loginUser({
      email: body.email,
      password: body.password,
    });

    if (!user) {
      response.status(401).json({
        success: false,
        error: {
          message: 'Email o contraseña incorrectos',
        },
      });
      return;
    }

    response.cookie('access_token', user.accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    response.json({
      success: true,
      data: user.user,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.get('/me', requireAuth, async (_request, response, next) => {
  try {
    const userId = response.locals.userId as string;
    const user = await getUserById(userId);

    if (!user) {
      response.status(401).json({
        success: false,
        error: {
          message: 'Usuario no encontrado',
        },
      });
      return;
    }

    response.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.patch('/me', requireAuth, async (request, response, next) => {
  try {
    const body = request.body as { displayName?: unknown };

    if (
      typeof body.displayName !== 'string' ||
      body.displayName.trim().length === 0 ||
      body.displayName.trim().length > 60
    ) {
      response.status(400).json({
        success: false,
        error: {
          message: 'El nombre debe tener entre 1 y 60 caracteres',
        },
      });
      return;
    }

    const user = await updateUserDisplayName(
      response.locals.userId as string,
      body.displayName,
    );

    response.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

authRouter.patch('/me/password', requireAuth, async (request, response, next) => {
  try {
    const body = request.body as {
      currentPassword?: unknown;
      newPassword?: unknown;
    };

    if (
      typeof body.currentPassword !== 'string' ||
      typeof body.newPassword !== 'string' ||
      body.currentPassword.length === 0 ||
      body.newPassword.length < 8
    ) {
      response.status(400).json({
        success: false,
        error: {
          message: 'La nueva contraseña debe tener al menos 8 caracteres',
        },
      });
      return;
    }

    const changed = await changeUserPassword(
      response.locals.userId as string,
      body.currentPassword,
      body.newPassword,
    );

    if (!changed) {
      response.status(401).json({
        success: false,
        error: { message: 'La contraseña actual no es correcta' },
      });
      return;
    }

    response.json({
      success: true,
      data: { message: 'Contraseña actualizada' },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/logout', (_request, response) => {
  response.clearCookie('access_token', {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  response.json({
    success: true,
    data: {
      message: 'Sesión cerrada',
    },
  });
});
