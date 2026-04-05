const mongoose = require("mongoose");
const Tour = mongoose.model("Tour");
const Review = mongoose.model("Review");
const { createResponse } = require("../utils/create-response");

const normalizeRating = (rating) => Number(rating);

const validateComment = (comment) =>
  typeof comment === "string" && comment.trim().length > 0;

const validateRating = (rating) => {
  const parsed = normalizeRating(rating);
  return Number.isFinite(parsed) && parsed >= 1 && parsed <= 5;
};

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

const syncTourReviewStats = async (tourId) => {
  if (!mongoose.Types.ObjectId.isValid(tourId)) return;

  const [stats] = await Review.aggregate([
    { $match: { tourId: new mongoose.Types.ObjectId(tourId) } },
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

const createTourReview = async (req, res) => {
  try {
    const { tourId } = req.params;
    const { comment, rating } = req.body;

    if (!req.payload?.id) {
      return createResponse(res, 401, {
        status: "error",
        message: "Yorum eklemek için giriş yapmalısınız",
      });
    }

    if (!validateComment(comment) || !validateRating(rating)) {
      return createResponse(res, 400, {
        status: "error",
        message: "Geçerli bir yorum metni ve 1-5 arası puan gönderin",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(tourId)) {
      return createResponse(res, 404, {
        status: "error",
        message: "Tur bulunamadı",
      });
    }

    const tour = await Tour.findById(tourId).select("_id");
    if (!tour) {
      return createResponse(res, 404, {
        status: "error",
        message: "Tur bulunamadı",
      });
    }

    const review = await Review.create({
      tourId,
      userId: req.payload.id,
      userName: req.payload.name || "Kullanıcı",
      comment: comment.trim(),
      rating: normalizeRating(rating),
    });

    await syncTourReviewStats(tourId);

    return createResponse(res, 201, {
      status: "success",
      message: "Yorum başarıyla eklendi",
      data: mapReview(review),
    });
  } catch (error) {
    console.error("Yorum eklenirken hata oluştu:", error);
    return createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment, rating } = req.body;

    if (!req.payload?.id) {
      return createResponse(res, 401, {
        status: "error",
        message: "Yorum güncellemek için giriş yapmalısınız",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return createResponse(res, 404, {
        status: "error",
        message: "Yorum bulunamadı",
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return createResponse(res, 404, {
        status: "error",
        message: "Yorum bulunamadı",
      });
    }

    if (`${review.userId}` !== req.payload.id) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi yorumunuzu güncelleyebilirsiniz",
      });
    }

    const updates = {};

    if (comment !== undefined) {
      if (!validateComment(comment)) {
        return createResponse(res, 400, {
          status: "error",
          message: "Yorum metni boş olamaz",
        });
      }
      updates.comment = comment.trim();
    }

    if (rating !== undefined) {
      if (!validateRating(rating)) {
        return createResponse(res, 400, {
          status: "error",
          message: "Puan 1 ile 5 arasında olmalıdır",
        });
      }
      updates.rating = normalizeRating(rating);
    }

    if (Object.keys(updates).length === 0) {
      return createResponse(res, 400, {
        status: "error",
        message: "Güncellenecek yorum alanı bulunamadı",
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(reviewId, updates, {
      new: true,
      runValidators: true,
    });

    await syncTourReviewStats(updatedReview.tourId);

    return createResponse(res, 200, {
      status: "success",
      message: "Yorum başarıyla güncellendi",
      data: mapReview(updatedReview),
    });
  } catch (error) {
    console.error("Yorum güncellenirken hata oluştu:", error);
    return createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!req.payload?.id) {
      return createResponse(res, 401, {
        status: "error",
        message: "Yorum silmek için giriş yapmalısınız",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return createResponse(res, 404, {
        status: "error",
        message: "Yorum bulunamadı",
      });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return createResponse(res, 404, {
        status: "error",
        message: "Yorum bulunamadı",
      });
    }

    if (`${review.userId}` !== req.payload.id) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi yorumunuzu silebilirsiniz",
      });
    }

    await Review.findByIdAndDelete(reviewId);
    await syncTourReviewStats(review.tourId);

    return createResponse(res, 200, {
      status: "success",
      message: "Yorum başarıyla silindi",
    });
  } catch (error) {
    console.error("Yorum silinirken hata oluştu:", error);
    return createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

module.exports = {
  createTourReview,
  updateReview,
  deleteReview,
};
