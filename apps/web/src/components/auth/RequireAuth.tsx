import { useUnit } from 'effector-react';
import { Navigate, Outlet } from 'react-router-dom';
import { authStores } from '../../state/auth';

export function RequireAuth() {
  const { currentUser, sessionReady } = useUnit({
    currentUser: authStores.$currentUser,
    sessionReady: authStores.$sessionReady,
  });

  if (!sessionReady) {
    return <p>Comprobando sesión...</p>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
