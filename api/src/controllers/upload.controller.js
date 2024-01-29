import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";

// Configure multer and storage to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "western-ghat/assets",
    format: async (req, file) => {
      const allowedFormats = ["png", "jpg", "webp", "jpeg"];
      if (allowedFormats.includes(file.mimetype.split("/")[1])) {
        return file.mimetype.split("/")[1];
      } else {
        return "png";
      }
    },
    public_id: (req, file) => uuidv4(),
  },
});
export const uploadImage = multer({ storage });
