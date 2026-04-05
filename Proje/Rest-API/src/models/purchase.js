const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      required: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

purchaseSchema.index({ userId: 1, tourId: 1 }, { unique: true });

module.exports = mongoose.model("Purchase", purchaseSchema, "purchases");
