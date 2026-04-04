const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const userController = require("../controllers/user-controller");
const tourController = require("../controllers/tour-controller");

// List tours with filtering (GET /api/users/tours)
router.get("/tours", tourController.getUserTours);

// Purchase a tour (POST /api/users/tours/:tourId/purchases)
router.post("/tours/:tourId/purchases", requireAuth, tourController.purchaseTour);

// Cancel a purchase (DELETE /api/users/purchases/:purchaseId)
router.delete("/purchases/:purchaseId", requireAuth, tourController.cancelPurchase);

// Get user detail
router.get("/:userId", userController.getUserDetail);

// Update user password
router.put("/:userId/password", requireAuth, userController.updateUserPassword);

// Update user profile
router.put("/:userId", requireAuth, userController.updateUser);

// Delete user account
router.delete("/:userId", requireAuth, userController.deleteUser);

module.exports = router;
