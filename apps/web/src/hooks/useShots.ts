import { useMemo } from 'react';
import { useUnit } from 'effector-react';
import { mockShots } from '../data/mockShots';
import type { Shot } from '../types';
import { shotsEffects, shotsStores } from '../state/shots';

export const useShots = () => {
  const createdShots = useUnit(shotsStores.$shots);

  const feed = useMemo(() => {
    const allShots = [...createdShots, ...mockShots];
    return allShots
      .slice()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [createdShots]);

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
    addShot,
    updateShot,
    deleteShot,
    isCreatedShot,
  };
};
