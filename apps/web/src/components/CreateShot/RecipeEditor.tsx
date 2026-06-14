import { useState } from 'react';

interface RecipeEditorProps {
  doseIn: number | '';
  doseOut: number | '';
  time: number | '';
  setDoseIn: (v: number | '') => void;
  setDoseOut: (v: number | '') => void;
  setTime: (v: number | '') => void;
}

export const RecipeEditor = ({
  doseIn,
  doseOut,
  time,
  setDoseIn,
  setDoseOut,
  setTime
}: RecipeEditorProps) => {
  const [editing, setEditing] = useState<'in' | 'out' | 'time' | null>(null);

  return (
    <section className='rounded-2xl bg-zinc-900 text-white p-4 space-y-3'>
      <p className='text-[11px] uppercase tracking-widest text-zinc-400'>Recipe</p>

      <div className='flex flex-wrap gap-2'>
        <button onClick={() => setEditing('in')} className='px-3 py-1 rounded-full bg-white/10'>
          {doseIn !== '' ? doseIn : '-'} <span className='text-xs text-zinc-400'>g in</span>
        </button>

        <button onClick={() => setEditing('out')} className='px-3 py-1 rounded-full bg-white/10'>
          {doseOut !== '' ? doseOut : '-'} <span className='text-xs text-zinc-400'>g out</span>
        </button>

        <button onClick={() => setEditing('time')} className='px-3 py-1 rounded-full bg-white/10'>
          {time !== '' ? time : '-'} <span className='text-xs text-zinc-400'>s</span>
        </button>
      </div>

      {editing && (
        <input
          autoFocus
          type='number'
          inputMode='numeric'
          value={editing === 'in' ? doseIn : editing === 'out' ? doseOut : time}
          onChange={(e) => {
            const v = e.target.value;
            const num = v === '' ? '' : Number(v);

            if (editing === 'in') setDoseIn(num);
            if (editing === 'out') setDoseOut(num);
            if (editing === 'time') setTime(num);
          }}
          onBlur={() => setEditing(null)}
          className='mt-2 px-3 py-2 rounded-xl bg-white/10 outline-none w-28 text-center'
        />
      )}
    </section>
  );
};
