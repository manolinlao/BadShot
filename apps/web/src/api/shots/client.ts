import type { Coffee } from '../../domain/coffee/types';
import type { Recipe } from '../../domain/recipe/types';
import type { ShotLocation } from '../../domain/location/types';

type JsonObject = object;

export type ApiShot = {
  id: string;
  userId: string;
  user: {
    id: string;
    email: string;
    displayName: string;
  };
  coffee: Coffee | null;
  recipe: Recipe | null;
  location: ShotLocation | null;
  photoUrl: string | null;
  tastingNotes: string | null;
  rating: number | null;
  likesCount: number;
  likedByMe: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateApiShotInput = {
  coffee?: JsonObject;
  recipe?: JsonObject;
  location?: JsonObject;
  tastingNotes?: string;
  rating?: number;
};

export type UpdateApiShotInput = CreateApiShotInput;

type ApiErrorResponse = {
  success: false;
  error: {
    message: string;
    code?: string;
  };
};

const API_URL = 'http://localhost:3000';

export function getApiAssetUrl(path: string): string {
  return `${API_URL}${path}`;
}

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

export async function deleteApiShot(shotId: string): Promise<void> {
  const response = await fetch(`${API_URL}/api/shots/${shotId}`, {
    method: 'DELETE',
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

export async function toggleLikeApiShot(
  shotId: string,
): Promise<{ liked: boolean; likesCount: number }> {
  const response = await fetch(`${API_URL}/api/shots/${shotId}/like`, {
    method: 'POST',
    credentials: 'include',
  });

  const payload = (await response.json()) as
    | { success: true; data: { liked: boolean; likesCount: number } }
    | ApiErrorResponse;

  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  if (!response.ok) {
    throw new Error('Error inesperado del servidor');
  }

  return payload.data;
}

export async function updateApiShot(
  shotId: string,
  input: UpdateApiShotInput,
): Promise<ApiShot> {
  const response = await fetch(`${API_URL}/api/shots/${shotId}`, {
    method: 'PATCH',
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

export async function uploadApiShotImage(
  shotId: string,
  file: File,
): Promise<ApiShot> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_URL}/api/shots/${shotId}/image`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
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
