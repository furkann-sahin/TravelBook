const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const reviewController = require("../controllers/review-controller");

router.put("/:reviewId", requireAuth, reviewController.updateReview);
router.delete("/:reviewId", requireAuth, reviewController.deleteReview);

module.exports = router;
