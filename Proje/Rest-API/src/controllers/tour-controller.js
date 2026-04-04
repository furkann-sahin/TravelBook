const mongoose = require("mongoose");
const Tour = mongoose.model("Tour");
const { createResponse } = require("../utils/create-response");

const getTours = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, date } = req.query;
    const filter = {};

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (date) {
      const queryDate = new Date(date);
      filter.startDate = { $lte: queryDate };
      filter.endDate = { $gte: queryDate };
    }

    const tours = await Tour.find(filter)
      .select("name location price startDate endDate images services rating companyId")
      .sort({ startDate: 1 })
      .populate("companyId", "name");

    const tourList = tours.map((tour) => ({
      id: tour._id,
      name: tour.name,
      location: tour.location,
      price: tour.price,
      startDate: tour.startDate,
      endDate: tour.endDate,
      imageUrl: tour.images.length > 0 ? tour.images[0] : null,
      services: tour.services,
      companyName: tour.companyId?.name || null,
      rating: tour.rating,
    }));

    createResponse(res, 200, {
      status: "success",
      results: tourList.length,
      data: tourList,
    });
  } catch (error) {
    console.error("Turlar listelenirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

module.exports = { getTours };
