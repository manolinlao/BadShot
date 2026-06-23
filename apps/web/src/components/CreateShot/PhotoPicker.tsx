import { useRef } from 'react';
import { Camera } from 'lucide-react';

interface PhotoPickerProps {
  imageUrl: string;
  onImageSelected: (imageUrl: string) => void;
}

export function PhotoPicker({ imageUrl, onImageSelected }: PhotoPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const openCamera = () => fileRef.current?.click();

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onImageSelected(URL.createObjectURL(file));
  };

  return (
    <div onClick={openCamera} className="cursor-pointer">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Selected espresso shot"
          className="w-full rounded-2xl"
        />
      ) : (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-zinc-400">
          <Camera size={28} aria-hidden="true" />
          <span>Tap to take photo</span>
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
    </div>
  );
}
