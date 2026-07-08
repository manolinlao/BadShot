import { getPhoto } from '../../api/photos/db';

export async function getPhotoPreviewUrl(
  photoId?: string,
  preferThumbnail = true,
): Promise<string | undefined> {
  if (!photoId) return undefined;

  const photo = await getPhoto(photoId);

  if (!photo) return undefined;

  const blob = preferThumbnail && photo.thumbnailBlob ? photo.thumbnailBlob : photo.blob;

  return createPhotoUrl(blob);
}

export function createPhotoUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokePhotoUrl(url: string): void {
  URL.revokeObjectURL(url);
}
