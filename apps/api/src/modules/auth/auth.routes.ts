import { Router } from 'express';
import { registerUser } from './auth.service.js';

export const authRouter = Router();

authRouter.post('/register', async (request, response, next) => {
  try {
    const user = await registerUser(request.body);

    response.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
