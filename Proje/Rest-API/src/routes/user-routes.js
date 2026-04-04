const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const userController = require("../controllers/user-controller");

// Get user detail
router.get("/:userId", userController.getUserDetail);

// List user purchases
router.get("/:userId/purchases", requireAuth, userController.getUserPurchases);

// Update user password
router.put("/:userId/password", requireAuth, userController.updateUserPassword);

// Update user profile
router.put("/:userId", requireAuth, userController.updateUser);

// Delete user account
router.delete("/:userId", requireAuth, userController.deleteUser);

module.exports = router;
