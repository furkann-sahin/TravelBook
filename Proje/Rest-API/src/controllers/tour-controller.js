const mongoose = require("mongoose");
const Tour = mongoose.model("Tour");
const Purchase = mongoose.model("Purchase");
const { createResponse } = require("../utils/create-response");

const getUserTours = async (req, res) => {
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
      .select("name location price startDate endDate images rating companyId")
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

const purchaseTour = async (req, res) => {
  try {
    const { tourId } = req.params;
    const userId = req.payload?.id || req.body?.userId;

    if (!userId) {
      return createResponse(res, 400, {
        status: "error",
        message: "Kullanıcı bilgisi gereklidir",
      });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return createResponse(res, 404, {
        status: "error",
        message: "Tur bulunamadı",
      });
    }

    const purchase = new Purchase({
      userId,
      tourId,
    });

    await purchase.save();

    createResponse(res, 201, {
      status: "success",
      message: "Satın alma başarılı",
      data: {
        purchaseId: purchase._id,
        tourId: purchase.tourId,
        userId: purchase.userId,
        purchaseDate: purchase.purchaseDate,
      },
    });
  } catch (error) {
    console.error("Tur satın alınırken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

const cancelPurchase = async (req, res) => {
  try {
    const { purchaseId } = req.params;
    const userId = req.payload?.id;

    const purchase = await Purchase.findById(purchaseId);
    if (!purchase) {
      return createResponse(res, 404, {
        status: "error",
        message: "Satın alma kaydı bulunamadı",
      });
    }

    if (purchase.userId.toString() !== userId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Bu işlem için yetkiniz yok",
      });
    }

    await Purchase.findByIdAndDelete(purchaseId);

    createResponse(res, 200, {
      status: "success",
      message: "Satın alma iptal edildi",
    });
  } catch (error) {
    console.error("Satın alma iptal edilirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

module.exports = { getUserTours, purchaseTour, cancelPurchase };
