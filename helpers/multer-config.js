import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

upload.deleteFile = async (path) => {
    await fs.unlink(path)
}

export default upload