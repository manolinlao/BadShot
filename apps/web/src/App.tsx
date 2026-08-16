import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { RouterProvider } from 'react-router-dom';
import { shotsEffects } from './state/shots';
import { router } from './routes';
import { authEffects, authStores } from './state/auth';
import { serverShotsEffects } from './state/serverShots';
import {
  serverShotsRealtimeEvents,
} from './state/serverShots';
import { connectRealtime } from './realtime/socket';

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

    return connectRealtime({
      onShotCreated: serverShotsRealtimeEvents.realtimeShotCreated,
      onShotUpdated: serverShotsRealtimeEvents.realtimeShotUpdated,
      onShotDeleted: serverShotsRealtimeEvents.realtimeShotDeleted,
      onLikeUpdated: serverShotsRealtimeEvents.realtimeLikeUpdated,
    });
  }, [currentUser?.id]);

  return <RouterProvider router={router} />;
}
