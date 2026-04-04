const mongoose = require("mongoose");
const User = mongoose.model("User");
const Tour = mongoose.model("Tour");
const { createResponse } = require("../utils/create-response");

// GET /api/users/:userId/favorites
const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).populate(
      "favorites",
      "name location price startDate endDate images rating companyId",
    );

    if (!user) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kullanıcı bulunamadı",
      });
    }

    const favorites = await User.findById(userId)
      .populate({
        path: "favorites",
        select:
          "name location price startDate endDate images rating companyId",
        populate: { path: "companyId", select: "name" },
      })
      .then((u) =>
        u.favorites.map((tour) => ({
          id: tour._id,
          name: tour.name,
          location: tour.location,
          price: tour.price,
          startDate: tour.startDate,
          endDate: tour.endDate,
          imageUrl: tour.images.length > 0 ? tour.images[0] : null,
          companyName: tour.companyId?.name || null,
          rating: tour.rating,
        })),
      );

    createResponse(res, 200, {
      status: "success",
      results: favorites.length,
      data: favorites,
    });
  } catch (error) {
    console.error("Favoriler listelenirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

// POST /api/users/:userId/favorites
const addFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const { tourId } = req.body;

    if (!tourId) {
      return createResponse(res, 400, {
        status: "error",
        message: "tourId alanı gereklidir",
      });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) {
      return createResponse(res, 404, {
        status: "error",
        message: "Tur bulunamadı",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kullanıcı bulunamadı",
      });
    }

    if (user.favorites.includes(tourId)) {
      return createResponse(res, 409, {
        status: "error",
        message: "Bu tur zaten favorilerde",
      });
    }

    user.favorites.push(tourId);
    await user.save();

    createResponse(res, 201, {
      status: "success",
      message: "Tur favorilere eklendi",
      data: { tourId },
    });
  } catch (error) {
    console.error("Favori eklenirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

// DELETE /api/users/:userId/favorites/:tourId
const removeFavorite = async (req, res) => {
  try {
    const { userId, tourId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kullanıcı bulunamadı",
      });
    }

    const index = user.favorites.indexOf(tourId);
    if (index === -1) {
      return createResponse(res, 404, {
        status: "error",
        message: "Bu tur favorilerde bulunamadı",
      });
    }

    user.favorites.splice(index, 1);
    await user.save();

    createResponse(res, 200, {
      status: "success",
      message: "Tur favorilerden kaldırıldı",
    });
  } catch (error) {
    console.error("Favori silinirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

module.exports = { getFavorites, addFavorite, removeFavorite };
