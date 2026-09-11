import { createHash, randomBytes } from 'node:crypto';
import { env } from 'node:process';
import { prisma } from '../../db/prisma.js';
import { hashPassword } from '../../security/password.js';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

function hashResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function getResetUrl(token: string): string {
  const appUrl = env.APP_URL ?? 'http://localhost:5173';
  return `${appUrl}/reset-password?token=${encodeURIComponent(token)}`;
}

async function deliverResetLink(email: string, resetUrl: string) {
  const apiKey = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM;

  if (!apiKey || !from) {
    if (env.NODE_ENV !== 'production') {
      console.info(`[password-reset] ${email}: ${resetUrl}`);
      return;
    }

    throw new Error('Password reset email is not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Reset your BadShot password',
      text: `Use this link to reset your BadShot password. It expires in one hour:\n\n${resetUrl}`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Password reset email failed with status ${response.status}`);
  }
}

export async function requestPasswordReset(emailInput: string): Promise<void> {
  const email = emailInput.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true },
  });

  if (!user) return;

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.$transaction([
    prisma.passwordResetToken.deleteMany({ where: { userId: user.id } }),
    prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashResetToken(token),
        expiresAt,
      },
    }),
  ]);

  await deliverResetLink(user.email, getResetUrl(token));
}

export async function resetPassword(token: string, newPassword: string) {
  const tokenHash = hashResetToken(token);
  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: new Date() },
    },
    select: { id: true, userId: true },
  });

  if (!resetToken) return false;

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId, id: { not: resetToken.id } },
    }),
  ]);

  return true;
}
