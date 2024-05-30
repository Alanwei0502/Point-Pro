import multer from 'multer';

const storage = multer.memoryStorage();
const fileSize = 2 * 1024 * 1024; // 2MB, default: 1,048,576(1MB = 1,024 * 1,024)

export const uploadImage = multer({
  storage, // default: diskStorage, but we don't need to save the file to disk. We just need the buffer. So, we use memoryStorage.
  limits: {
    fileSize,
  },
  fileFilter(req, file, cb) {
    const ext = file.mimetype.split('/')[1];
    const allowedFileType = ['jpg', 'jpeg', 'png'];

    if (!ext) {
      return cb(new Error('File extension is missing.'));
    } else if (!allowedFileType.includes(ext)) {
      return cb(new Error('File extension is not allowed.'));
    } else if (file.size > fileSize) {
      return cb(new Error('File size exceeds 2MB.'));
    } else {
      cb(null, true);
    }
  },
});

export const multerUploadMiddleware = uploadImage.single('image');
