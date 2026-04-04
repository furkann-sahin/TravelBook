const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const companyTourController = require("../controllers/company-tour-controller");

// List company tours
router.get(
  "/:companyId/tours",
  requireAuth,
  companyTourController.listCompanyTours,
);

// Create a new tour (with optional image upload)
router.post(
  "/:companyId/tours",
  requireAuth,
  upload.single("image"),
  companyTourController.createTour,
);

// List all guides for tour assignment
router.get(
  "/:companyId/guides",
  requireAuth,
  companyTourController.listCompanyGuides,
);

module.exports = router;
