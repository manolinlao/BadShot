import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { RoastLevelLabel, type RoastLevel } from '../../domain/coffee/roastLevel';
import { RecipeEditor } from './RecipeEditor';

type NumberInputValue = number | '';
type RoastLevelInputValue = RoastLevel | '';

const roastLevelOptions: RoastLevel[] = ['light', 'medium-light', 'medium', 'dark'];

interface DetailsSheetProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  coffeeName: string;
  setCoffeeName: (value: string) => void;
  origin: string;
  setOrigin: (value: string) => void;
  roaster: string;
  setRoaster: (value: string) => void;
  roastLevel: RoastLevelInputValue;
  setRoastLevel: (value: RoastLevelInputValue) => void;
  doseIn: NumberInputValue;
  setDoseIn: (value: NumberInputValue) => void;
  doseOut: NumberInputValue;
  setDoseOut: (value: NumberInputValue) => void;
  time: NumberInputValue;
  setTime: (value: NumberInputValue) => void;
  notes: string;
  setNotes: (value: string) => void;
}

export function DetailsSheet({
  open,
  onOpen,
  onClose,
  coffeeName,
  setCoffeeName,
  origin,
  setOrigin,
  roaster,
  setRoaster,
  roastLevel,
  setRoastLevel,
  doseIn,
  setDoseIn,
  doseOut,
  setDoseOut,
  time,
  setTime,
  notes,
  setNotes
}: DetailsSheetProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        onClick={onOpen}
        className='group flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm font-medium text-zinc-600 transition hover:border-zinc-900 hover:text-zinc-900'
      >
        <div className='flex items-center gap-3'>
          <div className='flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-white transition group-hover:scale-110'>
            <Sparkles size={13} />
          </div>
          <div>
            <span className='block font-semibold text-zinc-900'>Add coffee details</span>
            <span className='block text-xs text-zinc-500'>Name, origin, recipe and tasting notes</span>
          </div>
        </div>
        <span className='text-xs font-semibold text-zinc-400'>Open</span>
      </button>

      <AnimatePresence>
        {open && (
          <div className='fixed inset-0 z-50 flex items-end'>
            <motion.div
              className='absolute inset-0 bg-black/40 backdrop-blur-sm'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.div
              className='relative flex max-h-[88vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl'
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 30
              }}
              drag='y'
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.y > 150) {
                  onClose();
                }
              }}
            >
              <div className='py-3'>
                <div className='mx-auto h-1.5 w-12 rounded-full bg-zinc-300' />
              </div>

              <div className='flex items-center justify-between border-b border-zinc-100 px-5 pb-3'>
                <h2 className='font-semibold'>Coffee details</h2>

                <button onClick={onClose} className='text-sm text-zinc-500 hover:text-zinc-900'>
                  Done
                </button>
              </div>

              <div className='flex-1 space-y-5 overflow-y-auto px-5 py-4'>
                <section className='space-y-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4'>
                  <p className='text-[11px] uppercase tracking-widest text-zinc-400'>Coffee</p>
                  <input
                    placeholder='Name'
                    value={coffeeName}
                    onChange={(event) => setCoffeeName(event.target.value)}
                    className='w-full rounded-xl border px-3 py-2'
                  />

                  <div className='grid grid-cols-2 gap-2'>
                    <input
                      placeholder='Origin'
                      value={origin}
                      onChange={(event) => setOrigin(event.target.value)}
                      className='rounded-xl border px-3 py-2'
                    />

                    <input
                      placeholder='Roaster'
                      value={roaster}
                      onChange={(event) => setRoaster(event.target.value)}
                      className='rounded-xl border px-3 py-2'
                    />
                  </div>

                  <div className='space-y-2'>
                    <p className='text-[11px] uppercase tracking-widest text-zinc-400'>
                      Roast level
                    </p>
                    <div className='grid grid-cols-2 gap-2'>
                      <button
                        type='button'
                        onClick={() => setRoastLevel('')}
                        className={[
                          'rounded-xl border px-3 py-2 text-sm font-semibold transition',
                          roastLevel === ''
                            ? 'border-zinc-900 bg-zinc-900 text-white'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900'
                        ].join(' ')}
                      >
                        Not sure
                      </button>

                      {roastLevelOptions.map((option) => {
                        const active = roastLevel === option;

                        return (
                          <button
                            key={option}
                            type='button'
                            onClick={() => setRoastLevel(active ? '' : option)}
                            className={[
                              'rounded-xl border px-3 py-2 text-sm font-semibold transition',
                              active
                                ? 'border-zinc-900 bg-zinc-900 text-white'
                                : 'border-zinc-200 bg-white text-zinc-600 hover:text-zinc-900'
                            ].join(' ')}
                          >
                            {RoastLevelLabel[option]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </section>

                <RecipeEditor
                  doseIn={doseIn}
                  doseOut={doseOut}
                  time={time}
                  setDoseIn={setDoseIn}
                  setDoseOut={setDoseOut}
                  setTime={setTime}
                />

                <section className='space-y-3 rounded-2xl border border-zinc-100 bg-zinc-50 p-4'>
                  <p className='text-[11px] uppercase tracking-widest text-zinc-400'>Notes</p>
                  <textarea
                    placeholder='Tasting notes...'
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className='h-28 w-full rounded-xl border px-3 py-2'
                  />
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
