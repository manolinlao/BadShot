import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RatingQuick } from '../components/shot/RatingQuick';
import { useLocalShots } from '../hooks/useLocalShots';
import type { Shot } from '../types/shot';

export function CreateShot() {
  const navigate = useNavigate();
  const { addShot } = useLocalShots();

  const fileRef = useRef<HTMLInputElement>(null);

  const [sheetOpen, setSheetOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(3);
  const [location, setLocation] = useState('');

  const [coffeeName, setCoffeeName] = useState('');
  const [origin, setOrigin] = useState('');
  const [roaster, setRoaster] = useState('');
  const [doseIn, setDoseIn] = useState('');
  const [doseOut, setDoseOut] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const touchStartY = useRef<number | null>(null);

  /* ---------------- LOCK SCROLL ---------------- */
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : '';
  }, [sheetOpen]);

  /* ---------------- CAMERA ---------------- */
  const openCamera = () => fileRef.current?.click();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
  };

  /* ---------------- DRAG TO CLOSE ---------------- */
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;

    const diff = e.touches[0].clientY - touchStartY.current;

    if (diff > 160) {
      setSheetOpen(false);
      touchStartY.current = null;
    }
  };

  const onTouchEnd = () => {
    touchStartY.current = null;
  };

  /* ---------------- SAVE ---------------- */
  const handleSave = () => {
    if (!imageUrl) return;

    const shot: Shot = {
      id: `shot-${Date.now()}`,
      user: { displayName: 'You', username: 'local' },

      imageUrl,
      rating,

      location: location ? { name: location } : { name: 'Home' },

      coffee: {
        name: coffeeName,
        origin,
        roaster
      },

      recipe: {
        doseIn: doseIn ? Number(doseIn) : undefined,
        doseOut: doseOut ? Number(doseOut) : undefined,
        time: time ? Number(time) : undefined
      },

      tastingNotes: notes,

      likesCount: 0,
      commentsCount: 0,
      brewedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    addShot(shot);
    navigate('/');
  };

  return (
    <div className='max-w-md mx-auto space-y-5'>
      <h1 className='text-xl font-bold text-center'>New shot</h1>

      {/* PHOTO */}
      <div onClick={openCamera} className='cursor-pointer'>
        {imageUrl ? (
          <img src={imageUrl} className='rounded-2xl w-full' />
        ) : (
          <div className='h-64 border-dashed border-2 flex items-center justify-center rounded-2xl text-zinc-400'>
            📸 Tap to take photo
          </div>
        )}

        <input
          ref={fileRef}
          type='file'
          accept='image/*'
          capture='environment'
          className='hidden'
          onChange={handleImage}
        />
      </div>

      {/* QUICK */}
      <input
        placeholder='Location'
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className='w-full border rounded-xl px-3 py-2'
      />

      <RatingQuick value={rating} onChange={setRating} />

      {/* OPEN SHEET BUTTON */}
      <button
        onClick={() => setSheetOpen(true)}
        className='group flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-600 hover:text-zinc-900 transition'
      >
        <div className='flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-white group-hover:scale-110 transition'>
          <Sparkles size={13} />
        </div>
        Add details
      </button>

      {/* SHEET */}
      <AnimatePresence>
        {sheetOpen && (
          <div className='fixed inset-0 z-50 flex items-end'>
            {/* OVERLAY */}

            <motion.div
              className='absolute inset-0 bg-black/40 backdrop-blur-sm'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                opacity: sheetOpen ? 1 : 0
              }}
              onClick={() => setSheetOpen(false)}
            />

            {/* SHEET */}
            <motion.div
              className='relative w-full bg-white rounded-t-3xl shadow-2xl max-h-[88vh] flex flex-col'
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
                  setSheetOpen(false);
                }
              }}
            >
              {/* HANDLE */}
              <div className='py-3'>
                <div className='w-12 h-1.5 bg-zinc-300 rounded-full mx-auto' />
              </div>

              {/* HEADER */}
              <div className='px-5 pb-3 flex justify-between items-center border-b border-zinc-100'>
                <h2 className='font-semibold'>Details</h2>

                <button
                  onClick={() => setSheetOpen(false)}
                  className='text-sm text-zinc-500 hover:text-zinc-900'
                >
                  Close
                </button>
              </div>

              {/* CONTENT */}
              <div className='flex-1 overflow-y-auto px-5 py-4 space-y-5'>
                {/* Coffee */}
                <section className='rounded-2xl bg-zinc-50 p-4 space-y-3 border border-zinc-100'>
                  <p className='text-[11px] uppercase tracking-widest text-zinc-400'>Coffee</p>
                  <input
                    placeholder='Name'
                    value={coffeeName}
                    onChange={(e) => setCoffeeName(e.target.value)}
                    className='w-full border rounded-xl px-3 py-2'
                  />

                  <div className='grid grid-cols-2 gap-2'>
                    <input
                      placeholder='Origin'
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className='border rounded-xl px-3 py-2'
                    />

                    <input
                      placeholder='Roaster'
                      value={roaster}
                      onChange={(e) => setRoaster(e.target.value)}
                      className='border rounded-xl px-3 py-2'
                    />
                  </div>
                </section>

                {/* Recipe */}
                <section className='rounded-2xl bg-zinc-900 text-white p-4 space-y-3'>
                  <p className='text-[11px] uppercase tracking-widest text-zinc-400'>Recipe</p>

                  <div className='grid grid-cols-3 gap-2'>
                    <input
                      className='bg-white/10 rounded-xl px-3 py-2 text-center'
                      placeholder='18g'
                    />
                    <input
                      className='bg-white/10 rounded-xl px-3 py-2 text-center'
                      placeholder='42g'
                    />
                    <input
                      className='bg-white/10 rounded-xl px-3 py-2 text-center'
                      placeholder='31s'
                    />
                  </div>
                </section>

                {/* Notes */}
                <section className='rounded-2xl bg-zinc-50 p-4 space-y-3 border border-zinc-100'>
                  <p className='text-[11px] uppercase tracking-widest text-zinc-400'>Notes</p>
                  <textarea
                    placeholder='Tasting notes...'
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className='w-full border rounded-xl px-3 py-2 h-28'
                  />
                </section>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SAVE */}
      <button
        onClick={handleSave}
        className='w-full bg-black text-white py-3 rounded-xl hover:bg-zinc-800 transition'
      >
        Save shot
      </button>
    </div>
  );
}
