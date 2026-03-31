const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const companyController = require("../controllers/company-controller");

// Get company detail
router.get("/:companyId", companyController.getCompanyDetail);

// Update company profile
router.put("/:companyId", requireAuth, companyController.updateCompany);

// Delete company account
router.delete("/:companyId", requireAuth, companyController.deleteCompany);

module.exports = router;
