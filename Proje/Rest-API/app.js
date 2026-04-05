var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const apiRouter = express.Router();

// Environment variables
const dotenv = require("dotenv");
dotenv.config();

require("./src/models/db"); // Database connection and model registration
require("./src/configs/passport"); // Register passport strategies

const userAuthRoutes = require("./src/routes/user-auth-routes");
const userRoutes = require("./src/routes/user-routes");
const userFavoriteRoutes = require("./src/routes/user-favorite-routes");

const companyAuthRoutes = require("./src/routes/company-auth-routes");
const companyRoutes = require("./src/routes/company-routes");
const companyTourRoutes = require("./src/routes/company-tour-routes");

const guideAuthRoutes = require("./src/routes/guide-auth-routes");
const guideRoutes = require("./src/routes/guide-routes");
const guideTourRoutes = require("./src/routes/guide-tour-routes");
const guideCompanyRoutes = require("./src/routes/guide-company-routes");

const tourRoutes = require("./src/routes/tour-routes");
const reviewRoutes = require("./src/routes/review-routes");

var app = express();

// Middleware to allow CORS
const allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
};

app.use(allowCrossDomain);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// API routes
apiRouter.use("/users", userAuthRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/users", userFavoriteRoutes);

apiRouter.use("/companies", companyAuthRoutes);
apiRouter.use("/companies", companyRoutes);
apiRouter.use("/companies", companyTourRoutes);

apiRouter.use("/guides", guideAuthRoutes);
apiRouter.use("/guides", guideRoutes);
apiRouter.use("/guides", guideTourRoutes);
apiRouter.use("/guides", guideCompanyRoutes);

apiRouter.use("/tours", tourRoutes);
apiRouter.use("/reviews", reviewRoutes);

app.use("/api", apiRouter);

// Error handling for unauthorized access
app.use((err, _req, res, _next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: err.name + ": " + err.message });
  }
});

module.exports = app;
