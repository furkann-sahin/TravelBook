const router = require("express").Router();

const userAuthController = require("../controllers/user-auth-controller");
const validate = require("../middlewares/validate");
const { userRegisterSchema, loginSchema } = require("../validations/auth-schemas");

// User registration route
router.post("/auth/register", validate({ body: userRegisterSchema }), userAuthController.register);

// User login route
router.post("/auth/login", validate({ body: loginSchema }), userAuthController.login);

module.exports = router;
