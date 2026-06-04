const Joi = require("joi");

const objectId = Joi.string().hex().length(24);

const email = Joi.string().email().max(255);

const password = Joi.string().min(6).max(128);

module.exports = {
  Joi,
  objectId,
  email,
  password,
};
