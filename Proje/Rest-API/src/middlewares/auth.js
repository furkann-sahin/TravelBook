const { expressjwt } = require("express-jwt");
const { createResponse } = require("../utils/create-response");

// Middleware to authenticate JWT tokens in incoming requests
const requireAuth = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
});

const requireRole = (...allowedRoles) => (req, res, next) => {
  const role = req.payload?.role;
  if (!role || !allowedRoles.includes(role)) {
    return createResponse(res, 403, {
      status: "error",
      message: "Bu işlem için yetkiniz yok",
      statusCode: 403,
    });
  }
  return next();
};

module.exports = {
  requireAuth,
  requireRole,
};
