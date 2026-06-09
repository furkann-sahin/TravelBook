const mongoose = require("mongoose");
const Tour = mongoose.model("Tour");
const Company = mongoose.model("Company");
const Guide = mongoose.model("Guide");
const { createResponse } = require("../utils/create-response");
const { persistUploadedImage } = require("../utils/image-storage");

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
    createResponse(res, 500, {
      status: "error",
      message: `Firma turları listelenirken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
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

    // Fields validated by Joi; cast numeric/date types (multipart/form-data string conversion)
    const name = req.body.name;
    const description = req.body.description;
    const location = req.body.location;
    const price = Number(req.body.price);
    const totalCapacity = Number(req.body.totalCapacity);
    const start = new Date(req.body.startDate);
    const end = new Date(req.body.endDate);

    // Business rule: başlangıç tarihi geçmişte olamaz
    if (start < new Date()) {
      return createResponse(res, 400, {
        status: "error",
        message: "Başlangıç tarihi geçmiş bir tarih olamaz",
      });
    }

    // Build images array from uploaded file (if any)
    const images = [];
    if (req.file) {
      images.push(await persistUploadedImage(req.file, "images/tours"));
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

    // Parse places/destinations
    let places = [];
    if (req.body.places) {
      try {
        const parsed = JSON.parse(req.body.places);
        if (Array.isArray(parsed)) {
          places = parsed.map((s) => String(s).trim()).filter(Boolean);
        }
      } catch {
        places = req.body.places.split(",").map((s) => s.trim()).filter(Boolean);
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
      places,
      departureLocation: req.body.departureLocation?.trim() || "",
      arrivalLocation: req.body.arrivalLocation?.trim() || "",
      images,
      services,
      companyId,
      guideId: null,
    });

    // Validate guideId if provided
    if (req.body.guideId) {
      if (!company.registeredGuides.some((id) => id.equals(req.body.guideId))) {
        return createResponse(res, 400, {
          status: "error",
          message: "Bu rehber firmanıza kayıtlı değil",
        });
      }
      tour.guideId = req.body.guideId;
    }

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
        departureLocation: tour.departureLocation,
        arrivalLocation: tour.arrivalLocation,
        images: tour.images,
        services: tour.services,
        guideId: tour.guideId,
        companyId: tour.companyId,
      },
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Tur oluşturulurken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
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
    createResponse(res, 500, {
      status: "error",
      message: `Rehberler listelenirken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

// Get a single tour detail for a company
const getCompanyTourDetail = async (req, res) => {
  try {
    const { companyId, tourId } = req.params;

    if (req.payload.id !== companyId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi turlarınızı görüntüleyebilirsiniz",
      });
    }

    const tour = await Tour.findOne({ _id: tourId, companyId });
    if (!tour) {
      return createResponse(res, 404, {
        status: "error",
        message: "Tur bulunamadı",
      });
    }

    const company = await Company.findById(companyId).select("name");

    let guide = null;
    if (tour.guideId) {
      const g = await Guide.findById(tour.guideId).select("firstName lastName email phone");
      if (g) {
        guide = {
          id: g._id,
          firstName: g.firstName,
          lastName: g.lastName,
          email: g.email,
          phone: g.phone,
        };
      }
    }

    createResponse(res, 200, {
      status: "success",
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
        departureLocation: tour.departureLocation,
        arrivalLocation: tour.arrivalLocation,
        images: tour.images,
        services: tour.services,
        guideId: tour.guideId,
        companyId: tour.companyId,
        companyName: company?.name || "",
        guide,
        rating: tour.rating,
        reviewCount: tour.reviewCount,
      },
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Tur detayı alınırken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

// Update a company tour
const updateCompanyTour = async (req, res) => {
  try {
    const { companyId, tourId } = req.params;

    if (req.payload.id !== companyId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi turlarınızı güncelleyebilirsiniz",
      });
    }

    const tour = await Tour.findOne({ _id: tourId, companyId });
    if (!tour) {
      return createResponse(res, 404, {
        status: "error",
        message: "Tur bulunamadı",
      });
    }

    const allowedFields = [
      "name", "description", "location", "price", "startDate", "endDate",
      "totalCapacity", "departureLocation", "arrivalLocation",
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === "price" || field === "totalCapacity") {
          tour[field] = Number(req.body[field]);
        } else if (field === "startDate" || field === "endDate") {
          tour[field] = new Date(req.body[field]);
        } else {
          tour[field] = req.body[field];
        }
      }
    }

    // Handle places array
    if (req.body.places !== undefined) {
      if (Array.isArray(req.body.places)) {
        tour.places = req.body.places.map((s) => String(s).trim()).filter(Boolean);
      }
    }

    // Handle services array
    if (req.body.services !== undefined) {
      if (Array.isArray(req.body.services)) {
        tour.services = req.body.services.map((s) => String(s).trim()).filter(Boolean);
      }
    }

    await tour.save();

    createResponse(res, 200, {
      status: "success",
      message: "Tur başarıyla güncellendi",
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
        departureLocation: tour.departureLocation,
        arrivalLocation: tour.arrivalLocation,
        images: tour.images,
        services: tour.services,
        guideId: tour.guideId,
        companyId: tour.companyId,
      },
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Tur güncellenirken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

// Delete a company tour
const deleteCompanyTour = async (req, res) => {
  try {
    const { companyId, tourId } = req.params;

    if (req.payload.id !== companyId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi turlarınızı silebilirsiniz",
      });
    }

    const tour = await Tour.findOne({ _id: tourId, companyId });
    if (!tour) {
      return createResponse(res, 404, {
        status: "error",
        message: "Tur bulunamadı",
      });
    }

    // Remove tour from guide's registeredTours if assigned
    if (tour.guideId) {
      await Guide.findByIdAndUpdate(tour.guideId, {
        $pull: { registeredTours: tour._id },
      });
    }

    await Tour.findByIdAndDelete(tourId);

    createResponse(res, 200, {
      status: "success",
      message: "Tur başarıyla silindi",
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Tur silinirken sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
    });
  }
};

module.exports = {
  listCompanyTours,
  createTour,
  listCompanyGuides,
  getCompanyTourDetail,
  updateCompanyTour,
  deleteCompanyTour,
};
