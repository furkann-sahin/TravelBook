const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// YAML Sözleşmesine Uygun Guide Şeması
const guideSchema = new mongoose.Schema(
  {
    firstName: { // name yerine firstName oldu
      type: String,
      trim: true,
      required: true,
    },
    lastName: { // surname yerine lastName oldu
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
    },
    biography: { // bio yerine biography oldu
      type: String,
      trim: true,
      default: "",
    },
    languages: [{
      type: String,
      trim: true,
    }],
    expertRoutes: [{ // specialties yerine expertRoutes oldu
      type: String,
      trim: true,
    }],
    experienceYears: { // Yeni eklendi
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewCount: { // Yeni eklendi
      type: Number,
      default: 0,
    },
    profileImageUrl: { // Yeni eklendi
      type: String,
      default: null,
    },
    registeredTours: [{ // Tura katılma gereksinimi için
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour'
    }]
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

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
    { expiresIn: "1h" },
  );
};

module.exports = mongoose.model("Guide", guideSchema, "guides");