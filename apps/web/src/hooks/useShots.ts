import { useMemo } from 'react';
import { useUnit } from 'effector-react';
import { mockShots } from '../data/mockShots';
import type { Shot } from '../domain/shot/types';
import { shotsEffects, shotsStores } from '../state/shots';

type UseShotsOptions = {
  additionalMockShots?: Shot[];
};

export const useShots = ({ additionalMockShots = [] }: UseShotsOptions = {}) => {
  const [createdShots, isLoading] = useUnit([
    shotsStores.$shots,
    shotsStores.$shotsLoading,
  ]);

  const feed = useMemo(() => {
    const allShots = [...createdShots, ...mockShots, ...additionalMockShots];
    return allShots
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [additionalMockShots, createdShots]);

  const addShot = async (shot: Shot) => {
    await shotsEffects.createShotFx(shot);
  };

  const updateShot = async (shot: Shot) => {
    await shotsEffects.updateShotFx(shot);
  };

  const deleteShot = async (shot: Shot) => {
    await shotsEffects.deleteShotFx(shot);
  };

  const isCreatedShot = (shotId: string) => {
    return createdShots.some((shot) => shot.id === shotId);
  };

  return {
    feed,
    createdShots,
    isLoading,
    addShot,
    updateShot,
    deleteShot,
    isCreatedShot,
  };
};
