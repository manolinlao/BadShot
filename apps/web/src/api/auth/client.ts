export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
};

type LoginInput = {
  email: string;
  password: string;
};

type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    code?: string;
  };
};

const API_URL = 'http://localhost:3000';

export async function login(input: LoginInput): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as
    | { success: true; data: AuthUser }
    | ApiErrorResponse;

  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  if (!response.ok) {
    throw new Error('Error inesperado del servidor');
  }

  return payload.data;
}
