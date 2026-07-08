export interface PhotoEntry {
  id: string;
  shotId: string;
  blob: Blob;
  thumbnailBlob?: Blob;
}
