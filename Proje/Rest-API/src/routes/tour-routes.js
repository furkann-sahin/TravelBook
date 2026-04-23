const router = require("express").Router();
const { requireAuth, requireRole } = require("../middlewares/auth");
const tourController = require("../controllers/tour-controller");
const reviewController = require("../controllers/review-controller");
const validate = require("../middlewares/validate");
const { getToursQuerySchema, tourIdParamsSchema } = require("../validations/tour-schemas");
const { createReviewBodySchema } = require("../validations/review-schemas");

router.get("/", validate({ query: getToursQuerySchema }), tourController.getTours);
router.get("/stats", tourController.getStats);
router.post(
	"/:tourId/reviews",
	requireAuth,
	requireRole("user"),
	validate({ params: tourIdParamsSchema, body: createReviewBodySchema }),
	reviewController.createTourReview,
);
router.get("/:tourId", validate({ params: tourIdParamsSchema }), tourController.getTourDetail);

module.exports = router;
