import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Camera, MapPin, Sparkles } from 'lucide-react';
import { DetailsSheet } from '../components/CreateShot/DetailsSheet';
import { PhotoPicker } from '../components/CreateShot/PhotoPicker';
import { RatingQuick } from '../components/CreateShot/RatingQuick';
import type { RoastLevel } from '../domain/coffee';
import { getPhotoPreviewUrl, revokePhotoUrl } from '../domain/photo';
import { createShot } from '../domain/shot';
import { useShots } from '../hooks/useShots';
import { deletePhoto } from '../api/photos/db';
import { savePhotoFromFile } from '../api/photos/repository';

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
  const [locationName, setLocationName] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationCountry, setLocationCountry] = useState('');

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
      setLocationName(editingShot.location?.name ?? '');
      setLocationCity(editingShot.location?.city ?? '');
      setLocationCountry(editingShot.location?.country ?? '');
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

  useEffect(() => {
    if (!imageUrl) return;

    return () => {
      revokePhotoUrl(imageUrl);
    };
  }, [imageUrl]);

  const handlePhotoSelected = (file: File) => {
    setSelectedFile(file);
    setImageUrl(URL.createObjectURL(file));
  };

  const buildLocation = () => {
    const name = locationName.trim();
    const city = locationCity.trim();
    const country = locationCountry.trim();

    if (!name && !city && !country) {
      return undefined;
    }

    return {
      name: name || city || country,
      ...(city ? { city } : {}),
      ...(country ? { country } : {}),
    };
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

      await savePhotoFromFile({
        id: photoId,
        shotId,
        blob: selectedFile,
      });
    }

    const shot = createShot({
      id: shotId,
      user: editingShot?.user,
      rating,
      location: buildLocation(),
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
      likesCount: editingShot?.likesCount,
      commentsCount: editingShot?.commentsCount,
      createdAt: editingShot?.createdAt,
      photoId: photoId ?? editingShot?.photoId,
    });

    if (editingShot) {
      updateShot(shot);
      navigate('/', { state: { flash: 'Shot updated' } });
      return;
    }

    addShot(shot);
    navigate('/', { state: { flash: 'Shot saved' } });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 pb-28">
      <header className="space-y-4 rounded-[28px] border border-[#e2d6ca] bg-[radial-gradient(circle_at_top_left,#fff7eb_0%,#fffaf5_48%,#f5e9de_100%)] p-4 shadow-[0_12px_28px_rgba(49,33,20,0.05)] sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full border border-[#e2d6ca] bg-white px-3 py-1.5 text-sm font-semibold text-[#5f4a3f] transition hover:border-[#7a4d2a] hover:text-[#211a16]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>

          <div className="flex items-center gap-2 rounded-full border border-[#e2d6ca] bg-white/80 px-3 py-1">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#211a16] text-[10px] font-black text-white">
              B
            </span>
            <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#7a4d2a]">
              Create
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="max-w-lg text-2xl font-black leading-tight text-[#211a16] sm:text-3xl">
            Create a new espresso shot
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[#5f4a3f]">
            Start with the photo, then add the rest only if it helps.
          </p>
        </div>
      </header>

      <section className="space-y-3 rounded-[28px] border border-[#e2d6ca] bg-[linear-gradient(180deg,#fffaf5_0%,#f7efe6_100%)] p-4 shadow-[0_12px_24px_rgba(49,33,20,0.04)]">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#211a16] text-white shadow-sm">
            <Camera className="h-3.5 w-3.5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7a4d2a]">
              1. Photo
            </p>
            <p className="mt-1 text-sm leading-6 text-[#5f4a3f]">
              Start with the photo. It sets the tone for the shot.
            </p>
          </div>
        </div>

        <PhotoPicker
          imageUrl={imageUrl}
          onImageSelected={handlePhotoSelected}
        />
      </section>

      <section className="space-y-4 rounded-[28px] border border-[#e2d6ca] bg-white p-4 shadow-[0_12px_24px_rgba(49,33,20,0.04)]">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#7a4d2a] text-white shadow-sm">
            <MapPin className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7a4d2a]">
              2. Location
            </p>
            <p className="mt-1 text-sm leading-6 text-[#5f4a3f]">
              Add the local name, city or country.
            </p>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <input
            placeholder="Local name"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full rounded-xl border border-[#e2d6ca] px-3 py-3 text-base outline-none transition focus:border-[#211a16]"
          />

          <input
            placeholder="City"
            value={locationCity}
            onChange={(e) => setLocationCity(e.target.value)}
            className="w-full rounded-xl border border-[#e2d6ca] px-3 py-3 text-base outline-none transition focus:border-[#211a16]"
          />
        </div>

        <input
          placeholder="Country"
          value={locationCountry}
          onChange={(e) => setLocationCountry(e.target.value)}
          className="w-full rounded-xl border border-[#e2d6ca] px-3 py-3 text-base outline-none transition focus:border-[#211a16]"
        />
      </section>

      <section className="space-y-3 rounded-[28px] border border-[#e2d6ca] bg-white p-4 shadow-[0_12px_24px_rgba(49,33,20,0.04)]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7a4d2a]">
            3. Rating
          </p>
          <p className="mt-1 text-sm leading-6 text-[#5f4a3f]">
            Use this as a quick first impression.
          </p>
        </div>
        <RatingQuick value={rating} onChange={setRating} />
      </section>

      <section className="space-y-3 rounded-[28px] border border-[#e2d6ca] bg-white p-4 shadow-[0_12px_24px_rgba(49,33,20,0.04)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#7a4d2a]">
            4. Optional details
          </p>
          <p className="mt-1 text-xs leading-5 text-[#6f5b50]">
            Add coffee info, recipe and notes only if you want a fuller shot.
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
        className="flex w-full items-center justify-center gap-2 rounded-[20px] bg-[#211a16] py-3.5 text-white shadow-[0_16px_30px_rgba(33,26,22,0.18)] transition hover:bg-[#2f2621] disabled:cursor-not-allowed disabled:bg-[#d8cec5] disabled:text-[#8f7d70] disabled:shadow-none disabled:hover:bg-[#d8cec5]"
      >
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        {editing ? 'Update shot' : 'Save shot'}
      </button>

      <p className="text-center text-xs text-[#6f5b50]">
        Your shot is saved locally in this browser.
      </p>
    </div>
  );
}
