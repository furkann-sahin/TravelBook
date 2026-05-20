const router = require("express").Router();
const guideController = require("../controllers/guide-controller");

// GET /api/guides - Tüm tur rehberlerini listele
router.get("/", guideController.getAllGuides);

module.exports = router;
