const { createResponse } = require("../utils/create-response");

const validate =
  (schemas = {}) =>
  (req, res, next) => {
    try {
      if (schemas.params) {
        const { value, error } = schemas.params.validate(req.params, {
          abortEarly: false,
          stripUnknown: true,
        });
        if (error) {
          return createResponse(res, 400, {
            status: "error",
            message: error.details.map((detail) => detail.message).join(", "),
            statusCode: 400,
          });
        }
        req.params = value;
      }

      if (schemas.query) {
        const { value, error } = schemas.query.validate(req.query, {
          abortEarly: false,
          stripUnknown: true,
          convert: true,
        });
        if (error) {
          return createResponse(res, 400, {
            status: "error",
            message: error.details.map((detail) => detail.message).join(", "),
            statusCode: 400,
          });
        }
        req.query = value;
      }

      if (schemas.body) {
        const { value, error } = schemas.body.validate(req.body, {
          abortEarly: false,
          stripUnknown: true,
          convert: true,
        });
        if (error) {
          return createResponse(res, 400, {
            status: "error",
            message: error.details.map((detail) => detail.message).join(", "),
            statusCode: 400,
          });
        }
        req.body = value;
      }

      return next();
    } catch (error) {
      return createResponse(res, 500, {
        status: "error",
        message: `Doğrulama sırasında sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
        statusCode: 500,
      });
    }
  };

module.exports = validate;
