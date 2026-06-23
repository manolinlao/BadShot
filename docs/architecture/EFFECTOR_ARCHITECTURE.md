# Arquitectura Effector - BadShot

## ¿Por qué Effector?

- **Event-driven**: Arquitectura basada en eventos (más predecible que Redux)
- **TypeScript-first**: Tipos automáticos sin boilerplate
- **Performance**: Re-renders mínimos y optimizados
- **DevTools**: Excelente debugging con Effector DevTools
- **Testeable**: Lógica de negocio fácil de testear (pure functions)

## Estructura de Stores

```
apps/web/src/
├── models/                    # Effector stores (domain logic)
│   ├── auth/
│   │   ├── index.ts          # Barrel export
│   │   ├── stores.ts         # $user, $token, $isAuthenticated
│   │   ├── events.ts         # loginFx, logoutFx, registerFx
│   │   └── init.ts           # Store initialization & effects
│   ├── shots/
│   │   ├── index.ts
│   │   ├── stores.ts         # $shots, $currentShot, $filters
│   │   ├── events.ts         # createShotFx, likeShotFx, deleteShotFx
│   │   └── init.ts
│   ├── profile/
│   │   ├── index.ts
│   │   ├── stores.ts         # $currentProfile, $userShots, $following
│   │   ├── events.ts         # followUserFx, updateProfileFx
│   │   └── init.ts
│   ├── comments/
│   │   ├── index.ts
│   │   ├── stores.ts         # $comments
│   │   ├── events.ts         # addCommentFx, deleteCommentFx
│   │   └── init.ts
│   ├── ui/
│   │   ├── index.ts
│   │   ├── stores.ts         # $modals, $loading, $notifications
│   │   └── events.ts         # openModal, closeModal, showNotification
│   └── sync/                 # Offline sync logic
│       ├── index.ts
│       ├── stores.ts         # $syncQueue, $isOnline
│       ├── events.ts         # syncPendingActions
│       └── init.ts
```

## Patrón Base

### stores.ts

```typescript
import { createStore } from 'effector';
import { User } from '@/types';

// Store para usuario actual
export const $user = createStore<User | null>(null);

// Store para estado de autenticación
export const $isAuthenticated = $user.map((user) => user !== null);

// Store para token
export const $token = createStore<string | null>(null);
```

### events.ts

```typescript
import { createEffect, createEvent } from 'effector';
import { authService } from '@/services/auth.service';
import type { LoginCredentials, RegisterData, User } from '@/types';

// Events simples
export const logout = createEvent();
export const setToken = createEvent<string>();

// Effects (async operations)
export const loginFx = createEffect<
  LoginCredentials,
  { user: User; token: string },
  Error
>(async (credentials) => {
  const response = await authService.login(credentials);
  return response.data;
});

export const registerFx = createEffect<
  RegisterData,
  { user: User; token: string },
  Error
>(async (data) => {
  const response = await authService.register(data);
  return response.data;
});

export const logoutFx = createEffect(async () => {
  await authService.logout();
});
```

### init.ts

```typescript
import { sample } from 'effector';
import { $user, $token } from './stores';
import { loginFx, registerFx, logout, logoutFx, setToken } from './events';

// Actualizar user y token después de login exitoso
sample({
  clock: loginFx.doneData,
  fn: ({ user }) => user,
  target: $user,
});

sample({
  clock: loginFx.doneData,
  fn: ({ token }) => token,
  target: $token,
});

// Lo mismo para register
sample({
  clock: registerFx.doneData,
  fn: ({ user }) => user,
  target: $user,
});

sample({
  clock: registerFx.doneData,
  fn: ({ token }) => token,
  target: $token,
});

// Reset stores al hacer logout
sample({
  clock: logout,
  target: logoutFx,
});

sample({
  clock: logoutFx.done,
  fn: () => null,
  target: [$user, $token],
});

// Persistir token en localStorage
$token.watch((token) => {
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }
});

// Restaurar token al iniciar
const savedToken = localStorage.getItem('token');
if (savedToken) {
  setToken(savedToken);
}
```

### index.ts (barrel export)

```typescript
export * from './stores';
export * from './events';
import './init'; // Auto-ejecutar inicialización
```

## Uso en Componentes

```typescript
import { useUnit } from 'effector-react'
import { $user, $isAuthenticated, loginFx, logout } from '@/models/auth'

function LoginButton() {
  const [user, isAuth, login, handleLogout, isLoading] = useUnit([
    $user,
    $isAuthenticated,
    loginFx,
    logout,
    loginFx.pending,
  ])

  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'pass123' })
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  if (isLoading) return <Spinner />

  if (isAuth) {
    return (
      <div>
        <p>Welcome {user?.displayName}</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  return <button onClick={handleLogin}>Login</button>
}
```

## Integración con IndexedDB

### sync/stores.ts

