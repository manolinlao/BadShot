import { useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, RotateCcw, X } from 'lucide-react';

interface PhotoPickerProps {
  imageUrl: string;
  onImageSelected: (file: File) => void;
}

export function PhotoPicker({ imageUrl, onImageSelected }: PhotoPickerProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const libraryInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState('');

  const supportsCamera =
    typeof navigator !== 'undefined' &&
    Boolean(navigator.mediaDevices?.getUserMedia) &&
    typeof window !== 'undefined' &&
    window.isSecureContext;

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setCameraReady(false);
  };

  const openCamera = async () => {
    if (!supportsCamera) {
      cameraInputRef.current?.click();
      return;
    }

    setCameraError('');
    setCameraOpen(true);
  };

  const openLibrary = () => libraryInputRef.current?.click();

  const handleImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = '';
    if (!file) return;

    // el componente no ha de decidir cómo persistir la imagen
    onImageSelected(file);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || !video.videoWidth || !video.videoHeight) {
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], `badshot-${Date.now()}.jpg`, {
        type: 'image/jpeg',
      });

      onImageSelected(file);
      setCameraOpen(false);
    }, 'image/jpeg', 0.92);
  };

  useEffect(() => {
    if (!cameraOpen) {
      stopCamera();
      return;
    }

    let active = true;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraReady(true);
        }
      } catch {
        setCameraError(
          'We could not open the camera. You can use the library instead.',
        );
      }
    };

    void startCamera();

    return () => {
      active = false;
      stopCamera();
    };
  }, [cameraOpen]);

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-[30px] border border-[#e2d6ca] bg-[linear-gradient(180deg,#fffaf5_0%,#fbf2e7_100%)] shadow-[0_12px_28px_rgba(49,33,20,0.06)]">
        <button
          type="button"
          onClick={openCamera}
          className="group block w-full text-left"
          aria-label={imageUrl ? 'Replace shot photo' : 'Open camera'}
        >
          {imageUrl ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Selected espresso shot"
                className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.015]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,transparent_40%,rgba(0,0,0,0.4)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <div className="min-w-0">
                  <span className="inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                    <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                    Photo ready
                  </span>
                  <p className="mt-2 max-w-xs text-sm font-semibold text-white">
                    Tap to replace it with a new shot.
                  </p>
                </div>
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/90 text-[#7a4d2a] shadow-sm backdrop-blur-sm">
                  <RotateCcw className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[268px] flex-col items-center justify-center gap-4 px-6 py-8 text-center text-[#5f4a3f]">
              <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#211a16] text-white shadow-[0_12px_24px_rgba(33,26,22,0.18)] transition group-hover:scale-[1.02]">
                <Camera className="h-7 w-7" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                <span className="block text-[0.95rem] font-black uppercase tracking-[0.18em] text-[#211a16]">
                  Open camera
                </span>
                <p className="mx-auto max-w-sm text-sm leading-6 text-[#6f5b50]">
                  Tap here to take a photo with your camera. If the device has
                  no camera, we will fall back to your library.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#e2d6ca] bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7a4d2a]">
                  Camera first
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#e2d6ca] bg-white/85 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#7a4d2a]">
                  Mobile friendly
                </span>
              </div>
            </div>
          )}
        </button>

      </div>

      {cameraOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-2xl overflow-hidden rounded-[32px] border border-white/10 bg-[#17120f] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
              <div>
                <p className="text-sm font-semibold">Camera</p>
                <p className="text-xs text-white/65">
                  Tap capture to use the photo or switch to library.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setCameraOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10"
                aria-label="Close camera"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="aspect-[4/3] w-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="space-y-3 px-4 py-4 text-white">
              {cameraError ? (
                <p className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
                  {cameraError}
                </p>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={capturePhoto}
                  disabled={!cameraReady}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#11100f] transition hover:bg-[#f4ede6] disabled:cursor-not-allowed disabled:bg-white/40"
                >
                  <Camera className="h-4 w-4" aria-hidden="true" />
                  Capture photo
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCameraOpen(false);
                    openLibrary();
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <ImagePlus className="h-4 w-4" aria-hidden="true" />
                  Use library
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImage}
      />

      <input
        ref={libraryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImage}
      />
    </div>
  );
}
