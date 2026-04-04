const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const guideCompanyController = require("../controllers/guide-company-controller");

// Rehberin kayıtlı firmalarını listele
router.get("/:guideId/companies", requireAuth, guideCompanyController.listSavedGuideCompanies);

// Rehber firmaya kayıt ol
router.post("/:guideId/companies", requireAuth, guideCompanyController.applyToCompany);

// Rehber firma kaydını sil
router.delete("/:guideId/companies/:companyId", requireAuth, guideCompanyController.removeFromCompany);

module.exports = router;
