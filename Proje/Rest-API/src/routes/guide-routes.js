const router = require("express").Router();
const { requireAuth, requireRole } = require("../middlewares/auth");
const { createImageUpload } = require("../middlewares/upload");
const guideController = require("../controllers/guide-controller");

const upload = createImageUpload("uploads/guides");

router.get("/", guideController.getAllGuides);
router.get("/companies", guideController.listCompanies);
router.get("/:guideId", guideController.getGuideDetail);
router.put("/:guideId", requireAuth, requireRole("guide"), guideController.updateGuideProfile);
router.delete("/:guideId", requireAuth, requireRole("guide"), guideController.deleteGuide);
router.post("/:guideId/profile-image", requireAuth, requireRole("guide"), upload.single("image"), guideController.uploadProfileImage);
router.post("/:guideId/banner-image", requireAuth, requireRole("guide"), upload.single("image"), guideController.uploadBannerImage);
router.post("/:guideId/gallery-images", requireAuth, requireRole("guide"), upload.single("image"), guideController.uploadGalleryImage);
router.delete("/:guideId/gallery-images", requireAuth, requireRole("guide"), guideController.removeGalleryImage);

module.exports = router;