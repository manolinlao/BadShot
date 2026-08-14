// En el backend usamos Node.js con módulos ESM.
// Aunque el archivo fuente sea .ts, TypeScript lo compilará a .js.
// Por eso los imports relativos se escriben con .js.
import { prisma } from '../../db/prisma.js';
import { hashPassword } from '../../security/password.js';

type RegisterUserInput = {
  email: string;
  password: string;
  displayName: string;
};

export async function registerUser(input: RegisterUserInput) {
  const email = input.email.trim().toLowerCase();
  const displayName = input.displayName.trim();
  const passwordHash = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      email,
      displayName,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
