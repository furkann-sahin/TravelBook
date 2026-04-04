const router = require("express").Router();
const guideTourController = require("../controllers/guide-tour-controller");

router.get("/:guideId/tours", guideTourController.listGuideTours);
router.post("/:guideId/tours", guideTourController.assignGuideToTour);
router.delete("/:guideId/tours/:tourId", guideTourController.removeGuideFromTour);

module.exports = router;