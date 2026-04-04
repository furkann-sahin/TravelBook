const router = require("express").Router();
const tourController = require("../controllers/tour-controller");

router.get("/", tourController.getTours);

module.exports = router;
