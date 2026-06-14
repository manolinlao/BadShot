import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ShotCard } from '../components/ShotCard';
import { useLocalShots } from '../hooks/useLocalShots';
import type { Shot } from '../types/shot';

type HomeLocationState = {
  flash?: string;
};

export function Home() {
  const { feed, deleteShot, isCreatedShot } = useLocalShots();
  const location = useLocation();
  const navigate = useNavigate();
  const flash = (location.state as HomeLocationState | null)?.flash;
  const [visibleFlash, setVisibleFlash] = useState(flash);
  const [shotToDelete, setShotToDelete] = useState<Shot | null>(null);

  useEffect(() => {
    if (!flash) return;

    navigate('.', { replace: true, state: null });
  }, [flash, navigate]);

  useEffect(() => {
    if (!visibleFlash) return;

    const timeoutId = window.setTimeout(() => {
      setVisibleFlash(undefined);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [visibleFlash]);

  const handleConfirmDelete = () => {
    if (!shotToDelete) return;

    deleteShot(shotToDelete.id);
    setShotToDelete(null);
    setVisibleFlash('Shot deleted');
  };

  return (
    <>
      {visibleFlash && (
        <div
          role='status'
          className='fixed inset-x-4 bottom-24 z-20 mx-auto max-w-sm rounded-lg border border-[#d7c5b4] bg-[#211a16] px-4 py-3 text-center text-sm font-bold text-white shadow-lg sm:bottom-6'
        >
          {visibleFlash}
        </div>
      )}

      <section className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]'>
        <div className='space-y-5'>
          {feed.map((shot) => (
            <ShotCard
              key={shot.id}
              shot={shot}
              onEdit={isCreatedShot(shot.id) ? () => navigate(`/edit/${shot.id}`) : undefined}
              onDelete={isCreatedShot(shot.id) ? () => setShotToDelete(shot) : undefined}
            />
          ))}
        </div>

        <aside className='h-fit rounded-lg border border-[#e2d6ca] bg-[#fffaf5] p-5'>
          <p className='mb-3 text-sm font-bold uppercase text-[#7a4d2a]'>BadShot</p>
          <h1 className='text-3xl font-black leading-tight'>
            Your espresso social journal starts here.
          </h1>
          <p className='mt-4 text-sm leading-6 text-[#4a3a31]'>
            This feed now includes shots created in the browser and local mock data.
          </p>
        </aside>
      </section>

      {shotToDelete && (
        <div className='fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4'>
          <div
            role='dialog'
            aria-modal='true'
            aria-labelledby='delete-shot-title'
            className='w-full max-w-sm rounded-lg border border-[#e2d6ca] bg-[#fffaf5] p-5 shadow-xl'
          >
            <h2 id='delete-shot-title' className='text-lg font-black'>
              Delete this shot?
            </h2>
            <p className='mt-2 text-sm leading-6 text-[#5f4a3f]'>
              This only deletes the shot saved in this browser.
            </p>

            <div className='mt-5 flex justify-end gap-2'>
              <button
                type='button'
                onClick={() => setShotToDelete(null)}
                className='rounded px-4 py-2 text-sm font-bold text-[#5f4a3f] hover:bg-[#efe5dc]'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleConfirmDelete}
                className='rounded bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
