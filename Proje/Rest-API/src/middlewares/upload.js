const fs = require("fs");
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function createImageUpload(relativeDirectory, options = {}) {
  const uploadDirectory = path.join(__dirname, "../../public", relativeDirectory);

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      fs.mkdirSync(uploadDirectory, { recursive: true });
      cb(null, uploadDirectory);
    },
    filename: (_req, file, cb) => {
      const uniqueSuffix = crypto.randomBytes(8).toString("hex");
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}-${uniqueSuffix}${ext}`);
    },
  });

  const fileFilter = (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const isAllowedType = allowedMimeTypes.includes(file.mimetype);
    const isAllowedExtension = allowedExtensions.has(extension);

    if (isAllowedType && isAllowedExtension) {
      cb(null, true);
      return;
    }

    cb(new Error("Yalnızca JPEG, PNG, WebP ve GIF formatları desteklenir"), false);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: options.fileSize ?? 5 * 1024 * 1024 },
  });
}

const tourUpload = createImageUpload("images/tours");

module.exports = tourUpload;
module.exports.createImageUpload = createImageUpload;
