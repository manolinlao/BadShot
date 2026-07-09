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
  setTime,
}: RecipeEditorProps) => {
  const [editing, setEditing] = useState<'in' | 'out' | 'time' | null>(null);
  const ratio =
    typeof doseIn === 'number' &&
    doseIn > 0 &&
    typeof doseOut === 'number' &&
    doseOut > 0
      ? (doseOut / doseIn).toFixed(2)
      : null;

  return (
    <section className="space-y-3 rounded-2xl border border-zinc-100 bg-zinc-900 p-4 text-white">
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-widest text-zinc-400">
          Recipe
        </p>
        <p className="text-sm text-zinc-300">
          Tap a value to edit it. The ratio updates automatically.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setEditing('in')}
          className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/15"
        >
          <span className="block text-lg font-semibold leading-none">
            {doseIn !== '' ? doseIn : '-'}
          </span>
          <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            g in
          </span>
        </button>

        <button
          type="button"
          onClick={() => setEditing('out')}
          className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/15"
        >
          <span className="block text-lg font-semibold leading-none">
            {doseOut !== '' ? doseOut : '-'}
          </span>
          <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            g out
          </span>
        </button>

        <button
          type="button"
          onClick={() => setEditing('time')}
          className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-left transition hover:border-white/20 hover:bg-white/15"
        >
          <span className="block text-lg font-semibold leading-none">
            {time !== '' ? time : '-'}
          </span>
          <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-zinc-400">
            seconds
          </span>
        </button>
      </div>

      {editing && (
        <input
          autoFocus
          type="number"
          inputMode="numeric"
          value={editing === 'in' ? doseIn : editing === 'out' ? doseOut : time}
          onChange={(e) => {
            const v = e.target.value;
            const num = v === '' ? '' : Number(v);

            if (editing === 'in') setDoseIn(num);
            if (editing === 'out') setDoseOut(num);
            if (editing === 'time') setTime(num);
          }}
          onBlur={() => setEditing(null)}
          className="mt-2 w-28 rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-center outline-none transition focus:border-white/30"
        />
      )}

      {ratio && (
        <p className="text-sm font-semibold text-zinc-200">
          Ratio <span className="text-white">1:{ratio}</span>
        </p>
      )}
    </section>
  );
};
