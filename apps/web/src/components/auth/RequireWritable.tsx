import { useUnit } from 'effector-react';
import { Navigate, Outlet } from 'react-router-dom';
import { authStores } from '../../state/auth';

export function RequireWritable() {
  const currentUser = useUnit(authStores.$currentUser);

  if (currentUser?.role === 'GUEST') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
