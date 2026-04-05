const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const requireAuth = require("../middlewares/auth");
const companyController = require("../controllers/company-controller");

// Multer storage config for company profile/banner images
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../../public/uploads/companies"));
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${crypto.randomBytes(16).toString("hex")}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(ext && mime ? null : new Error("Sadece resim dosyası yüklenebilir"), ext && mime);
  },
});

// Get company detail
router.get("/:companyId", companyController.getCompanyDetail);

// Update company profile
router.put("/:companyId", requireAuth, companyController.updateCompany);

// Upload profile image
router.post("/:companyId/profile-image", requireAuth, upload.single("image"), companyController.uploadProfileImage);

// Upload banner image
router.post("/:companyId/banner-image", requireAuth, upload.single("image"), companyController.uploadBannerImage);

// Delete company account
router.delete("/:companyId", requireAuth, companyController.deleteCompany);

module.exports = router;
