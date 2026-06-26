import { useEffect, useMemo } from 'react';
import { useUnit } from 'effector-react';
import { mockShots } from '../data/mockShots';
import type { Shot } from '../types';
import { shotsEffects, shotsStores } from '../state/shots';

export const useLocalShots = () => {
  const createdShots = useUnit(shotsStores.$shots);

  useEffect(() => {
    void shotsEffects.loadShotsFx();
  }, []);

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
    await shotsEffects.saveShotFx(shot);
  };

  const updateShot = async (shot: Shot) => {
    await shotsEffects.saveShotFx(shot);
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
