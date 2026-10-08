import multer from "multer";
import {randomUUID} from "crypto"
import fs from "fs"

export const Localmulter = (customPath = "general", customTypes = []) => {
const pathFolder = `./uploads/${customPath}`;

if (!fs.existsSync(`pathfolder`)) {
    fs.mkdirSync(`pathfolder`, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    
      cb(null, pathFolder);
    },

    filename: (req, file, cb) => {
      cb(null, randomUUID() + "___"+ file.originalname);
    },
  });
function fileFilter(req, file, cb) {
    if (!customTypes.includes(file.mimetype)) {
        cb(new Error("invalid file type"));
    }else {
      cb(null, true);
    }
  }

  const upload = multer({ storage , fileFilter });
  return upload;
};