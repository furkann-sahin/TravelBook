const router = require("express").Router();
const { requireAuth, requireRole } = require("../middlewares/auth");
const reviewController = require("../controllers/review-controller");
const validate = require("../middlewares/validate");
const { updateReviewBodySchema, reviewIdParamsSchema } = require("../validations/review-schemas");

router.put(
  "/:reviewId",
  requireAuth,
  requireRole("user"),
  validate({ params: reviewIdParamsSchema, body: updateReviewBodySchema }),
  reviewController.updateReview,
);
router.delete(
  "/:reviewId",
  requireAuth,
  requireRole("user"),
  validate({ params: reviewIdParamsSchema }),
  reviewController.deleteReview,
);

module.exports = router;
