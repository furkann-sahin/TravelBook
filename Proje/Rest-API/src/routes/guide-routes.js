const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");
const requireAuth = require("../middlewares/auth");
const guideController = require("../controllers/guide-controller");

// Multer storage config for guide profile images
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, "../../public/uploads/guides"));
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

router.get("/", guideController.getAllGuides);
router.get("/companies", guideController.listCompanies);
router.get("/:guideId", guideController.getGuideDetail);
router.put("/:guideId", requireAuth, guideController.updateGuideProfile);
router.delete("/:guideId", requireAuth, guideController.deleteGuide);
router.post("/:guideId/profile-image", requireAuth, upload.single("image"), guideController.uploadProfileImage);

module.exports = router;