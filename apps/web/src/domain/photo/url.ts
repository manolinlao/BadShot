export function createPhotoUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function revokePhotoUrl(url: string): void {
  URL.revokeObjectURL(url);
}
