const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { put } = require("@vercel/blob");

function buildFileName(originalName) {
  const extension = path.extname(originalName || "").toLowerCase() || ".bin";
  return `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`;
}

function normalizeDirectory(relativeDirectory) {
  return String(relativeDirectory || "")
    .replace(/^\/+/, "")
    .replace(/\\/g, "/");
}

async function persistUploadedImage(file, relativeDirectory) {
  if (!file) {
    throw new Error("Yüklenecek dosya bulunamadı");
  }

  const normalizedDirectory = normalizeDirectory(relativeDirectory);
  const fileName = buildFileName(file.originalname);
  const relativeUrl = `/${normalizedDirectory}/${fileName}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`${normalizedDirectory}/${fileName}`, file.buffer, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.mimetype,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return blob.url;
  }

  if (process.env.VERCEL === "1" || process.env.VERCEL === "true") {
    throw new Error("Vercel ortaminda dosya yuklemek icin BLOB_READ_WRITE_TOKEN tanimlanmalidir");
  }

  const uploadDirectory = path.join(__dirname, "../../public", normalizedDirectory);
  fs.mkdirSync(uploadDirectory, { recursive: true });
  fs.writeFileSync(path.join(uploadDirectory, fileName), file.buffer);

  return relativeUrl;
}

module.exports = {
  persistUploadedImage,
};