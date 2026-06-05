const { Joi, email, password } = require("./common-schemas");

const userRegisterSchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  email: email.required(),
  password: password.required(),
  phone: Joi.string().trim().max(40).allow("", null),
});

const companyRegisterSchema = Joi.object({
  name: Joi.string().trim().min(2).max(160).required(),
  email: email.required(),
  password: password.required(),
  description: Joi.string().trim().max(2000).allow("", null),
  phone: Joi.string().trim().max(40).required(),
  address: Joi.string().trim().min(3).max(255).required(),
});

const guideRegisterSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(120).required(),
  lastName: Joi.string().trim().min(2).max(120).required(),
  email: email.required(),
  password: password.required(),
  phone: Joi.string().trim().max(40).allow("", null),
  biography: Joi.string().trim().max(2000).allow("", null),
  languages: Joi.array().items(Joi.string().trim().max(80)).default([]),
  expertRoutes: Joi.array().items(Joi.string().trim().max(120)).default([]),
  experienceYears: Joi.number().integer().min(0).max(80).default(0),
  instagram: Joi.string().trim().max(255).allow("", null),
  linkedin: Joi.string().trim().max(255).allow("", null),
});

const loginSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

module.exports = {
  userRegisterSchema,
  companyRegisterSchema,
  guideRegisterSchema,
  loginSchema,
};
