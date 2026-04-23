const router = require("express").Router();

const companyAuthController = require("../controllers/company-auth-controller");
const validate = require("../middlewares/validate");
const { companyRegisterSchema, loginSchema } = require("../validations/auth-schemas");

// Company registration route
router.post("/auth/register", validate({ body: companyRegisterSchema }), companyAuthController.register);

// Company login route
router.post("/auth/login", validate({ body: loginSchema }), companyAuthController.login);

module.exports = router;
