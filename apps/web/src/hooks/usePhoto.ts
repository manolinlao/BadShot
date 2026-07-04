import { useEffect, useState } from 'react';
import { getPhotoPreviewUrl } from '../domain/photo';

export function usePhoto(photoId?: string) {
  const [photoUrl, setPhotoUrl] = useState<string>();

  useEffect(() => {
    if (!photoId) {
      setPhotoUrl(undefined);
      return;
    }

    let cancelled = false;

    const loadPhoto = async () => {
      const url = await getPhotoPreviewUrl(photoId);

      if (!cancelled) {
        setPhotoUrl(url);
      }
    };

    void loadPhoto();

    return () => {
      cancelled = true;
    };
  }, [photoId]);

  return photoUrl;
}
