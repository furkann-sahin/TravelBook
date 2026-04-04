const router = require("express").Router();
const requireAuth = require("../middlewares/auth");
const favoriteController = require("../controllers/user-favorite-controller");

// GET /api/users/:userId/favorites - Favori turları listele
router.get("/:userId/favorites", requireAuth, favoriteController.getFavorites);

// POST /api/users/:userId/favorites - Favori tur ekle
router.post("/:userId/favorites", requireAuth, favoriteController.addFavorite);

// DELETE /api/users/:userId/favorites/:tourId - Favori tur sil
router.delete("/:userId/favorites/:tourId", requireAuth, favoriteController.removeFavorite);

module.exports = router;
