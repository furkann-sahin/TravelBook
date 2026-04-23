const router = require("express").Router();
const guideAuthController = require("../controllers/guide-auth-controller");
const validate = require("../middlewares/validate");
const { guideRegisterSchema, loginSchema } = require("../validations/auth-schemas");

// Rehber Kayıt (POST /api/guides/auth/register)
router.post("/auth/register", validate({ body: guideRegisterSchema }), guideAuthController.register);

// Rehber Giriş (POST /api/guides/auth/login)
router.post("/auth/login", validate({ body: loginSchema }), guideAuthController.login);

module.exports = router;