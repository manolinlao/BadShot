import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import multer from 'multer';

export const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? 'uploads');

fs.mkdirSync(uploadDir, { recursive: true });

const extensionsByMimeType: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
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
