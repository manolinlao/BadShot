import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DetailsSheet } from '../components/CreateShot/DetailsSheet';
import { PhotoPicker } from '../components/CreateShot/PhotoPicker';
import { RatingQuick } from '../components/CreateShot/RatingQuick';
import { useLocalShots } from '../hooks/useLocalShots';
import type { Shot } from '../types/shot';

export function CreateShot() {
  const navigate = useNavigate();
  const { addShot } = useLocalShots();

  const [sheetOpen, setSheetOpen] = useState(false);

  const [imageUrl, setImageUrl] = useState('');
  const [rating, setRating] = useState(3);
  const [location, setLocation] = useState('');

  const [coffeeName, setCoffeeName] = useState('');
  const [origin, setOrigin] = useState('');
  const [roaster, setRoaster] = useState('');
  const [doseIn, setDoseIn] = useState<number | ''>('');
  const [doseOut, setDoseOut] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const canSave = Boolean(imageUrl);

  const handleSave = () => {
    if (!canSave) return;

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
    navigate('/', { state: { flash: 'Shot saved' } });
  };

  return (
    <div className='max-w-md mx-auto space-y-5'>
      <h1 className='text-xl font-bold text-center'>New shot</h1>

      <PhotoPicker imageUrl={imageUrl} onImageSelected={setImageUrl} />

      <input
        placeholder='Location'
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className='w-full border rounded-xl px-3 py-2'
      />

      <RatingQuick value={rating} onChange={setRating} />

      <DetailsSheet
        open={sheetOpen}
        onOpen={() => setSheetOpen(true)}
        onClose={() => setSheetOpen(false)}
        coffeeName={coffeeName}
        setCoffeeName={setCoffeeName}
        origin={origin}
        setOrigin={setOrigin}
        roaster={roaster}
        setRoaster={setRoaster}
        doseIn={doseIn}
        setDoseIn={setDoseIn}
        doseOut={doseOut}
        setDoseOut={setDoseOut}
        time={time}
        setTime={setTime}
        notes={notes}
        setNotes={setNotes}
      />

      <button
        onClick={handleSave}
        disabled={!canSave}
        className='w-full rounded-xl bg-black py-3 text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:hover:bg-zinc-300'
      >
        Save shot
      </button>
    </div>
  );
}
