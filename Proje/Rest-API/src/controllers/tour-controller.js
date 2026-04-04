const mongoose = require("mongoose");
const Tour = mongoose.model("Tour");
const Review = mongoose.model("Review");
const { createResponse } = require("../utils/create-response");

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (value) => {
  const date = new Date(value);
  date.setHours(23, 59, 59, 999);
  return date;
};

const mapTourListItem = (tour) => ({
  id: tour.id || tour._id,
  name: tour.title || tour.name,
  title: tour.title || tour.name,
  location: tour.location,
  price: tour.price,
  startDate: tour.date || tour.startDate,
  endDate: tour.endDate || tour.date || tour.startDate,
  date: tour.date || tour.startDate,
  imageUrl: Array.isArray(tour.images) && tour.images.length > 0 ? tour.images[0] : null,
  companyName: tour.companyName || null,
  rating: tour.rating || 0,
});

const mapReview = (review) => ({
  id: review.id || review._id,
  tourId: review.tourId,
  userId: review.userId,
  userName: review.userName,
  comment: review.comment,
  rating: review.rating,
  createdAt: review.createdAt,
  updatedAt: review.updatedAt,
});

const mapTourDetail = (tour, reviews = []) => ({
  id: tour.id || tour._id,
  title: tour.title || tour.name,
  description: tour.description,
  price: tour.price,
  location: tour.location,
  date: tour.date || tour.startDate,
  duration: tour.duration,
  included: tour.included || [],
  places: tour.places || [],
  images: tour.images || [],
  reviews: reviews.map(mapReview),
});

const getTours = async (req, res) => {
  try {
    const { title, price, location, date, minPrice, maxPrice } = req.query;

    const andFilters = [];

    if (location) {
      andFilters.push({ location: { $regex: location, $options: "i" } });
    }

    const priceFilter = {};
    if (price !== undefined && `${price}`.trim() !== "") {
      const parsedPrice = Number(price);
      if (Number.isNaN(parsedPrice)) {
        return createResponse(res, 400, {
          status: "error",
          message: "Geçerli bir price değeri gönderin",
        });
      }
      priceFilter.$eq = parsedPrice;
    }
    if (minPrice !== undefined && `${minPrice}`.trim() !== "") {
      const parsedMinPrice = Number(minPrice);
      if (Number.isNaN(parsedMinPrice)) {
        return createResponse(res, 400, {
          status: "error",
          message: "Geçerli bir minPrice değeri gönderin",
        });
      }
      priceFilter.$gte = parsedMinPrice;
    }
    if (maxPrice !== undefined && `${maxPrice}`.trim() !== "") {
      const parsedMaxPrice = Number(maxPrice);
      if (Number.isNaN(parsedMaxPrice)) {
        return createResponse(res, 400, {
          status: "error",
          message: "Geçerli bir maxPrice değeri gönderin",
        });
      }
      priceFilter.$lte = parsedMaxPrice;
    }
    if (Object.keys(priceFilter).length > 0) {
      andFilters.push({ price: priceFilter });
    }

    if (title) {
      const titleRegex = new RegExp(title, "i");
      andFilters.push({
        $or: [{ title: titleRegex }, { name: titleRegex }],
      });
    }

    if (date) {
      const queryDate = new Date(date);
      if (Number.isNaN(queryDate.getTime())) {
        return createResponse(res, 400, {
          status: "error",
          message: "Geçerli bir date değeri gönderin",
        });
      }
      andFilters.push({
        $or: [
          { date: { $gte: startOfDay(queryDate), $lte: endOfDay(queryDate) } },
          { startDate: { $gte: startOfDay(queryDate), $lte: endOfDay(queryDate) } },
        ],
      });
    }

    const query = andFilters.length > 0 ? { $and: andFilters } : {};

    const tours = await Tour.find(query)
      .select("title name location price date startDate endDate images rating companyId")
      .sort({ date: 1, startDate: 1 })
      .populate("companyId", "name");

    const tourList = tours.map((tour) =>
      mapTourListItem({
        ...tour.toObject(),
        companyName: tour.companyId?.name || null,
      }),
    );

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

const getTourDetail = async (req, res) => {
  try {
    const { tourId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      return createResponse(res, 404, {
        status: "error",
        message: "Tur bulunamadı",
      });
    }

    const [tour, reviews] = await Promise.all([
      Tour.findById(tourId).select(
        "title name description price location date startDate duration included places images",
      ),
      Review.find({ tourId })
        .select("tourId userId userName comment rating createdAt updatedAt")
        .sort({ createdAt: -1 }),
    ]);

    if (!tour) {
      return createResponse(res, 404, {
        status: "error",
        message: "Tur bulunamadı",
      });
    }

    createResponse(res, 200, {
      status: "success",
      data: mapTourDetail(tour, reviews),
    });
  } catch (error) {
    console.error("Tur detayları alınırken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

module.exports = { getTours, getTourDetail };
