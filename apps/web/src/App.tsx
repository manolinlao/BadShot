import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { shotsEffects } from './state/shots';
import { router } from './routes';

export function App() {
  useEffect(() => {
    void shotsEffects.loadShotsFx();
  }, []);
  return <RouterProvider router={router} />;
}
