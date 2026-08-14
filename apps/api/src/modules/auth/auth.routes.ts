import { Router } from 'express';
import { loginUser, registerUser } from './auth.service.js';

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

    response.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
