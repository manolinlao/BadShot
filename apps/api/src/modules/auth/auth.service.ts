// En el backend usamos Node.js con módulos ESM.
// Aunque el archivo fuente sea .ts, TypeScript lo compilará a .js.
// Por eso los imports relativos se escriben con .js.
import { prisma } from '../../db/prisma.js';
import { hashPassword, verifyPassword } from '../../security/password.js';
import { createAccessToken } from '../../security/jwt.js';

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

type LoginUserInput = {
  email: string;
  password: string;
};

export async function loginUser(input: LoginUserInput) {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      email: true,
      displayName: true,
      passwordHash: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return null;
  }

  const passwordIsValid = await verifyPassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordIsValid) {
    return null;
  }

  const accessToken = await createAccessToken(user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    accessToken,
  };
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: {
      id: userId,
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

export async function updateUserDisplayName(userId: string, displayName: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { displayName: displayName.trim() },
    select: {
      id: true,
      email: true,
      displayName: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { passwordHash: true },
  });

  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return false;
  }

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(newPassword) },
  });

  return true;
}
