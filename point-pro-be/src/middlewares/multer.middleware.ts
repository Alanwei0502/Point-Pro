import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
  storage, // default: diskStorage, but we don't need to save the file to disk. We just need the buffer. So, we use memoryStorage.
  limits: {
    fileSize: 2 * 1024 * 1024, // default: 1,048,576(1MB = 1,024 * 1,024)
    files: 1, // default: Infinity
  },
  fileFilter(req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const allowedFileType = ['jpg', 'jpeg', 'png'];

    if (!ext) {
      return cb(new Error('File extension is missing.'));
    } else if (!allowedFileType.includes(ext)) {
      return cb(new Error('File extension is not allowed.'));
    } else if (file.size > 2 * 1024 * 1024) {
      return cb(new Error('File size exceeds 2MB.'));
    } else {
      cb(null, true);
    }
  },
});

export const multerUploadMiddleware = upload.single('image');
