export type ApiMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
  sender?: {
    id: string;
    email: string;
    displayName: string;
  };
};

export type ApiConversation = {
  id: string;
  userOne: { id: string; email: string; displayName: string };
  userTwo: { id: string; email: string; displayName: string };
  messages?: ApiMessage[];
  unreadCount?: number;
  updatedAt: string;
};

type ApiErrorResponse = {
  success: false;
  error: { message: string };
};

const API_URL = 'http://localhost:3000';

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as { success: true; data: T } | ApiErrorResponse;
  if (!payload.success) throw new Error(payload.error.message);
  if (!response.ok) throw new Error('Error inesperado del servidor');
  return payload.data;
}

export async function getConversations(): Promise<ApiConversation[]> {
  return parseResponse(
    await fetch(`${API_URL}/api/messages/conversations`, {
      credentials: 'include',
    }),
  );
}

export async function createConversation(otherUserId: string) {
  return parseResponse<ApiConversation>(
    await fetch(`${API_URL}/api/messages/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ otherUserId }),
    }),
  );
}

export async function getMessages(conversationId: string) {
  return parseResponse<ApiConversation>(
    await fetch(`${API_URL}/api/messages/conversations/${conversationId}/messages`, {
      credentials: 'include',
    }),
  );
}

export async function sendMessage(conversationId: string, body: string) {
  return parseResponse<ApiMessage>(
    await fetch(`${API_URL}/api/messages/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ body }),
    }),
  );
}

export async function markConversationRead(conversationId: string) {
  return parseResponse<null>(
    await fetch(`${API_URL}/api/messages/conversations/${conversationId}/read`, {
      method: 'POST',
      credentials: 'include',
    }),
  );
}

export async function deleteConversation(conversationId: string) {
  return parseResponse<null>(
    await fetch(`${API_URL}/api/messages/conversations/${conversationId}/delete`, {
      method: 'POST',
      credentials: 'include',
    }),
  );
}
