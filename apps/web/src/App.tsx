import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { RouterProvider } from 'react-router-dom';
import { shotsEffects } from './state/shots';
import { router } from './routes';
import { authEffects, authStores } from './state/auth';
import { serverShotsEffects } from './state/serverShots';
import { serverShotsEvents } from './state/serverShots';
import { connectRealtime } from './api/realtime';

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

    const syncShots = async () => {
      await serverShotsEffects.loadServerShotsFx();
      await shotsEffects.loadShotsFx();
    };

    void syncShots();

    return connectRealtime((event) => {
      if (event.type === 'shot.deleted') {
        void syncShots();
        return;
      }

      serverShotsEvents.likeUpdated({
        ...event,
        currentUserId: currentUser.id,
      });
    }, () => {
      void syncShots();
    });
  }, [currentUser?.id]);

  return <RouterProvider router={router} />;
}
