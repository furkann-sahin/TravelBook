const mongoose = require("mongoose");
const Guide = mongoose.model("Guide");
const Tour = mongoose.model("Tour");
const { createResponse } = require("../utils/create-response");

// Rehberin Kayıtlı Olduğu Turları Listeleme
const listGuideTours = async (req, res) => {
  try {
    if (req.payload.id !== req.params.guideId) {
      return createResponse(res, 403, { status: "error", message: "Yalnızca kendi turlarınızı görüntüleyebilirsiniz" });
    }

    const guide = await Guide.findById(req.params.guideId).populate("registeredTours");
    if (!guide) return createResponse(res, 404, { status: "error", message: "Rehber bulunamadı" });
    createResponse(res, 200, { status: "success", data: guide.registeredTours });
  } catch (error) {
    createResponse(res, 500, { status: "error", message: "Turlar listelenirken hata oluştu" });
  }
};

// Rehber Tur Kaydetme / Atanma
const assignGuideToTour = async (req, res) => {
  try {
    if (req.payload.id !== req.params.guideId) {
      return createResponse(res, 403, { status: "error", message: "Yalnızca kendi turlarınızı yönetebilirsiniz" });
    }

    const { tourId } = req.body;

    if (!tourId || !mongoose.Types.ObjectId.isValid(tourId)) {
      return createResponse(res, 400, { status: "error", message: "Geçerli bir tur ID gereklidir" });
    }

    const tour = await Tour.findById(tourId);
    if (!tour) return createResponse(res, 404, { status: "error", message: "Tur bulunamadı" });

    const guide = await Guide.findById(req.params.guideId);

    if (!guide) return createResponse(res, 404, { status: "error", message: "Rehber bulunamadı" });
    if (!guide.registeredCompanies.some(id => id.equals(tour.companyId))) {
      return createResponse(res, 403, { status: "error", message: "Bu tura atanabilmek için turun sahibi firmaya kayıtlı olmalısınız" });
    }
    if (guide.registeredTours.includes(tourId)) {
      return createResponse(res, 409, { status: "error", message: "Rehber zaten bu tura kayıtlı" });
    }

    guide.registeredTours.push(tourId);
    await guide.save();
    createResponse(res, 201, { status: "success", message: "Rehber tura başarıyla atandı" });
  } catch (error) {
    createResponse(res, 500, { status: "error", message: "Tura atanırken hata oluştu" });
  }
};

// Rehber Tur Silme / Ayrılma
const removeGuideFromTour = async (req, res) => {
  try {
    const { guideId, tourId } = req.params;

    if (req.payload.id !== guideId) {
      return createResponse(res, 403, { status: "error", message: "Yalnızca kendi turlarınızı yönetebilirsiniz" });
    }

    const guide = await Guide.findById(guideId);

    if (!guide) return createResponse(res, 404, { status: "error", message: "Rehber bulunamadı" });

    const tourObjectId = new mongoose.Types.ObjectId(tourId);
    if (!guide.registeredTours.some(id => id.equals(tourObjectId))) {
      return createResponse(res, 404, { status: "error", message: "Bu tur kaydınızda bulunamadı" });
    }

    guide.registeredTours.pull(tourObjectId);
    await guide.save();
    createResponse(res, 200, { status: "success", message: "Tur kaydınız başarıyla silinmiştir" });
  } catch (error) {
    console.error("Turdan ayrılma hatası:", error);
    createResponse(res, 500, { status: "error", message: "Turdan ayrılırken hata oluştu" });
  }
};

module.exports = { listGuideTours, assignGuideToTour, removeGuideFromTour };