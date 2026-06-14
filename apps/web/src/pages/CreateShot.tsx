import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalShots } from '../hooks/useLocalShots';
import type { RoastLevel } from '../domain/coffee/roastLevel';
import type { Shot } from '../types/shot';

const roastOptions: RoastLevel[] = ['light', 'medium-light', 'medium', 'dark'];

const initial = {
  coffeeName: '',
  coffeeOrigin: '',
  coffeeRoaster: '',
  roastLevel: 'medium' as RoastLevel,

  imageUrl: '',

  doseIn: '',
  doseOut: '',
  time: '',

  tastingNotes: '',
  rating: 3
};

function RatingPills({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const labels = ['Bad', 'Ok', 'Good', 'Great', 'God shot'];

  return (
    <div className='flex flex-wrap gap-2'>
      {labels.map((l, i) => {
        const active = i + 1 === value;

        return (
          <button
            key={l}
            type='button'
            onClick={() => onChange(i + 1)}
            className={`px-3 py-1 rounded-full border text-sm transition ${
              active ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

export function CreateShot() {
  const navigate = useNavigate();
  const { addShot } = useLocalShots();

  const [form, setForm] = useState(initial);
  const [error, setError] = useState('');

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const ratio =
    form.doseIn && form.doseOut ? (Number(form.doseOut) / Number(form.doseIn)).toFixed(2) : null;

  const handleSubmit = () => {
    if (!form.coffeeName || !form.coffeeOrigin) {
      setError('Coffee name and origin are required');
      return;
    }

    const shot: Shot = {
      id: `shot-${Date.now()}`,
      user: {
        displayName: 'You',
        username: 'localuser'
      },

      imageUrl: form.imageUrl,

      coffee: {
        name: form.coffeeName,
        origin: form.coffeeOrigin,
        roaster: form.coffeeRoaster,
        roastLevel: form.roastLevel
      },

      recipe: {
        doseIn: form.doseIn ? Number(form.doseIn) : undefined,
        doseOut: form.doseOut ? Number(form.doseOut) : undefined,
        time: form.time ? Number(form.time) : undefined
      },

      tastingNotes: form.tastingNotes,
      rating: form.rating,

      likesCount: 0,
      commentsCount: 0,

      brewedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    addShot(shot);
    navigate('/');
  };

  return (
    <div className='max-w-3xl mx-auto space-y-8'>
      {/* HEADER */}
      <header className='space-y-1'>
        <h1 className='text-3xl font-bold'>Log your shot</h1>
        <p className='text-gray-600'>How did your espresso turn out?</p>
      </header>

      {error && <div className='bg-red-100 text-red-700 p-3 rounded'>{error}</div>}

      {/* CARD */}
      <div className='bg-white border rounded-xl p-6 space-y-8'>
        {/* COFFEE */}
        <section className='space-y-3'>
          <p className='text-xs uppercase tracking-wide text-gray-500'>Coffee</p>

          <input
            placeholder='Coffee name'
            value={form.coffeeName}
            onChange={(e) => set('coffeeName', e.target.value)}
            className='input'
          />

          <div className='grid grid-cols-2 gap-3'>
            <input
              placeholder='Origin'
              value={form.coffeeOrigin}
              onChange={(e) => set('coffeeOrigin', e.target.value)}
              className='input'
            />

            <input
              placeholder='Roaster'
              value={form.coffeeRoaster}
              onChange={(e) => set('coffeeRoaster', e.target.value)}
              className='input'
            />
          </div>

          <select
            value={form.roastLevel}
            onChange={(e) => set('roastLevel', e.target.value)}
            className='input'
          >
            {roastOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <input
            placeholder='Image URL (optional)'
            value={form.imageUrl}
            onChange={(e) => set('imageUrl', e.target.value)}
            className='input'
          />
        </section>

        {/* SHOT CORE (IMPORTANTE) */}
        <section className='space-y-3'>
          <p className='text-xs uppercase tracking-wide text-gray-500'>Extraction</p>

          <div className='grid grid-cols-3 gap-3'>
            <input
              placeholder='In (g)'
              value={form.doseIn}
              onChange={(e) => set('doseIn', e.target.value)}
              className='input'
            />

            <input
              placeholder='Out (g)'
              value={form.doseOut}
              onChange={(e) => set('doseOut', e.target.value)}
              className='input'
            />

            <input
              placeholder='Time (s)'
              value={form.time}
              onChange={(e) => set('time', e.target.value)}
              className='input'
            />
          </div>

          {ratio && (
            <div className='text-sm text-gray-600'>
              Ratio: <b>1:{ratio}</b>
            </div>
          )}
        </section>

        {/* TASTE */}
        <section className='space-y-3'>
          <p className='text-xs uppercase tracking-wide text-gray-500'>Taste</p>

          <textarea
            placeholder='What do you taste? (floral, fruity, chocolate...)'
            value={form.tastingNotes}
            onChange={(e) => set('tastingNotes', e.target.value)}
            className='input h-24'
          />

          <RatingPills value={form.rating} onChange={(v) => set('rating', v)} />
        </section>

        {/* ACTION */}
        <button onClick={handleSubmit} className='w-full bg-black text-white py-3 rounded-lg'>
          Save shot
        </button>
      </div>
    </div>
  );
}
