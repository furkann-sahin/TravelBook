const { Joi, objectId } = require("./common-schemas");

const createReviewBodySchema = Joi.object({
  comment: Joi.string().trim().min(2).max(2000).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
});

const updateReviewBodySchema = Joi.object({
  comment: Joi.string().trim().min(2).max(2000),
  rating: Joi.number().integer().min(1).max(5),
}).min(1);

const reviewIdParamsSchema = Joi.object({
  reviewId: objectId.required(),
});

module.exports = {
  createReviewBodySchema,
  updateReviewBodySchema,
  reviewIdParamsSchema,
};
