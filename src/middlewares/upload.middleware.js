import multer from 'multer';
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary,
    params : {
        folder: "videos", 
        resource_type: "video", 
        allowedFormats: ["mp4", "mov", "avi", "mkv"] 
    }
})

const upload = multer({ storage });

export { upload };

