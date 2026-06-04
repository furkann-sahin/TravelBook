const multer = require("multer");
const path = require("path");

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const allowedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

function createImageUpload(_relativeDirectory, options = {}) {
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
    storage: multer.memoryStorage(),
    fileFilter,
    limits: { fileSize: options.fileSize ?? 5 * 1024 * 1024 },
  });
}

const tourUpload = createImageUpload("images/tours");

module.exports = tourUpload;
module.exports.createImageUpload = createImageUpload;
