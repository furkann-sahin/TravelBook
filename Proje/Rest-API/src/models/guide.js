const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const guideSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    salt: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    biography: {
      type: String,
      trim: true,
      default: "",
    },
    languages: [
      {
        type: String,
        trim: true,
      },
    ],
    expertRoutes: [
      {
        type: String,
        trim: true,
      },
    ],
    experienceYears: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    bannerImageUrl: {
      type: String,
      default: null,
    },
    galleryImageUrls: [
      {
        type: String,
        trim: true,
      },
    ],
    instagram: {
      type: String,
      trim: true,
      default: "",
    },
    linkedin: {
      type: String,
      trim: true,
      default: "",
    },
    registeredTours: [{ // Tura katılma gereksinimi için
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
    }],
    registeredCompanies: [{ // Rehberin kayıt olduğu tur firmaları
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    }]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Password işlemleri
guideSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.passwordHash = crypto
    .pbkdf2Sync(password, this.salt, 600000, 64, "sha512")
    .toString("hex");
};

guideSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 600000, 64, "sha512")
    .toString("hex");
  return this.passwordHash === hash;
};

// JWT oluşturma
guideSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: "guide",
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

module.exports = mongoose.model("Guide", guideSchema, "guides");
