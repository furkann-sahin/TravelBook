const mongoose = require("mongoose");
const Company = mongoose.model("Company");
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

    const company = await Company.findByIdAndDelete(companyId);

    if (!company) {
      return createResponse(res, 404, {
        status: "error",
        message: "Firma bulunamadı",
      });
    }

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
