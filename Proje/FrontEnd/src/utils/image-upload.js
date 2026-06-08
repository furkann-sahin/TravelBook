export const IMAGE_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const IMAGE_UPLOAD_MAX_SIZE_BYTES = 5 * 1024 * 1024;

export const IMAGE_UPLOAD_ACCEPT = IMAGE_UPLOAD_MIME_TYPES.join(",");

export function validateImageFile(file) {
  if (!file) return "Yüklenecek görsel bulunamadı.";

  if (!IMAGE_UPLOAD_MIME_TYPES.includes(file.type)) {
    return "Yalnızca JPEG, PNG, WebP ve GIF formatları desteklenir.";
  }

  if (file.size > IMAGE_UPLOAD_MAX_SIZE_BYTES) {
    return "Dosya boyutu en fazla 5 MB olmalıdır.";
  }

  return null;
}

export function createImagePreviewUrl(file) {
  if (!file) return null;
  return URL.createObjectURL(file);
}

export function revokeImagePreviewUrl(url) {
  if (typeof url === "string" && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}
