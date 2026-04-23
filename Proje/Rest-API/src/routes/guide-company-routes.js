const router = require("express").Router();
const { requireAuth, requireRole } = require("../middlewares/auth");
const guideCompanyController = require("../controllers/guide-company-controller");

// Rehberin kayıtlı firmalarını listele
router.get("/:guideId/companies", requireAuth, requireRole("guide"), guideCompanyController.listSavedGuideCompanies);

// Rehber firmaya kayıt ol
router.post("/:guideId/companies", requireAuth, requireRole("guide"), guideCompanyController.applyToCompany);

// Rehber firma kaydını sil
router.delete("/:guideId/companies/:companyId", requireAuth, requireRole("guide"), guideCompanyController.removeFromCompany);

module.exports = router;
