import { diskStorage } from "multer";
import { extname } from "path/win32";

export const multerConfig = {
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            cb(null, uniqueSuffix + extname(file.originalname));
        }
    }),
    limits: {
        fileSize: 100 * 1024 * 1024 // ✅ 100MB limit
    }
};