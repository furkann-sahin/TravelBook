const router = require("express").Router();
const guideController = require("../controllers/guide-controller");

router.get("/:guideId", guideController.getGuideDetail);
router.put("/:guideId", guideController.updateGuideProfile);
router.delete("/:guideId", guideController.deleteGuide);

module.exports = router;