import fs from 'node:fs';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import multer from 'multer';
import sharp from 'sharp';

export const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const extensionsByMimeType: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/heic': '.heic',
  'image/heif': '.heif',
};

const storage = multer.diskStorage({
  destination: (_request, _file, callback) => {
    callback(null, uploadDir);
  },
  filename: (_request, file, callback) => {
    const extension = extensionsByMimeType[file.mimetype] ?? '.bin';
    callback(null, `${randomUUID()}${extension}`);
  },
});

export const shotImageUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (_request, file, callback) => {
    if (!extensionsByMimeType[file.mimetype]) {
      callback(new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF'));
      return;
    }

    callback(null, true);
  },
});

export async function normalizeUploadedImage(
  file: Express.Multer.File,
): Promise<string> {
  const isHeic = file.mimetype === 'image/heic' || file.mimetype === 'image/heif';

  if (!isHeic) {
    return file.filename;
  }

  const outputFilename = `${randomUUID()}.jpg`;
  const outputPath = path.join(uploadDir, outputFilename);

  try {
    await sharp(file.path).jpeg({ quality: 85 }).toFile(outputPath);
    await unlink(file.path);
    return outputFilename;
  } catch (error) {
    await unlink(file.path).catch(() => undefined);
    await unlink(outputPath).catch(() => undefined);
    throw error;
  }
}
