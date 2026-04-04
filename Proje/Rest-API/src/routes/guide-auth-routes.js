const router = require("express").Router();
const guideAuthController = require("../controllers/guide-auth-controller");

// Rehber Kayıt (POST /api/guides/auth/register)
router.post("/auth/register", guideAuthController.register);

// Rehber Giriş (POST /api/guides/auth/login)
router.post("/auth/login", guideAuthController.login);

module.exports = router;