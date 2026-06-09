const mongoose = require("mongoose");
const User = mongoose.model("User");
const Purchase = mongoose.model("Purchase");
const Tour = mongoose.model("Tour");
const Review = mongoose.model("Review");
const { createResponse } = require("../utils/create-response");

const syncTourReviewStats = async (tourId) => {
  if (!mongoose.Types.ObjectId.isValid(tourId)) return;

  const normalizedTourId = new mongoose.Types.ObjectId(tourId);
  const [stats] = await Review.aggregate([
    { $match: { tourId: normalizedTourId } },
    {
      $group: {
        _id: "$tourId",
        reviewCount: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (!stats) {
    await Tour.findByIdAndUpdate(tourId, { reviewCount: 0, rating: 0 });
    return;
  }

  await Tour.findByIdAndUpdate(tourId, {
    reviewCount: stats.reviewCount,
    rating: Number(stats.avgRating.toFixed(1)),
  });
};

// Get user detail
const getUserDetail = async (req, res) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.payload?.id;

    if (authenticatedUserId !== userId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi profilinizi görüntüleyebilirsiniz",
      });
    }

    const user = await User.findById(userId).select(
      "name email phone createdAt updatedAt",
    );

    if (!user) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kullanıcı bulunamadı",
      });
    }

    createResponse(res, 200, {
      status: "success",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Kullanıcı detayları alınırken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.payload.id !== userId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi profilinizi güncelleyebilirsiniz",
      });
    }

    const allowedFields = ["name", "phone"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return createResponse(res, 400, {
        status: "error",
        message: "Güncellenecek alan bulunamadı",
      });
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kullanıcı bulunamadı",
      });
    }

    createResponse(res, 200, {
      status: "success",
      message: "Profil başarıyla güncellendi",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Kullanıcı güncellenirken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

// Update user password
const updateUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    const authenticatedUserId = req.payload?.id;

    if (authenticatedUserId !== userId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi şifrenizi güncelleyebilirsiniz",
      });
    }

    if (!currentPassword || !newPassword) {
      return createResponse(res, 400, {
        status: "error",
        message: "currentPassword ve newPassword alanları zorunludur",
      });
    }

    const user = await User.findById(userId).select("+passwordHash +salt");

    if (!user) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kullanıcı bulunamadı",
      });
    }

    if (!user.validatePassword(currentPassword)) {
      return createResponse(res, 400, {
        status: "error",
        message: "Eski şifre hatalı",
      });
    }

    user.setPassword(newPassword);
    await user.save();

    createResponse(res, 200, {
      status: "success",
      message: "Şifre başarıyla güncellendi",
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Şifre güncellenirken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

// List user purchases
const getUserPurchases = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    const authenticatedUserId = req.payload?.id;

    if (authenticatedUserId !== userId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi seyahatlerinizi görüntüleyebilirsiniz",
      });
    }

    if (status && !["past", "future"].includes(status)) {
      return createResponse(res, 400, {
        status: "error",
        message: "status parametresi past veya future olmalıdır",
      });
    }

    const purchases = await Purchase.find({ userId })
      .populate("tourId")
      .sort({ purchaseDate: -1 });

    const now = new Date();
    let filteredPurchases = purchases;

    if (status === "past") {
      filteredPurchases = purchases.filter(
        (p) => p.tourId && new Date(p.tourId.endDate || p.tourId.startDate) < now
      );
    } else if (status === "future") {
      filteredPurchases = purchases.filter(
        (p) => p.tourId && new Date(p.tourId.startDate) >= now
      );
    }

    const data = filteredPurchases.map((p) => ({
      id: p._id,
      purchaseDate: p.purchaseDate,
      tour: p.tourId
        ? {
            id: p.tourId._id,
            title: p.tourId.title || p.tourId.name,
            location: p.tourId.location,
            price: p.tourId.price,
            startDate: p.tourId.startDate,
            endDate: p.tourId.endDate,
            imageUrl:
              Array.isArray(p.tourId.images) && p.tourId.images.length > 0
                ? p.tourId.images[0]
                : null,
          }
        : null,
    }));

    createResponse(res, 200, {
      status: "success",
      results: data.length,
      data,
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Seyahatler alınırken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

// Delete user account
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.payload.id !== userId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi hesabınızı silebilirsiniz",
      });
    }

    const user = await User.findById(userId).select("_id");

    if (!user) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kullanıcı bulunamadı",
      });
    }

    const [userPurchases, reviewedTourIds] = await Promise.all([
      Purchase.find({ userId }).select("tourId"),
      Review.find({ userId }).distinct("tourId"),
    ]);

    if (userPurchases.length > 0) {
      const purchaseCountByTour = new Map();
      for (const purchase of userPurchases) {
        if (!purchase.tourId) continue;
        const key = purchase.tourId.toString();
        purchaseCountByTour.set(key, (purchaseCountByTour.get(key) || 0) + 1);
      }

      await Purchase.deleteMany({ userId });

      const capacityUpdates = Array.from(purchaseCountByTour.entries()).map(
        ([tourId, count]) => ({
          updateOne: {
            filter: { _id: new mongoose.Types.ObjectId(tourId) },
            update: [
              {
                $set: {
                  filledCapacity: {
                    $max: [0, { $subtract: ["$filledCapacity", count] }],
                  },
                },
              },
            ],
          },
        }),
      );

      if (capacityUpdates.length > 0) {
        await Tour.bulkWrite(capacityUpdates);
      }
    }

    if (reviewedTourIds.length > 0) {
      await Review.deleteMany({ userId });
      await Promise.all(reviewedTourIds.map((tourId) => syncTourReviewStats(tourId)));
    }

    await User.findByIdAndDelete(userId);

    res.status(204).send();
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Kullanıcı silinirken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

module.exports = {
  getUserDetail,
  updateUser,
  updateUserPassword,
  getUserPurchases,
  deleteUser,
};
