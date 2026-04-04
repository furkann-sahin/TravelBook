const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const userController = require("../controllers/user-controller");

// Get user detail
router.get("/:userId", userController.getUserDetail);

// Update user password
router.put("/:userId/password", requireAuth, userController.updateUserPassword);

// Update user profile
router.put("/:userId", requireAuth, userController.updateUser);

// Delete user account
router.delete("/:userId", requireAuth, userController.deleteUser);

module.exports = router;
