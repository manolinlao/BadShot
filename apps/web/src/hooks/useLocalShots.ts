import { useEffect, useMemo, useState } from 'react';
import { getAllShots } from '../api/shots/db';
import { mockShots } from '../data/mockShots';
import type { Shot } from '../types';

const STORAGE_KEY = 'badshot-created-shots';

const loadSavedShots = (): Shot[] => {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Shot[]) : [];
  } catch {
    return [];
  }
};

const saveShots = (shots: Shot[]) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(shots));
  } catch {
    // ignore localStorage failures
  }
};

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

  const addShot = (shot: Shot) => {
    const next = [shot, ...createdShots];
    setCreatedShots(next);
    saveShots(next);
  };

  const updateShot = (updatedShot: Shot) => {
    const next = createdShots.map((shot) =>
      shot.id === updatedShot.id ? updatedShot : shot,
    );
    setCreatedShots(next);
    saveShots(next);
  };

  const deleteShot = (shotId: string) => {
    const next = createdShots.filter((shot) => shot.id !== shotId);
    setCreatedShots(next);
    saveShots(next);
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
