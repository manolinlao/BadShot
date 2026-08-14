import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../../security/jwt.js';

export const requireAuth: RequestHandler = async (request, response, next) => {
  const authorization = request.header('Authorization');
  const [scheme, headerToken] = authorization?.split(' ') ?? [];
  const cookieToken = request.cookies?.access_token;

  const token = scheme === 'Bearer' && headerToken ? headerToken : cookieToken;

  if (!token) {
    response.status(401).json({
      success: false,
      error: {
        message: 'Falta el token de autenticación',
      },
    });
    return;
  }

  try {
    const userId = await verifyAccessToken(token);

    response.locals.userId = userId;

    next();
  } catch {
    response.status(401).json({
      success: false,
      error: {
        message: 'Token inválido o caducado',
      },
    });
  }
};
