const router = require("express").Router();
const { requireAuth, requireRole } = require("../middlewares/auth");
const favoriteController = require("../controllers/user-favorite-controller");
const validate = require("../middlewares/validate");
const { Joi, objectId } = require("../validations/common-schemas");

const userParamsSchema = Joi.object({ userId: objectId.required() });
const favoriteParamsSchema = Joi.object({
  userId: objectId.required(),
  tourId: objectId.required(),
});
const addFavoriteBodySchema = Joi.object({
  tourId: objectId.required(),
});

// GET /api/users/:userId/favorites - Favori turları listele
router.get(
  "/:userId/favorites",
  requireAuth,
  requireRole("user"),
  validate({ params: userParamsSchema }),
  favoriteController.getFavorites,
);

// POST /api/users/:userId/favorites - Favori tur ekle
router.post(
  "/:userId/favorites",
  requireAuth,
  requireRole("user"),
  validate({ params: userParamsSchema, body: addFavoriteBodySchema }),
  favoriteController.addFavorite,
);

// DELETE /api/users/:userId/favorites/:tourId - Favori tur sil
router.delete(
  "/:userId/favorites/:tourId",
  requireAuth,
  requireRole("user"),
  validate({ params: favoriteParamsSchema }),
  favoriteController.removeFavorite,
);

module.exports = router;
