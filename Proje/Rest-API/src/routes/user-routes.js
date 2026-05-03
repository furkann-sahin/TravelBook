const router = require("express").Router();
const { requireAuth, requireRole } = require("../middlewares/auth");
const userController = require("../controllers/user-controller");
const tourController = require("../controllers/tour-controller");
const validate = require("../middlewares/validate");
const { tourIdParamsSchema, purchaseIdParamsSchema } = require("../validations/tour-schemas");
const { objectId, Joi, password } = require("../validations/common-schemas");

const userIdParamsSchema = Joi.object({ userId: objectId.required() });
const updatePasswordBodySchema = Joi.object({
  currentPassword: password.required(),
  newPassword: password.required(),
});
const updateUserBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(120),
  email: Joi.string().email().max(255),
  phone: Joi.string().trim().max(40).allow("", null),
}).min(1);

// List tours with filtering (GET /api/users/tours)
router.get("/tours", tourController.getTours);

// Purchase a tour (POST /api/users/tours/:tourId/purchases)
router.post(
  "/tours/:tourId/purchases",
  requireAuth,
  requireRole("user"),
  validate({ params: tourIdParamsSchema }),
  tourController.purchaseTour,
);

// Cancel a purchase (DELETE /api/users/purchases/:purchaseId)
router.delete(
  "/purchases/:purchaseId",
  requireAuth,
  requireRole("user"),
  validate({ params: purchaseIdParamsSchema }),
  tourController.cancelPurchase,
);

// Get user detail
router.get(
  "/:userId",
  requireAuth,
  requireRole("user"),
  validate({ params: userIdParamsSchema }),
  userController.getUserDetail,
);

// List user purchases
router.get(
  "/:userId/purchases",
  requireAuth,
  requireRole("user"),
  validate({ params: userIdParamsSchema }),
  userController.getUserPurchases,
);

// Update user password
router.put(
  "/:userId/password",
  requireAuth,
  requireRole("user"),
  validate({ params: userIdParamsSchema, body: updatePasswordBodySchema }),
  userController.updateUserPassword,
);

// Update user profile
router.put(
  "/:userId",
  requireAuth,
  requireRole("user"),
  validate({ params: userIdParamsSchema, body: updateUserBodySchema }),
  userController.updateUser,
);

// Delete user account
router.delete(
  "/:userId",
  requireAuth,
  requireRole("user"),
  validate({ params: userIdParamsSchema }),
  userController.deleteUser,
);

module.exports = router;
