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

const companyAuthRoutes = require("./src/routes/company-auth-routes");

const guideAuthRoutes = require("./src/routes/guide-auth-routes");
const guideRoutes = require("./src/routes/guide-routes");
const guideTourRoutes = require("./src/routes/guide-tour-routes");

var app = express();

// Middleware to allow CORS
const allowCrossDomain = (_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
};

app.use(allowCrossDomain);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// API routes
apiRouter.use("/companies", companyAuthRoutes);

// Rehber -> Tüm Tur Firmalarını Listeleme (GET /api/companies)
const guideController = require("./src/controllers/guide-controller");
apiRouter.get("/companies", guideController.listCompanies);

// Rehber Rotaları (Senin Rotaların)
apiRouter.use("/guides", guideAuthRoutes);
apiRouter.use("/guides", guideRoutes);
apiRouter.use("/guides", guideTourRoutes);

app.use("/api", apiRouter);

// Error handling for unauthorized access
app.use((err, _req, res, _next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({ message: err.name + ": " + err.message });
  }
});

module.exports = app;
