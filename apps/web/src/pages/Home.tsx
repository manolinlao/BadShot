import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ShotCard } from '../components/ShotCard';
import { useLocalShots } from '../hooks/useLocalShots';

type HomeLocationState = {
  flash?: string;
};

export function Home() {
  const { feed } = useLocalShots();
  const location = useLocation();
  const navigate = useNavigate();
  const flash = (location.state as HomeLocationState | null)?.flash;
  const [visibleFlash, setVisibleFlash] = useState(flash);

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
            <ShotCard key={shot.id} shot={shot} />
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
    </>
  );
}
