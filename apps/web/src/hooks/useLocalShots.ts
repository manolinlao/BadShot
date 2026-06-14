import { useEffect, useMemo, useState } from 'react';
import { mockShots } from '../data/mockShots';
import type { Shot } from '../types/shot';

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
    setCreatedShots(loadSavedShots());
  }, []);

  const feed = useMemo(() => {
    const allShots = [...createdShots, ...mockShots];
    return allShots
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [createdShots]);

  const addShot = (shot: Shot) => {
    const next = [shot, ...createdShots];
    setCreatedShots(next);
    saveShots(next);
  };

  return {
    feed,
    createdShots,
    addShot
  };
};
