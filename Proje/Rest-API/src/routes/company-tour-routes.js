const router = require("express").Router();
const { requireAuth, requireRole } = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const companyTourController = require("../controllers/company-tour-controller");
const validate = require("../middlewares/validate");
const {
  companyIdParamsSchema,
  companyTourParamsSchema,
  createTourBodySchema,
  updateTourBodySchema,
} = require("../validations/tour-schemas");

// List company tours
router.get(
  "/:companyId/tours",
  requireAuth,
  requireRole("company"),
  validate({ params: companyIdParamsSchema }),
  companyTourController.listCompanyTours,
);

// Create a new tour (with optional image upload)
router.post(
  "/:companyId/tours",
  requireAuth,
  requireRole("company"),
  upload.single("image"),
  validate({ params: companyIdParamsSchema, body: createTourBodySchema }),
  companyTourController.createTour,
);

// List all guides for tour assignment
router.get(
  "/:companyId/guides",
  requireAuth,
  requireRole("company"),
  validate({ params: companyIdParamsSchema }),
  companyTourController.listCompanyGuides,
);

// Get a single tour detail
router.get(
  "/:companyId/tours/:tourId",
  requireAuth,
  requireRole("company"),
  validate({ params: companyTourParamsSchema }),
  companyTourController.getCompanyTourDetail,
);

// Update a tour
router.put(
  "/:companyId/tours/:tourId",
  requireAuth,
  requireRole("company"),
  validate({ params: companyTourParamsSchema, body: updateTourBodySchema }),
  companyTourController.updateCompanyTour,
);

// Delete a tour
router.delete(
  "/:companyId/tours/:tourId",
  requireAuth,
  requireRole("company"),
  validate({ params: companyTourParamsSchema }),
  companyTourController.deleteCompanyTour,
);

module.exports = router;