```typescript
import { createStore } from 'effector';

export type PendingAction = {
  id: string;
  type: 'like' | 'comment' | 'create_shot' | 'follow';
  payload: any;
  timestamp: number;
};

export const $syncQueue = createStore<PendingAction[]>([]);
export const $isOnline = createStore<boolean>(navigator.onLine);
```

### sync/events.ts

```typescript
import { createEffect, createEvent } from 'effector';
import { db } from '@/lib/indexeddb'; // Dexie instance

export const addToSyncQueue =
  createEvent<Omit<PendingAction, 'id' | 'timestamp'>>();
export const removeFromSyncQueue = createEvent<string>();
export const setOnlineStatus = createEvent<boolean>();

export const syncPendingActionsFx = createEffect(async () => {
  const pendingActions = await db.syncQueue.toArray();

  for (const action of pendingActions) {
    try {
      // Ejecutar acción según tipo
      switch (action.type) {
        case 'like':
          await shotService.like(action.payload.shotId);
          break;
        case 'comment':
          await commentService.create(action.payload);
          break;
        // ... otros casos
      }

      // Remover de IndexedDB si tuvo éxito
      await db.syncQueue.delete(action.id);
    } catch (error) {
      console.error('Sync failed:', action, error);
      // Mantener en cola para reintentar
    }
  }
});
```

### sync/init.ts

```typescript
import { sample } from 'effector';
import { $syncQueue, $isOnline } from './stores';
import {
  addToSyncQueue,
  syncPendingActionsFx,
  setOnlineStatus,
} from './events';
import { db } from '@/lib/indexeddb';

// Agregar a cola y persistir en IndexedDB
sample({
  clock: addToSyncQueue,
  fn: (action) => ({
    ...action,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  }),
  target: createEffect(async (action: PendingAction) => {
    await db.syncQueue.add(action);
    return action;
  }),
});

// Sincronizar cuando vuelve la conexión
sample({
  clock: setOnlineStatus,
  source: $isOnline,
  filter: (wasOffline, isNowOnline) => !wasOffline && isNowOnline,
  target: syncPendingActionsFx,
});

// Listener para cambios de conectividad
window.addEventListener('online', () => setOnlineStatus(true));
window.addEventListener('offline', () => setOnlineStatus(false));
```

## Integración con TanStack Query

Effector para **state sincrónico y lógica de negocio**.
TanStack Query para **fetching, caching, y optimistic updates**.

```typescript
// useShots.ts - Custom hook combinando ambos
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUnit } from 'effector-react';
import { shotService } from '@/services/shot.service';
import { $filters } from '@/models/shots';
import { addToSyncQueue } from '@/models/sync';

export function useShots() {
  const filters = useUnit($filters);
  const queryClient = useQueryClient();
  const addToQueue = useUnit(addToSyncQueue);

  // Fetch shots con TanStack Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['shots', filters],
    queryFn: () => shotService.getAll(filters),
  });

  // Like con optimistic update
  const likeMutation = useMutation({
    mutationFn: shotService.like,
    onMutate: async (shotId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['shots'] });
      const previous = queryClient.getQueryData(['shots']);

      queryClient.setQueryData(['shots'], (old: any) => ({
        ...old,
        shots: old.shots.map((shot: any) =>
          shot.id === shotId
            ? { ...shot, isLiked: true, likesCount: shot.likesCount + 1 }
            : shot,
        ),
      }));

      return { previous };
    },
    onError: (err, variables, context) => {
      // Rollback en caso de error
      queryClient.setQueryData(['shots'], context?.previous);

      // Agregar a sync queue si estamos offline
      if (!navigator.onLine) {
        addToQueue({ type: 'like', payload: { shotId: variables } });
      }
    },
  });

  return { data, isLoading, error, likeMutation };
}
```

## Testing

```typescript
// auth.test.ts
import { fork, allSettled } from 'effector';
import { $user, $token, loginFx } from './auth';

describe('Auth model', () => {
  it('should update user and token after successful login', async () => {
    const scope = fork();

    await allSettled(loginFx, {
      scope,
      params: { email: 'test@example.com', password: 'pass123' },
    });

    expect(scope.getState($user)).toEqual({
      id: '1',
      email: 'test@example.com',
    });
    expect(scope.getState($token)).toBeTruthy();
  });
});
```

## Best Practices

1. **Separar concerns**: Stores para estado, Events para acciones, Init para lógica
2. **Un model por dominio**: auth, shots, profile, comments, etc.
3. **Effects para async**: Nunca hacer fetch directo en stores
4. **sample() para derivaciones**: Conectar eventos y stores de forma declarativa
5. **useUnit() en vez de useStore()**: Más eficiente, menos re-renders
6. **Testing con fork()**: Aislar tests sin state compartido
7. **IndexedDB para offline**: Persistir lo importante, sincronizar cuando vuelve conexión

## DevTools

Instalar Effector DevTools extension para Chrome/Firefox:

- Ver state en tiempo real
- Time travel debugging
- Event history
- Performance profiling
