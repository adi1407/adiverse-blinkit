import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.join(__dirname, "../../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase() || ".jpg";
    const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(ext)
      ? ext
      : ".jpg";
    const name = `img-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}${safeExt}`;
    cb(null, name);
  },
});

function fileFilter(_req, file, cb) {
  if (!file.mimetype?.startsWith("image/")) {
    cb(new Error("Only image uploads are allowed"));
    return;
  }
  cb(null, true);
}

export const uploadMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * Mount on admin router (after requireAdmin): POST /upload
 */
export function registerUploadRoute(router) {
  router.post(
    "/upload",
    (req, res, next) => {
      uploadMiddleware.single("file")(req, res, (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            message: err.message || "Upload failed",
          });
        }
        return next();
      });
    },
    (req, res) => {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image file provided (field name: file)",
        });
      }
      const url = `/uploads/${req.file.filename}`;
      return res.json({
        success: true,
        data: {
          url,
          filename: req.file.filename,
          size: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    }
  );
}
