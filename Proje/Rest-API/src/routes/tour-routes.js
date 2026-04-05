const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const tourController = require("../controllers/tour-controller");
const reviewController = require("../controllers/review-controller");

router.get("/", tourController.getTours);
router.get("/stats", tourController.getStats);
router.post("/:tourId/reviews", requireAuth, reviewController.createTourReview);
router.get("/:tourId", tourController.getTourDetail);

module.exports = router;
