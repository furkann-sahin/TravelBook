const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    location: {
      type: String,
      trim: true,
      required: true,
    },
    date: {
      type: Date,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalCapacity: {
      type: Number,
      required: true,
      min: 1,
    },
    filledCapacity: {
      type: Number,
      default: 0,
      min: 0,
    },
    places: {
      type: [String],
      default: [],
    },
    duration: {
      type: String,
      trim: true,
      default: "",
    },
    included: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    services: {
      type: [String],
      default: [],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    guideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guide",
      default: null,
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
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

tourSchema.pre("validate", function (next) {
  if (!this.name && this.title) this.name = this.title;
  if (!this.title && this.name) this.title = this.name;

  if (!this.startDate && this.date) this.startDate = this.date;
  if (!this.date && this.startDate) this.date = this.startDate;
  if (!this.endDate && this.startDate) this.endDate = this.startDate;

  next();
});

module.exports = mongoose.model("Tour", tourSchema, "tours");
