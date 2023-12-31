import multer from "multer";
import * as fs from "fs";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const createStorageEngine = () => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = 'temp_uploads/';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      let fileName = uuidv4() + path.extname(file.originalname);
      req.tempFilePath = `temp_uploads/${fileName}`.replace(/\\/g, '/');;
      cb(null, fileName);
    }
  });
}

export const upload = (req, res, next) => {
  const multerUpload = multer({ storage: createStorageEngine() }).single("profile_image");

  multerUpload(req, res, (err) => {
    if (err) {
      // Handle multer error
      console.log(err)
      return res.status(500).send("File upload failed");
    }
    // File upload successful
    // Access req.filePath to get the file path
    next();
  });
};