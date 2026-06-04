const mongoose = require("mongoose");
const Company = mongoose.model("Company");
const Tour = mongoose.model("Tour");
const Guide = mongoose.model("Guide");
const Purchase = mongoose.model("Purchase");
const Review = mongoose.model("Review");
const User = mongoose.model("User");
const { createResponse } = require("../utils/create-response");
const { persistUploadedImage } = require("../utils/image-storage");

// Get company detail
const getCompanyDetail = async (req, res) => {
  try {
    const { companyId } = req.params;

    const company = await Company.findById(companyId);

    if (!company) {
      return createResponse(res, 404, {
        status: "error",
        message: "Firma bulunamadı",
      });
    }

    createResponse(res, 200, {
      status: "success",
      data: company,
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Firma detayları alınırken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

// Delete company account
const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Check if the authenticated company matches the requested companyId
    if (req.payload.id !== companyId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi hesabınızı silebilirsiniz",
      });
    }

    const company = await Company.findById(companyId).select("_id registeredGuides");

    if (!company) {
      return createResponse(res, 404, {
        status: "error",
        message: "Firma bulunamadı",
      });
    }

    const tours = await Tour.find({ companyId }).select("_id guideId");
    const tourIds = tours.map((tour) => tour._id);

    const relatedGuideIdSet = new Set(
      (company.registeredGuides || []).map((guideId) => guideId.toString()),
    );
    for (const tour of tours) {
      if (tour.guideId) {
        relatedGuideIdSet.add(tour.guideId.toString());
      }
    }

    const relatedGuideIds = Array.from(relatedGuideIdSet).map(
      (id) => new mongoose.Types.ObjectId(id),
    );

    const cleanupOperations = [];

    if (relatedGuideIds.length > 0) {
      cleanupOperations.push(
        Guide.updateMany(
          { _id: { $in: relatedGuideIds } },
          {
            $pull: {
              registeredCompanies: company._id,
              registeredTours: { $in: tourIds },
            },
          },
        ),
      );
    }

    if (tourIds.length > 0) {
      cleanupOperations.push(
        Purchase.deleteMany({ tourId: { $in: tourIds } }),
        Review.deleteMany({ tourId: { $in: tourIds } }),
        User.updateMany({}, { $pull: { favorites: { $in: tourIds } } }),
        Tour.deleteMany({ _id: { $in: tourIds } }),
      );
    }

    cleanupOperations.push(Company.findByIdAndDelete(companyId));

    await Promise.all(cleanupOperations);

    createResponse(res, 200, {
      status: "success",
      message: "Firma hesabı başarıyla silindi",
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Firma silinirken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

// Update company profile
const updateCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (req.payload.id !== companyId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi profilinizi güncelleyebilirsiniz",
      });
    }

    const allowedFields = [
      "name",
      "phone",
      "address",
      "description",
      "instagram",
      "linkedin",
    ];
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

    const company = await Company.findByIdAndUpdate(companyId, updates, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return createResponse(res, 404, {
        status: "error",
        message: "Firma bulunamadı",
      });
    }

    createResponse(res, 200, {
      status: "success",
      message: "Profil başarıyla güncellendi",
      data: company,
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Firma güncellenirken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

// Upload company profile image
const uploadProfileImage = async (req, res) => {
  try {
    const { companyId } = req.params;
    if (req.payload.id !== companyId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi resminizi yükleyebilirsiniz",
      });
    }
    if (!req.file) {
      return createResponse(res, 400, {
        status: "error",
        message: "Dosya yüklenemedi",
      });
    }
    const imageUrl = await persistUploadedImage(req.file, "uploads/companies");
    const company = await Company.findByIdAndUpdate(
      companyId,
      { profileImageUrl: imageUrl },
      { new: true },
    );
    if (!company) {
      return createResponse(res, 404, {
        status: "error",
        message: "Firma bulunamadı",
      });
    }
    createResponse(res, 200, {
      status: "success",
      data: { profileImageUrl: imageUrl },
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Firma profil resmi yüklenirken hata oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

// Upload company banner image
const uploadBannerImage = async (req, res) => {
  try {
    const { companyId } = req.params;
    if (req.payload.id !== companyId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi kapak fotoğrafınızı yükleyebilirsiniz",
      });
    }
    if (!req.file) {
      return createResponse(res, 400, {
        status: "error",
        message: "Dosya yüklenemedi",
      });
    }
    const imageUrl = await persistUploadedImage(req.file, "uploads/companies");
    const company = await Company.findByIdAndUpdate(
      companyId,
      { bannerImageUrl: imageUrl },
      { new: true },
    );
    if (!company) {
      return createResponse(res, 404, {
        status: "error",
        message: "Firma bulunamadı",
      });
    }
    createResponse(res, 200, {
      status: "success",
      data: { bannerImageUrl: imageUrl },
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Firma kapak resmi yüklenirken hata oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

module.exports = {
  getCompanyDetail,
  deleteCompany,
  updateCompany,
  uploadProfileImage,
  uploadBannerImage,
};
