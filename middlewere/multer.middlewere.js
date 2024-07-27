import multer from "multer";
import path, { dirname } from "path";
import fs from "fs";

import { fileURLToPath } from "url";
import customError from "../utils/error.js";
const fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(fileName);
let storage;
try {
  const uploadDir = path.join(__dirname, "../public");

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix);
    },
  });
} catch (error) {
  throw new customError("error while getting directory");
}

const upload = multer({ storage: storage });

export default upload;
