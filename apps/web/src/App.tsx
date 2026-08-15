import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { shotsEffects } from './state/shots';
import { router } from './routes';
import { authEffects } from './state/auth';

export function App() {
  useEffect(() => {
    void shotsEffects.loadShotsFx();
  }, []);

  useEffect(() => {
    void authEffects.loadSessionFx();
  }, []);

  return <RouterProvider router={router} />;
}
