export type ApiShot = {
  id: string;
  userId: string;
  tastingNotes: string | null;
  rating: number | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateApiShotInput = {
  tastingNotes?: string;
  rating?: number;
};

type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    code?: string;
  };
};

const API_URL = 'http://localhost:3000';

export async function getMyShots(): Promise<ApiShot[]> {
  const response = await fetch(`${API_URL}/api/shots`, {
    credentials: 'include',
  });

  const payload = (await response.json()) as
    | { success: true; data: ApiShot[] }
    | ApiErrorResponse;

  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  if (!response.ok) {
    throw new Error('Error inesperado del servidor');
  }

  return payload.data;
}

export async function createApiShot(
  input: CreateApiShotInput,
): Promise<ApiShot> {
  const response = await fetch(`${API_URL}/api/shots`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(input),
  });

  const payload = (await response.json()) as
    | { success: true; data: ApiShot }
    | ApiErrorResponse;

  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  if (!response.ok) {
    throw new Error('Error inesperado del servidor');
  }

  return payload.data;
}
