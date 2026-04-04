const router = require("express").Router();

const userAuthController = require("../controllers/user-auth-controller");

// User registration route
router.post("/auth/register", userAuthController.register);

// User login route
router.post("/auth/login", userAuthController.login);

module.exports = router;
