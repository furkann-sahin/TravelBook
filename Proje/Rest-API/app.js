const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const apiRouter = express.Router();

// Environment variables
const dotenv = require("dotenv");
dotenv.config();

// Fail fast: these variables are required for secure operation
const REQUIRED_ENV = ["JWT_SECRET", "MONGODB_URI"];
const missingEnv = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(
    `[STARTUP] Eksik ortam değişkenleri: ${missingEnv.join(", ")}. Uygulama durduruluyor.`,
  );
  process.exit(1);
}

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

const app = express();

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Çok fazla istek gönderildi. Lütfen daha sonra tekrar deneyin.",
  },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Çok fazla giriş denemesi. Lütfen daha sonra tekrar deneyin.",
  },
});

// Allowed origins for CORS
// Supports comma-separated FRONTEND_URLS and single FRONTEND_URL for backward compatibility.
const allowedOrigins = new Set(
  [
    ...(process.env.FRONTEND_URLS || "").split(","),
    "http://localhost:5173",
    "http://localhost:8080",
  ]
    .map((origin) => (origin || "").trim())
    .filter(Boolean),
);

function isAllowedOrigin(origin) {
  if (!origin) return true; // Non-browser clients (curl, Postman)
  if (allowedOrigins.has(origin)) return true;

  // Optional fallback for Vercel preview deployments.
  const isVercelPreview = /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin);
  return isVercelPreview;
}

// Middleware to allow CORS
const allowCrossDomain = (req, res, next) => {
  const origin = req.headers.origin;
  if (isAllowedOrigin(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
};

app.use(allowCrossDomain);
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", apiLimiter);
app.use("/api/users/auth", authLimiter);
app.use("/api/companies/auth", authLimiter);
app.use("/api/guides/auth", authLimiter);

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

// Error handling
app.use((err, _req, res, _next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: `${err.name}: ${err.message}` });
  }
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
