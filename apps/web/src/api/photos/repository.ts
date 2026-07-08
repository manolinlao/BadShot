import { savePhoto } from './db';
import type { PhotoEntry } from './types';

const THUMBNAIL_MAX_SIZE = 768;
const THUMBNAIL_QUALITY = 0.9;

export async function savePhotoFromFile(photo: PhotoEntry): Promise<void> {
  const thumbnailBlob = await createThumbnailBlob(photo.blob);

  await savePhoto({
    ...photo,
    thumbnailBlob,
  });
}

async function createThumbnailBlob(blob: Blob): Promise<Blob> {
  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = await loadImage(objectUrl);
    const { width, height } = getThumbnailSize(
      image.naturalWidth,
      image.naturalHeight,
    );

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');

    if (!context) {
      return blob;
    }

    context.drawImage(image, 0, 0, width, height);

    const thumbnail = await canvasToBlob(canvas, blob.type);
    return thumbnail ?? blob;
  } catch {
    return blob;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Failed to load image'));
    image.src = src;
  });
}

function getThumbnailSize(
  originalWidth: number,
  originalHeight: number,
): { width: number; height: number } {
  if (originalWidth <= THUMBNAIL_MAX_SIZE && originalHeight <= THUMBNAIL_MAX_SIZE) {
    return {
      width: originalWidth,
      height: originalHeight,
    };
  }

  const ratio = Math.min(
    THUMBNAIL_MAX_SIZE / originalWidth,
    THUMBNAIL_MAX_SIZE / originalHeight,
  );

  return {
    width: Math.max(1, Math.round(originalWidth * ratio)),
    height: Math.max(1, Math.round(originalHeight * ratio)),
  };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type || 'image/jpeg', THUMBNAIL_QUALITY);
  });
}
