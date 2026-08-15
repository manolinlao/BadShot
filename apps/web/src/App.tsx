import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { RouterProvider } from 'react-router-dom';
import { shotsEffects } from './state/shots';
import { router } from './routes';
import { authEffects, authStores } from './state/auth';
import { serverShotsEffects } from './state/serverShots';

export function App() {
  const currentUser = useUnit(authStores.$currentUser);

  useEffect(() => {
    void shotsEffects.loadShotsFx();
  }, []);

  useEffect(() => {
    void authEffects.loadSessionFx();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    void serverShotsEffects.loadServerShotsFx();
  }, [currentUser?.id]);

  return <RouterProvider router={router} />;
}
