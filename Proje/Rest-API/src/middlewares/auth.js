const { expressjwt } = require("express-jwt");

// Middleware to authenticate JWT tokens in incoming requests
const requireAuth = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
});

module.exports = requireAuth;
