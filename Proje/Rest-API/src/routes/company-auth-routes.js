const router = require("express").Router();

const companyAuthController = require("../controllers/company-auth-controller");

// Company registration route
router.post("/auth/register", companyAuthController.register);

// Company login route
router.post("/auth/login", companyAuthController.login);

module.exports = router;
