import { useRef } from 'react';
import { Camera, ImagePlus } from 'lucide-react';

interface PhotoPickerProps {
  imageUrl: string;
  onImageSelected: (file: File) => void;
}

export function PhotoPicker({ imageUrl, onImageSelected }: PhotoPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const openCamera = () => fileRef.current?.click();

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // el componente no ha de decidir cómo persistir la imagen
    onImageSelected(file);
  };

  return (
    <button
      type="button"
      onClick={openCamera}
      className="group block w-full overflow-hidden rounded-[28px] border border-[#e2d6ca] bg-[#fffaf5] text-left shadow-[0_10px_24px_rgba(49,33,20,0.05)] transition hover:border-[#7a4d2a] hover:shadow-[0_14px_28px_rgba(49,33,20,0.08)]"
      aria-label={imageUrl ? 'Replace shot photo' : 'Add shot photo'}
    >
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Selected espresso shot"
            className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,transparent_38%,rgba(0,0,0,0.36)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                Photo ready
              </span>
              <p className="mt-2 max-w-xs text-sm font-semibold text-white">
                Tap to replace the current photo.
              </p>
            </div>
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-end rounded-full bg-white/90 text-[#7a4d2a] shadow-sm backdrop-blur-sm sm:self-auto">
              <ImagePlus className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
        </div>
      ) : (
        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-4 border-2 border-dashed border-[#dcc7b5] bg-[radial-gradient(circle_at_top,#fffdfb_0%,#fff5ea_55%,#f2e2d4_100%)] px-6 text-center text-[#5f4a3f]">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#211a16] text-white shadow-sm transition group-hover:scale-105">
            <Camera className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <span className="block text-base font-black text-[#211a16]">
              Add a shot photo
            </span>
            <span className="block text-sm leading-6 text-[#6f5b50]">
              Take a new photo or choose one from your device. This will be
              the anchor of the entry.
            </span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e2d6ca] bg-white/80 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7a4d2a]">
            Best place to start
          </span>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImage}
      />
    </button>
  );
}
