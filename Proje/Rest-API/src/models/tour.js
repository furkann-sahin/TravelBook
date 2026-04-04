const mongoose = require("mongoose");

const tourSchema = new mongoose.Schema(
    {
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
        price: {
            type: Number,
            required: true,
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
        },
        availableCapacity: {
            type: Number,
            default: function () {
                return this.totalCapacity;
            },
        },
        places: [
            {
                type: String,
                trim: true,
            },
        ],
        images: [
            {
                type: String,
            },
        ],
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },
        companyName: {
            type: String,
            trim: true,
        },
        guideId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Guide",
            default: null,
        },
        guideName: {
            type: String,
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
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("Tour", tourSchema, "tours");
