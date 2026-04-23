const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const { createImageUpload } = require("../middlewares/upload");
const companyController = require("../controllers/company-controller");

const upload = createImageUpload("uploads/companies");

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
