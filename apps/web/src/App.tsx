import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { shotsEffects } from './state/shots';
import { router } from './routes';
import { authEffects } from './state/auth';
import { serverShotsEffects } from './state/serverShots';

export function App() {
  useEffect(() => {
    void shotsEffects.loadShotsFx();
  }, []);

  useEffect(() => {
    void authEffects.loadSessionFx();
  }, []);

  useEffect(() => {
    void serverShotsEffects.loadServerShotsFx();
  }, []);

  return <RouterProvider router={router} />;
}
