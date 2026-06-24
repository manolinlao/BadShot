import { useEffect, useMemo, useState } from 'react';
import { getAllShots, saveShot } from '../api/shots/db';
import { mockShots } from '../data/mockShots';
import type { Shot } from '../types';

export const useLocalShots = () => {
  const [createdShots, setCreatedShots] = useState<Shot[]>([]);

  useEffect(() => {
    getAllShots().then(setCreatedShots);
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
    await saveShot(shot);
    setCreatedShots((prev) => [shot, ...prev]);
  };

  const updateShot = async (updatedShot: Shot) => {
    await saveShot(updatedShot);

    setCreatedShots((prev) =>
      prev.map((shot) => (shot.id === updatedShot.id ? updatedShot : shot)),
    );
  };

  const deleteShot = async (shotId: string) => {
    await deleteShotFromDb(shotId);

    setCreatedShots((prev) => prev.filter((shot) => shot.id !== shotId));
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
function deleteShotFromDb(shotId: string) {
  throw new Error('Function not implemented.');
}
