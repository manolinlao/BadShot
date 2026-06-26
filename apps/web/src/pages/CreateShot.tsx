import { useEffect, useMemo, useState } from 'react';
import { Camera, MapPin, Sparkles } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { DetailsSheet } from '../components/CreateShot/DetailsSheet';
import { PhotoPicker } from '../components/CreateShot/PhotoPicker';
import { RatingQuick } from '../components/CreateShot/RatingQuick';
import type { RoastLevel } from '../domain/coffee/roastLevel';
import { useShots } from '../hooks/useShots';
import type { Shot } from '../types';
import { deletePhoto, savePhoto } from '../api/photos/db';
import { getPhotoPreviewUrl } from '../domain/photo/getPhotoPreviewUrl';

export function CreateShot() {
  const navigate = useNavigate();
  const { shotId } = useParams();
  const { addShot, createdShots, updateShot } = useShots();
  const editingShot = useMemo(
    () => createdShots.find((shot) => shot.id === shotId),
    [createdShots, shotId],
  );
  const editing = Boolean(shotId);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editLoaded, setEditLoaded] = useState(false);

  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rating, setRating] = useState(3);
  const [location, setLocation] = useState('');

  const [coffeeName, setCoffeeName] = useState('');
  const [origin, setOrigin] = useState('');
  const [roaster, setRoaster] = useState('');
  const [roastLevel, setRoastLevel] = useState<RoastLevel | ''>('');
  const [doseIn, setDoseIn] = useState<number | ''>('');
  const [doseOut, setDoseOut] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const canSave = Boolean(imageUrl || editingShot?.photoId?.length);

  useEffect(() => {
    if (!editingShot || editLoaded) return;

    const loadShot = async () => {
      if (editingShot.photoId) {
        const previewUrl = await getPhotoPreviewUrl(editingShot.photoId);

        if (previewUrl) {
          setImageUrl(previewUrl);
        }
      }

      setRating(editingShot.rating ?? 3);
      setLocation(editingShot.location?.name ?? '');
      setCoffeeName(editingShot.coffee.name ?? '');
      setOrigin(editingShot.coffee.origin ?? '');
      setRoaster(editingShot.coffee.roaster ?? '');
      setRoastLevel(editingShot.coffee.roastLevel ?? '');
      setDoseIn(editingShot.recipe?.doseIn ?? '');
      setDoseOut(editingShot.recipe?.doseOut ?? '');
      setTime(editingShot.recipe?.time ?? '');
      setNotes(editingShot.tastingNotes ?? '');

      setEditLoaded(true);
    };

    void loadShot();
  }, [editLoaded, editingShot]);

  const handlePhotoSelected = (file: File) => {
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!canSave) return;

    const shotId = editingShot?.id ?? `shot-${Date.now()}`;
    let photoId: string | undefined;

    if (selectedFile) {
      if (editingShot?.photoId) {
        await deletePhoto(editingShot.photoId);
      }

      photoId = `photo-${Date.now()}`;

      await savePhoto({
        id: photoId,
        shotId,
        blob: selectedFile,
      });
    }

    const shot: Shot = {
      id: shotId,
      user: editingShot?.user ?? { displayName: 'You', username: 'local' },

      rating,

      location: location ? { name: location } : { name: 'Home' },

      coffee: {
        name: coffeeName,
        origin,
        roaster,
        roastLevel: roastLevel || undefined,
      },

      recipe: {
        doseIn: doseIn ? Number(doseIn) : undefined,
        doseOut: doseOut ? Number(doseOut) : undefined,
        time: time ? Number(time) : undefined,
      },

      tastingNotes: notes,

      likesCount: editingShot?.likesCount ?? 0,
      commentsCount: editingShot?.commentsCount ?? 0,
      brewedAt: editingShot?.brewedAt ?? new Date().toISOString(),
      createdAt: editingShot?.createdAt ?? new Date().toISOString(),

      photoId: photoId ?? editingShot?.photoId,
    };

    if (editingShot) {
      updateShot(shot);
      navigate('/', { state: { flash: 'Shot updated' } });
      return;
    }

    addShot(shot);
    navigate('/', { state: { flash: 'Shot saved' } });
  };

  return (
    <div className="mx-auto max-w-md space-y-4 pb-28">
      <section className="space-y-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 text-white">
            <Camera className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Photo
            </p>
            <p className="text-sm text-zinc-500">
              Start with the espresso shot itself.
            </p>
          </div>
        </div>

        <PhotoPicker
          imageUrl={imageUrl}
          onImageSelected={handlePhotoSelected}
        />
      </section>

      <section className="space-y-3 rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#7a4d2a] text-white">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Location
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Where this espresso was brewed.
            </p>
          </div>
        </div>

        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 px-3 py-3 text-base outline-none transition focus:border-zinc-900"
        />
      </section>

      <section className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Rating
        </p>
        <RatingQuick value={rating} onChange={setRating} />
      </section>

      <section className="space-y-2 rounded-2xl border border-zinc-100 bg-white p-3 shadow-sm">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
            Optional details
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            Add coffee info, recipe and notes if you want a fuller shot.
          </p>
        </div>

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
          roastLevel={roastLevel}
          setRoastLevel={setRoastLevel}
          doseIn={doseIn}
          setDoseIn={setDoseIn}
          doseOut={doseOut}
          setDoseOut={setDoseOut}
          time={time}
          setTime={setTime}
          notes={notes}
          setNotes={setNotes}
        />
      </section>

      <button
        onClick={handleSave}
        disabled={!canSave}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-white shadow-lg shadow-black/10 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:hover:bg-zinc-300"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        {editing ? 'Update shot' : 'Save shot'}
      </button>
    </div>
  );
}
