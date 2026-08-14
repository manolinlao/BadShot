import { env } from 'node:process';
import { jwtVerify, SignJWT } from 'jose';

const jwtSecret = env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET no está definida');
}

const secretKey = new TextEncoder().encode(jwtSecret);

export async function createAccessToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secretKey);
}

export async function verifyAccessToken(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, secretKey, {
    algorithms: ['HS256'],
  });

  if (typeof payload.sub !== 'string') {
    throw new Error('El JWT no contiene un userId válido');
  }

  return payload.sub;
}
