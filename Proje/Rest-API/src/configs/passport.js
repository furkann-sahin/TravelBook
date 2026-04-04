const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

const User = mongoose.model("User");
const Company = mongoose.model("Company");
const Guide = mongoose.model("Guide");

passport.use(
  "user-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({
          email: email.trim().toLowerCase(),
        }).select("+passwordHash +salt");

        if (!user || !user.validatePassword(password))
          return done(null, false, { message: "Geçersiz e-posta veya şifre" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  "company-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const company = await Company.findOne({
          email: email.trim().toLowerCase(),
        }).select("+passwordHash +salt");

        if (!company || !company.validatePassword(password))
          return done(null, false, { message: "Geçersiz e-posta veya şifre" });

        return done(null, company);
      } catch (err) {
        return done(err);
      }
    },
  ),
);


passport.use(
  "guide-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const guide = await Guide.findOne({
          email: email.trim().toLowerCase(),
        }).select("+passwordHash +salt");
        if (!guide || !guide.validatePassword(password)) {
          return done(null, false, { message: "Geçersiz e-posta veya şifre" });
        }
        return done(null, guide); // Success
      } catch (err) {
        return done(err);
      }
    },
  ),
);
