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

type RegisterInput = {
  email: string;
  password: string;
  displayName: string;
};

type UpdateProfileInput = {
  displayName: string;
};

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
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

export async function getMe(): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    credentials: 'include',
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

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/me`, {
    method: 'PATCH',
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

export async function changePassword(
  input: ChangePasswordInput,
): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/me/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as
    | { success: true; data: { message: string } }
    | ApiErrorResponse;

  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  if (!response.ok) {
    throw new Error('Error inesperado del servidor');
  }
}

export async function logout(): Promise<void> {
  const response = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const payload = (await response.json()) as
    | { success: true; data: null }
    | ApiErrorResponse;

  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  if (!response.ok) {
    throw new Error('Error inesperado del servidor');
  }
}

export async function register(input: RegisterInput): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
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
