import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RatingQuick } from '../components/shot/RatingQuick';
import { useLocalShots } from '../hooks/useLocalShots';
import type { Shot } from '../types/shot';

export function CreateShot() {
  const navigate = useNavigate();
  const { addShot } = useLocalShots();

  const fileRef = useRef<HTMLInputElement>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const touchStartY = useRef<number | null>(null);

  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(3);
  const [location, setLocation] = useState('');

  // extra fields (optional)
  const [coffeeName, setCoffeeName] = useState('');
  const [origin, setOrigin] = useState('');
  const [roaster, setRoaster] = useState('');
  const [doseIn, setDoseIn] = useState('');
  const [doseOut, setDoseOut] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  // autofocus al abrir
  useEffect(() => {
    if (sheetOpen) {
      const firstInput = sheetRef.current?.querySelector('input') as HTMLInputElement | null;

      firstInput?.focus();
    }
  }, [sheetOpen]);

  // bloqueo del scroll del fondo
  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [sheetOpen]);

  const openCamera = () => fileRef.current?.click();

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUrl(URL.createObjectURL(file));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const start = touchStartY.current;
    if (!start) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - start;

    // si arrastras hacia abajo mucho → cerrar
    if (diff > 120) {
      setSheetOpen(false);
      touchStartY.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  const handleSave = () => {
    if (!imageUrl) return;

    const shot: Shot = {
      id: `shot-${Date.now()}`,
      user: { displayName: 'You', username: 'local' },

      imageUrl,
      rating,

      location: location ? { name: location } : { name: 'Home' },

      coffee: sheetOpen
        ? {
            name: coffeeName,
            origin,
            roaster
          }
        : {},

      recipe: sheetOpen
        ? {
            doseIn: doseIn ? Number(doseIn) : undefined,
            doseOut: doseOut ? Number(doseOut) : undefined,
            time: time ? Number(time) : undefined
          }
        : {},

      tastingNotes: sheetOpen ? notes : undefined,

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
          <img src={imageUrl} className='rounded-xl w-full' />
        ) : (
          <div className='h-64 border-dashed border-2 flex items-center justify-center rounded-xl'>
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

      {/* QUICK FIELDS */}
      <input
        placeholder='Location (optional)'
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className='w-full border rounded px-3 py-2'
      />

      <RatingQuick value={rating} onChange={setRating} />

      {/* EXPAND BUTTON */}
      <button
        onClick={() => setSheetOpen(true)}
        className='flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-black transition w-full cursor-pointer'
      >
        <span className='text-lg'>+</span>
        <span>Add details</span>
      </button>

      {sheetOpen && (
        <div className='fixed inset-0 z-50'>
          {/* overlay con blur */}
          <div
            className='absolute inset-0 bg-black/40 backdrop-blur-sm'
            onClick={() => setSheetOpen(false)}
          />

          {/* sheet */}
          <div
            ref={sheetRef}
            className='absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-4 max-h-[85vh] overflow-y-auto animate-slideUp shadow-2xl'
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* handle */}
            <div className='w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-3' />

            {/* header */}
            <div className='flex justify-between items-center mb-4'>
              <h2 className='font-semibold'>Details</h2>

              <button onClick={() => setSheetOpen(false)} className='text-sm text-gray-500'>
                Close
              </button>
            </div>

            {/* inputs */}
            <div className='space-y-3'>
              <input
                placeholder='Coffee name'
                value={coffeeName}
                onChange={(e) => setCoffeeName(e.target.value)}
                className='input'
              />

              <input
                placeholder='Origin'
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className='input'
              />

              <input
                placeholder='Roaster'
                value={roaster}
                onChange={(e) => setRoaster(e.target.value)}
                className='input'
              />

              <div className='grid grid-cols-3 gap-2'>
                <input
                  placeholder='In'
                  value={doseIn}
                  onChange={(e) => setDoseIn(e.target.value)}
                  className='input'
                />

                <input
                  placeholder='Out'
                  value={doseOut}
                  onChange={(e) => setDoseOut(e.target.value)}
                  className='input'
                />

                <input
                  placeholder='Time'
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className='input'
                />
              </div>

              <textarea
                placeholder='Tasting notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className='input h-24'
              />
            </div>
          </div>
        </div>
      )}

      {/* SAVE */}
      <button
        onClick={handleSave}
        className='w-full bg-black text-white py-3 rounded-xl cursor-pointer hover:bg-gray-800 transition'
      >
        Save shot
      </button>
    </div>
  );
}
