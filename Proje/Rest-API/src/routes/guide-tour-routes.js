const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const guideTourController = require("../controllers/guide-tour-controller");

router.get("/:guideId/tours", requireAuth, guideTourController.listGuideTours);
router.post("/:guideId/tours", requireAuth, guideTourController.assignGuideToTour);
router.delete("/:guideId/tours/:tourId", requireAuth, guideTourController.removeGuideFromTour);

module.exports = router;