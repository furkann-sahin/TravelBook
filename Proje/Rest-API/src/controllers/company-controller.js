const mongoose = require("mongoose");
const Company = mongoose.model("Company");
const { createResponse } = require("../utils/create-response");

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
    console.error("Firma detayları alınırken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
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
    console.error("Firma silinirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
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

    const allowedFields = ["name", "phone", "address", "description"];
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
    console.error("Firma güncellenirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

module.exports = {
  getCompanyDetail,
  deleteCompany,
  updateCompany,
};
