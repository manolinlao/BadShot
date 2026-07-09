import { useRef } from 'react';
import { Camera } from 'lucide-react';

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
      className="group block w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 text-left transition hover:border-zinc-900"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Selected espresso shot"
          className="aspect-square w-full object-cover transition group-hover:scale-[1.01]"
        />
      ) : (
        <div className="flex aspect-square flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-300 bg-white px-6 text-center text-zinc-500">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-900 text-white transition group-hover:scale-105">
            <Camera size={22} aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <span className="block text-sm font-semibold text-zinc-900">
              Tap to add photo
            </span>
            <span className="block text-xs leading-5 text-zinc-500">
              Take a new shot or choose one from your device.
            </span>
          </div>
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
