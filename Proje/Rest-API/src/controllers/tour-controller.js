const mongoose = require("mongoose");
const Tour = mongoose.model("Tour");
const Review = mongoose.model("Review");
const Purchase = mongoose.model("Purchase");
const { createResponse } = require("../utils/create-response");

// Helper functions
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
  imageUrl:
    Array.isArray(tour.images) && tour.images.length > 0
      ? tour.images[0]
      : null,
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

// GET TOURS
const getTours = async (req, res) => {
  try {
    const { title, price, location, date, minPrice, maxPrice } = req.query;

    const andFilters = [];

    if (location) {
      andFilters.push({ location: { $regex: location, $options: "i" } });
    }

    const priceFilter = {};
    if (price) priceFilter.$eq = Number(price);
    if (minPrice) priceFilter.$gte = Number(minPrice);
    if (maxPrice) priceFilter.$lte = Number(maxPrice);
    if (Object.keys(priceFilter).length > 0) {
      andFilters.push({ price: priceFilter });
    }

    if (title) {
      const regex = new RegExp(title, "i");
      andFilters.push({ $or: [{ title: regex }, { name: regex }] });
    }

    if (date) {
      const queryDate = new Date(date);
      andFilters.push({
        $or: [
          {
            date: {
              $gte: startOfDay(queryDate),
              $lte: endOfDay(queryDate),
            },
          },
          {
            startDate: {
              $gte: startOfDay(queryDate),
              $lte: endOfDay(queryDate),
            },
          },
        ],
      });
    }

    const query = andFilters.length ? { $and: andFilters } : {};

    const tours = await Tour.find(query)
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

// GET TOUR DETAIL
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
      Tour.findById(tourId),
      Review.find({ tourId }).sort({ createdAt: -1 }),
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
    console.error(error);
    createResponse(res, 500, { status: "error", message: "Sunucu hatası" });
  }
};

// PURCHASE TOUR
const purchaseTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const userId = req.payload?.id || req.body?.userId;

    if (!userId) {
      return createResponse(res, 400, {
        status: "error",
        message: "Kullanıcı gerekli",
      });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return createResponse(res, 404, {
        status: "error",
        message: "Tur bulunamadı",
      });
    }

    // Kapasite kontrolü
    if (tour.filledCapacity >= tour.totalCapacity) {
      return createResponse(res, 409, {
        status: "error",
        message: "Tur kapasitesi dolu",
      });
    }

    // Mükerrer satın alma kontrolü
    const existingPurchase = await Purchase.findOne({ userId, tourId });
    if (existingPurchase) {
      return createResponse(res, 409, {
        status: "error",
        message: "Bu turu zaten satın aldınız",
      });
    }

    const purchase = await Purchase.create({ userId, tourId });

    // Kapasiteyi atomik olarak artır
    await Tour.findByIdAndUpdate(tourId, { $inc: { filledCapacity: 1 } });

    createResponse(res, 201, {
      status: "success",
      message: "Satın alma başarılı",
      data: purchase,
    });
  } catch (error) {
    console.error(error);
    createResponse(res, 500, { status: "error", message: "Sunucu hatası" });
  }
};

// CANCEL PURCHASE
const cancelPurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const userId = req.payload?.id;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kayıt bulunamadı",
      });
    }

    if (purchase.userId.toString() !== userId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yetkisiz işlem",
      });
    }

    // Kapasiteyi atomik olarak azalt
    await Tour.findByIdAndUpdate(purchase.tourId, { $inc: { filledCapacity: -1 } });

    await purchase.deleteOne();

    createResponse(res, 200, {
      status: "success",
      message: "Satın alma iptal edildi",
    });
  } catch (error) {
    console.error(error);
    createResponse(res, 500, { status: "error", message: "Sunucu hatası" });
  }
};

module.exports = {
  getTours,
  getTourDetail,
  purchaseTour,
  cancelPurchase,
};
