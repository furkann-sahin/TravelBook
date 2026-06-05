const { Joi, objectId } = require("./common-schemas");

const getToursQuerySchema = Joi.object({
  title: Joi.string().trim().max(255),
  location: Joi.string().trim().max(255),
  date: Joi.date().iso(),
  price: Joi.number().min(0),
  minPrice: Joi.number().min(0),
  maxPrice: Joi.number().min(0),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
}).custom((value, helpers) => {
  if (
    value.minPrice !== undefined
    && value.maxPrice !== undefined
    && value.minPrice > value.maxPrice
  ) {
    return helpers.error("any.invalid");
  }
  return value;
}, "price-range").messages({
  "any.invalid": "minPrice, maxPrice değerinden büyük olamaz",
});

const companyIdParamsSchema = Joi.object({
  companyId: objectId.required(),
});

const companyTourParamsSchema = Joi.object({
  companyId: objectId.required(),
  tourId: objectId.required(),
});

const createTourBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  description: Joi.string().trim().min(10).max(4000).required(),
  location: Joi.string().trim().min(2).max(200).required(),
  price: Joi.number().min(0).required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
  totalCapacity: Joi.number().integer().min(1).required(),
  departureLocation: Joi.string().trim().max(200).allow("", null),
  arrivalLocation: Joi.string().trim().max(200).allow("", null),
  guideId: objectId.allow("", null),
  services: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim().max(120)),
    Joi.string().trim().max(2000),
  ),
  places: Joi.alternatives().try(
    Joi.array().items(Joi.string().trim().max(120)),
    Joi.string().trim().max(2000),
  ),
});

const updateTourBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(200),
  description: Joi.string().trim().min(10).max(4000),
  location: Joi.string().trim().min(2).max(200),
  price: Joi.number().min(0),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
  totalCapacity: Joi.number().integer().min(1),
  departureLocation: Joi.string().trim().max(200).allow("", null),
  arrivalLocation: Joi.string().trim().max(200).allow("", null),
  services: Joi.array().items(Joi.string().trim().max(120)),
  places: Joi.array().items(Joi.string().trim().max(120)),
}).min(1);

const tourIdParamsSchema = Joi.object({
  tourId: objectId.required(),
});

const purchaseIdParamsSchema = Joi.object({
  purchaseId: objectId.required(),
});

module.exports = {
  getToursQuerySchema,
  companyIdParamsSchema,
  companyTourParamsSchema,
  createTourBodySchema,
  updateTourBodySchema,
  tourIdParamsSchema,
  purchaseIdParamsSchema,
};
