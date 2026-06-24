import { getPhoto } from '../../api/photos/db';
import { createPhotoUrl } from './url';

export async function getPhotoPreviewUrl(
  photoId?: string,
): Promise<string | undefined> {
  if (!photoId) return undefined;

  const photo = await getPhoto(photoId);

  if (!photo) return undefined;

  return createPhotoUrl(photo.blob);
}
