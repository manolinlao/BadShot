import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PanInfo } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { RoastLevelLabel, type RoastLevel } from '../../domain/coffee';
import { RecipeEditor } from './RecipeEditor';
import { FlavorWheel } from './FlavorWheel';

type NumberInputValue = number | '';
type RoastLevelInputValue = RoastLevel | '';

const roastLevelOptions: RoastLevel[] = [
  'light',
  'medium-light',
  'medium',
  'dark',
];

interface DetailsSheetProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  sheetId: string;
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
  flavors: string[];
  setFlavors: (value: string[]) => void;
  aromaScore: NumberInputValue;
  setAromaScore: (value: NumberInputValue) => void;
  acidityScore: NumberInputValue;
  setAcidityScore: (value: NumberInputValue) => void;
  bodyScore: NumberInputValue;
  setBodyScore: (value: NumberInputValue) => void;
  sweetnessScore: NumberInputValue;
  setSweetnessScore: (value: NumberInputValue) => void;
  finishScore: NumberInputValue;
  setFinishScore: (value: NumberInputValue) => void;
}

export function DetailsSheet({
  open,
  onOpen,
  onClose,
  sheetId,
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
  setNotes,
  flavors,
  setFlavors,
  aromaScore,
  setAromaScore,
  acidityScore,
  setAcidityScore,
  bodyScore,
  setBodyScore,
  sweetnessScore,
  setSweetnessScore,
  finishScore,
  setFinishScore,
}: DetailsSheetProps) {
  const tastingScores = [
    { label: 'Aroma', value: aromaScore, setValue: setAromaScore },
    { label: 'Acidity', value: acidityScore, setValue: setAcidityScore },
    { label: 'Body', value: bodyScore, setValue: setBodyScore },
    { label: 'Sweetness', value: sweetnessScore, setValue: setSweetnessScore },
    { label: 'Finish', value: finishScore, setValue: setFinishScore },
  ];
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        aria-expanded={open}
        aria-controls={sheetId}
        className="group flex w-full items-center justify-between gap-3 rounded-[24px] border border-[#e2d6ca] bg-white px-4 py-4 text-left text-sm font-medium text-[#5f4a3f] shadow-[0_10px_24px_rgba(49,33,20,0.04)] transition hover:border-[#7a4d2a] hover:text-[#211a16]"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#211a16] text-white transition group-hover:scale-110">
            <Sparkles size={13} />
          </div>
          <div>
            <span className="block font-semibold text-[#211a16]">
              Optional details
            </span>
            <span className="block text-xs text-[#6f5b50]">
              Coffee info, recipe and tasting notes
            </span>
          </div>
        </div>
        <span className="rounded-full border border-[#eadfd6] bg-[#fbf6ef] px-3 py-1 text-xs font-semibold text-[#7a4d2a]">
          Open
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-end">
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <motion.div
              id={sheetId}
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${sheetId}-title`}
              className="relative flex max-h-[88vh] w-full flex-col rounded-t-[32px] bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_22%)] shadow-2xl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 30,
              }}
              drag="y"
              dragConstraints={{ top: 0 }}
              dragElastic={0.2}
              onDragEnd={
                (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
                  if (info.offset.y > 150) {
                    onClose();
                  }
                }
              }
            >
              <div className="py-3">
                <div className="mx-auto h-1.5 w-12 rounded-full bg-[#dcc7b5]" />
              </div>

              <div className="flex items-center justify-between border-b border-[#eadfd6] px-5 pb-3">
                <div>
                  <h2 id={`${sheetId}-title`} className="font-semibold text-[#211a16]">
                    Optional details
                  </h2>
                  <p className="mt-1 text-xs text-[#6f5b50]">
                    Fill only what helps. You can save the shot without any of
                    this.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-[#e2d6ca] px-3 py-1.5 text-sm font-semibold text-[#5f4a3f] transition hover:border-[#211a16] hover:text-[#211a16]"
                >
                  Done
                </button>
              </div>

              <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
                <section className="space-y-3 rounded-[24px] border border-[#eadfd6] bg-white/80 p-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a4d2a]">
                      Coffee
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#6f5b50]">
                      Name, origin, roaster and roast level.
                    </p>
                  </div>
                  <input
                    placeholder="Name"
                    value={coffeeName}
                    onChange={(event) => setCoffeeName(event.target.value)}
                    className="w-full rounded-xl border border-[#e2d6ca] bg-white px-3 py-2.5 outline-none transition focus:border-[#211a16]"
                  />

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      placeholder="Origin"
                      value={origin}
                      onChange={(event) => setOrigin(event.target.value)}
                      className="rounded-xl border border-[#e2d6ca] bg-white px-3 py-2.5 outline-none transition focus:border-[#211a16]"
                    />

                    <input
                      placeholder="Roaster"
                      value={roaster}
                      onChange={(event) => setRoaster(event.target.value)}
                      className="rounded-xl border border-[#e2d6ca] bg-white px-3 py-2.5 outline-none transition focus:border-[#211a16]"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a4d2a]">
                      Roast level
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setRoastLevel('')}
                        className={[
                          'rounded-xl border px-3 py-2 text-sm font-semibold transition',
                          roastLevel === ''
                            ? 'border-[#211a16] bg-[#211a16] text-white'
                            : 'border-[#e2d6ca] bg-white text-[#5f4a3f] hover:text-[#211a16]',
                        ].join(' ')}
                      >
                        Not sure
                      </button>

                      {roastLevelOptions.map((option) => {
                        const active = roastLevel === option;

                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setRoastLevel(active ? '' : option)}
                            className={[
                              'rounded-xl border px-3 py-2 text-sm font-semibold transition',
                              active
                                ? 'border-[#211a16] bg-[#211a16] text-white'
                                : 'border-[#e2d6ca] bg-white text-[#5f4a3f] hover:text-[#211a16]',
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

                <section className="space-y-3 rounded-[24px] border border-[#eadfd6] bg-white/80 p-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a4d2a]">
                      Flavor wheel
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#6f5b50]">
                      Select all the flavors you can identify in the cup.
                    </p>
                  </div>

                  <FlavorWheel flavors={flavors} setFlavors={setFlavors} />
                </section>

                <section className="space-y-4 rounded-[24px] border border-[#eadfd6] bg-white/80 p-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a4d2a]">
                      Tasting scores
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#6f5b50]">
                      Score each quality from 1 to 5, or leave it empty.
                    </p>
                  </div>

                  {tastingScores.map((score) => (
                    <div key={score.label} className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-[#211a16]">
                        {score.label}
                      </span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() =>
                              score.setValue(score.value === value ? '' : value)
                            }
                            className={[
                              'flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition',
                              score.value === value
                                ? 'border-[#211a16] bg-[#211a16] text-white'
                                : 'border-[#e2d6ca] bg-white text-[#5f4a3f] hover:border-[#7a4d2a]',
                            ].join(' ')}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                <section className="space-y-3 rounded-[24px] border border-[#eadfd6] bg-white/80 p-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#7a4d2a]">
                      Notes
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#6f5b50]">
                      Short tasting notes are enough.
                    </p>
                  </div>
                  <textarea
                    placeholder="Tasting notes..."
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="h-28 w-full rounded-xl border border-[#e2d6ca] bg-white px-3 py-2.5 outline-none transition focus:border-[#211a16]"
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
