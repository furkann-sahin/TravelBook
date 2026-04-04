const mongoose = require("mongoose");
const Tour = mongoose.model("Tour");
const Company = mongoose.model("Company");
const { createResponse } = require("../utils/create-response");

// List tours for a company
const listCompanyTours = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Verify the authenticated company matches the requested companyId
    if (req.payload.id !== companyId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi turlarınızı görüntüleyebilirsiniz",
      });
    }

    // Verify company exists
    const company = await Company.findById(companyId);
    if (!company) {
      return createResponse(res, 404, {
        status: "error",
        message: "Firma bulunamadı",
      });
    }

    const tours = await Tour.find({ companyId })
      .select(
        "name location price startDate endDate images rating",
      )
      .sort({ startDate: -1 });

    const tourList = tours.map((tour) => ({
      id: tour._id,
      name: tour.name,
      location: tour.location,
      price: tour.price,
      startDate: tour.startDate,
      endDate: tour.endDate,
      imageUrl: tour.images.length > 0 ? tour.images[0] : null,
      companyName: company.name,
      rating: tour.rating,
    }));

    createResponse(res, 200, {
      status: "success",
      data: tourList,
    });
  } catch (error) {
    console.error("Firma turları listelenirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

module.exports = {
  listCompanyTours,
};
