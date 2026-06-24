import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShotCard } from '../components/ShotCard';
import { useLocalShots } from '../hooks/useLocalShots';
import type { Shot } from '../types';
import { formatDate } from '../utils/util';
import { getPhotoPreviewUrl } from '../domain/photo/getPhotoPreviewUrl';

type HomeLocationState = {
  flash?: string;
};

export function Home() {
  const { feed, deleteShot, isCreatedShot } = useLocalShots();
  const location = useLocation();
  const navigate = useNavigate();
  const flash = (location.state as HomeLocationState | null)?.flash;
  const [visibleFlash, setVisibleFlash] = useState(flash);
  const [shotToDelete, setShotToDelete] = useState<Shot | null>(null);
  const [previewShot, setPreviewShot] = useState<Shot | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    if (!flash) return;

    navigate('.', { replace: true, state: null });
  }, [flash, navigate]);

  useEffect(() => {
    if (!visibleFlash) return;

    const timeoutId = window.setTimeout(() => {
      setVisibleFlash(undefined);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [visibleFlash]);

  useEffect(() => {
    if (!previewShot) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPreviewShot(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [previewShot]);

  useEffect(() => {
    if (!previewShot?.photoId) {
      setPreviewUrl(undefined);
      return;
    }

    const loadPreview = async () => {
      const url = await getPhotoPreviewUrl(previewShot.photoId);
      setPreviewUrl(url);
    };

    void loadPreview();
  }, [previewShot]);

  const handleConfirmDelete = () => {
    if (!shotToDelete) return;

    deleteShot(shotToDelete.id);
    setShotToDelete(null);
    setVisibleFlash('Shot deleted');
  };

  return (
    <>
      {visibleFlash && (
        <div
          role="status"
          className="fixed inset-x-4 bottom-24 z-20 mx-auto max-w-sm rounded-lg border border-[#d7c5b4] bg-[#211a16] px-4 py-3 text-center text-sm font-bold text-white shadow-lg sm:bottom-6"
        >
          {visibleFlash}
        </div>
      )}

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {feed.map((shot) => (
            <ShotCard
              key={shot.id}
              shot={shot}
              onEdit={
                isCreatedShot(shot.id)
                  ? () => navigate(`/edit/${shot.id}`)
                  : undefined
              }
              onDelete={
                isCreatedShot(shot.id) ? () => setShotToDelete(shot) : undefined
              }
              onImageClick={
                shot.photoId ? () => setPreviewShot(shot) : undefined
              }
            />
          ))}
        </div>

        <aside className="h-fit rounded-lg border border-[#e2d6ca] bg-[#fffaf5] p-5">
          <p className="mb-3 text-sm font-bold uppercase text-[#7a4d2a]">
            BadShot
          </p>
          <h1 className="text-3xl font-black leading-tight">
            Your espresso social journal starts here.
          </h1>
          <p className="mt-4 text-sm leading-6 text-[#4a3a31]">
            This feed now includes shots created in the browser and local mock
            data.
          </p>
        </aside>
      </section>

      {shotToDelete && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-shot-title"
            className="w-full max-w-sm rounded-lg border border-[#e2d6ca] bg-[#fffaf5] p-5 shadow-xl"
          >
            <h2 id="delete-shot-title" className="text-lg font-black">
              Delete this shot?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#5f4a3f]">
              This only deletes the shot saved in this browser.
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShotToDelete(null)}
                className="rounded px-4 py-2 text-sm font-bold text-[#5f4a3f] hover:bg-[#efe5dc]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded bg-red-700 px-4 py-2 text-sm font-bold text-white hover:bg-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {previewShot?.photoId && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="Shot image preview"
          onClick={() => setPreviewShot(null)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewShot(null)}
              className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-2 text-white transition hover:bg-black"
              aria-label="Close image preview"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="mb-3 rounded-2xl bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
              <h2 className="text-lg font-black leading-tight">
                {previewShot.coffee.name?.trim() ||
                  previewShot.coffee.origin?.trim() ||
                  'Untitled shot'}
              </h2>
              <p className="mt-1 text-sm text-white/75">
                {formatDate(previewShot.brewedAt)}
              </p>
            </div>

            {previewUrl && (
              <img
                src={previewUrl}
                alt="Shot preview"
                className="max-h-[85vh] w-full rounded-2xl object-contain shadow-2xl"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
