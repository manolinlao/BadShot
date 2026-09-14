import type { RequestHandler } from 'express';
import { verifyAccessToken } from '../../security/jwt.js';
import { prisma } from '../../db/prisma.js';

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

export const requireWritableUser: RequestHandler = async (
  _request,
  response,
  next,
) => {
  const userId = response.locals.userId as string | undefined;

  if (!userId) {
    response.status(401).json({
      success: false,
      error: { message: 'Falta el usuario autenticado' },
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      response.status(401).json({
        success: false,
        error: { message: 'Usuario no encontrado' },
      });
      return;
    }

    if (user.role === 'GUEST') {
      response.status(403).json({
        success: false,
        error: {
          message: 'El usuario invitado solo tiene permisos de lectura',
          code: 'READ_ONLY_USER',
        },
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
