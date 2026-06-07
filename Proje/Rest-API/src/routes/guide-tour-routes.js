const router = require("express").Router();
const { requireAuth, requireRole } = require("../middlewares/auth");
const guideTourController = require("../controllers/guide-tour-controller");
const { cacheMiddleware } = require("../middlewares/cache");

router.get("/:guideId/tours", requireAuth, requireRole("guide"), cacheMiddleware(3600), guideTourController.listGuideTours);
router.post("/:guideId/tours", requireAuth, requireRole("guide"), guideTourController.assignGuideToTour);
router.delete("/:guideId/tours/:tourId", requireAuth, requireRole("guide"), guideTourController.removeGuideFromTour);

module.exports = router;