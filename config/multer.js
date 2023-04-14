import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

export const multerConfig = {
    dest: path.resolve('public', 'images', 'pets', 'users'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve('public', 'images', 'pets', 'users'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb (err);

                const image_path =  `${hash.toString('hex')}-${file.originalname}`;

                cb(null, image_path);
            });
        }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024, // increase the limit to 5MB
    },
    fileFilter: (req, file, cb) => {
      const allowedMimes = [
        "image/jpeg",
        "image/pjpeg",
        "image/jpg",
        "image/png"
      ];
      if(allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Tipo de arquivo não aceito."));
      }
    }
};

export const uploadAvatar = multer({
  dest: path.resolve('public', 'images', 'user', 'avatar'),
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.resolve('public', 'images', 'user', 'avatar'));
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb (err);

                const image_avatar =  `${hash.toString('hex')}-${file.originalname}`;

                cb(null, image_avatar);
            });
        }
    }),
  limits: {
    fileSize: 5 * 1024 * 1024, // increase the limit to 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/jpg",
      "image/png"
    ];

    if(allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Tipo de arquivo não aceito."));
    }
  }
});

