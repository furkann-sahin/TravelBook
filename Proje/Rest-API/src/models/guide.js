const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema(
  {
    name: {
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
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    experience: {
      type: Number,
      min: 0,
      default: 0,
    },
    languages: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    profileImage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
  { versionKey: false },
);

module.exports = mongoose.model("Guide", guideSchema, "guides");
