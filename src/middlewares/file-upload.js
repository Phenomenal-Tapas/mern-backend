import multer from "multer";
import { v4 as uuid } from "uuid";

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/images");
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, uuid() + "." + ext);
  },
});

const fileUpload = multer({
  limits: 500000,
  storage: storage,
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error("Invalid mimetype file!!");
    cb(error, isValid);
  },
});

export default fileUpload;
