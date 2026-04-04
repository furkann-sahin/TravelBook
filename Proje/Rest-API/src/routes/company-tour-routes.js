const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const companyTourController = require("../controllers/company-tour-controller");

// List company tours
router.get(
  "/:companyId/tours",
  requireAuth,
  companyTourController.listCompanyTours,
);

module.exports = router;
