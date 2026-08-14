import type { ErrorRequestHandler } from 'express';
import { Prisma } from '../generated/prisma/client.js';

export const errorMiddleware: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  console.error(error);

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    response.status(409).json({
      success: false,
      error: {
        message: 'El email ya está registrado',
        code: 'EMAIL_ALREADY_EXISTS',
      },
    });
    return;
  }

  response.status(500).json({
    success: false,
    error: {
      message: 'Error interno del servidor',
      code: 'INTERNAL_ERROR',
    },
  });
};
