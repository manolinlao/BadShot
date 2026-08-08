import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  if (password.length === 0) {
    throw new Error('Password cannot be empty');
  }

  return argon2.hash(password, {
    type: argon2.argon2id,
  });
}

export function verifyPassword(
  password: string,
  passwordHash: string,
): Promise<boolean> {
  return argon2.verify(passwordHash, password);
}
