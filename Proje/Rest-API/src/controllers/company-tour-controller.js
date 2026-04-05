const mongoose = require("mongoose");
const Tour = mongoose.model("Tour");
const Company = mongoose.model("Company");
const Guide = mongoose.model("Guide");
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
        "name location price startDate endDate images services rating",
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
      services: tour.services,
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

// Create a new tour for a company
const createTour = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Verify the authenticated company matches the requested companyId
    if (req.payload.id !== companyId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi firmanız için tur oluşturabilirsiniz",
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

    // When sent as multipart/form-data, all fields arrive as strings
    const name = req.body.name;
    const description = req.body.description;
    const location = req.body.location;
    const price = Number(req.body.price);
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const totalCapacity = Number(req.body.totalCapacity);

    // Validate required fields
    if (!name || !description || !location || req.body.price == null || !startDate || !endDate || !req.body.totalCapacity) {
      return createResponse(res, 400, {
        status: "error",
        message: "Tüm zorunlu alanların doldurulması gereklidir (name, description, location, price, startDate, endDate, totalCapacity)",
      });
    }

    // Validate price
    if (isNaN(price) || price < 0) {
      return createResponse(res, 400, {
        status: "error",
        message: "Fiyat geçerli bir sayı olmalıdır ve negatif olamaz",
      });
    }

    // Validate capacity
    if (!Number.isInteger(totalCapacity) || totalCapacity < 1) {
      return createResponse(res, 400, {
        status: "error",
        message: "Kapasite en az 1 olmalıdır",
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return createResponse(res, 400, {
        status: "error",
        message: "Geçerli tarih formatları giriniz",
      });
    }
    if (end <= start) {
      return createResponse(res, 400, {
        status: "error",
        message: "Bitiş tarihi başlangıç tarihinden sonra olmalıdır",
      });
    }

    // Build images array from uploaded file (if any)
    const images = [];
    if (req.file) {
      images.push(`/images/tours/${req.file.filename}`);
    }

    // Parse services (arrives as JSON string from multipart/form-data)
    let services = [];
    if (req.body.services) {
      try {
        const parsed = JSON.parse(req.body.services);
        if (Array.isArray(parsed)) {
          services = parsed.map((s) => String(s).trim()).filter(Boolean);
        }
      } catch {
        // If not valid JSON, treat as comma-separated string
        services = req.body.services.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }

    const tour = new Tour({
      name,
      description,
      location,
      price,
      startDate: start,
      endDate: end,
      totalCapacity,
      places: [],
      images,
      services,
      companyId,
      guideId: req.body.guideId || null,
    });

    await tour.save();

    // If a guide was assigned, add this tour to the guide's registeredTours
    if (req.body.guideId) {
      await Guide.findByIdAndUpdate(req.body.guideId, {
        $addToSet: { registeredTours: tour._id },
      });
    }

    createResponse(res, 201, {
      status: "success",
      message: "Tur başarıyla oluşturuldu",
      data: {
        id: tour._id,
        name: tour.name,
        description: tour.description,
        location: tour.location,
        price: tour.price,
        startDate: tour.startDate,
        endDate: tour.endDate,
        totalCapacity: tour.totalCapacity,
        filledCapacity: tour.filledCapacity,
        places: tour.places,
        images: tour.images,
        services: tour.services,
        guideId: tour.guideId,
        companyId: tour.companyId,
      },
    });
  } catch (error) {
    console.error("Tur oluşturulurken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

// List all guides (for company to assign when creating a tour)
const listCompanyGuides = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (req.payload.id !== companyId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yetkisiz erişim",
      });
    }

    const company = await Company.findById(companyId);
    if (!company) {
      return createResponse(res, 404, {
        status: "error",
        message: "Firma bulunamadı",
      });
    }

    const guides = await Guide.find({ _id: { $in: company.registeredGuides } })
      .select("firstName lastName email phone languages expertRoutes rating")
      .sort({ firstName: 1 });

    const guideList = guides.map((g) => ({
      id: g._id,
      firstName: g.firstName,
      lastName: g.lastName,
      email: g.email,
      phone: g.phone,
      languages: g.languages,
      expertRoutes: g.expertRoutes,
      rating: g.rating,
    }));

    createResponse(res, 200, {
      status: "success",
      data: guideList,
    });
  } catch (error) {
    console.error("Rehberler listelenirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

module.exports = {
  listCompanyTours,
  createTour,
  listCompanyGuides,
};
