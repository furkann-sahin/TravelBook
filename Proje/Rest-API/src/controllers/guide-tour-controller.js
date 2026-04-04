const mongoose = require("mongoose");
const Guide = mongoose.model("Guide");
const { createResponse } = require("../utils/create-response");

// Rehberin Kayıtlı Olduğu Turları Listeleme
const listGuideTours = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.guideId).populate("registeredTours");
    if (!guide) return createResponse(res, 404, { message: "Rehber bulunamadı" });
    createResponse(res, 200, guide.registeredTours);
  } catch (error) {
    createResponse(res, 500, { message: "Turlar listelenirken hata oluştu" });
  }
};

// Rehber Tur Kaydetme / Atanma
const assignGuideToTour = async (req, res) => {
  try {
    const { tourId } = req.body;
    const guide = await Guide.findById(req.params.guideId);

    if (!guide) return createResponse(res, 404, { message: "Rehber bulunamadı" });
    if (guide.registeredTours.includes(tourId)) {
      return createResponse(res, 409, { message: "Rehber zaten bu tura kayıtlı" });
    }

    guide.registeredTours.push(tourId);
    await guide.save();
    createResponse(res, 201, { message: "Rehber tura başarıyla atandı" });
  } catch (error) {
    createResponse(res, 500, { message: "Tura atanırken hata oluştu" });
  }
};

// Rehber Tur Silme / Ayrılma
const removeGuideFromTour = async (req, res) => {
  try {
    const { guideId, tourId } = req.params;
    const guide = await Guide.findById(guideId);

    if (!guide) return createResponse(res, 404, { message: "Rehber bulunamadı" });

    const tourObjectId = new mongoose.Types.ObjectId(tourId);
    if (!guide.registeredTours.some(id => id.equals(tourObjectId))) {
      return createResponse(res, 404, { message: "Bu tur kaydınızda bulunamadı" });
    }

    guide.registeredTours.pull(tourObjectId);
    await guide.save();
    createResponse(res, 200, { message: "Tur kaydınız başarıyla silinmiştir" });
  } catch (error) {
    console.error("Turdan ayrılma hatası:", error);
    createResponse(res, 500, { message: "Turdan ayrılırken hata oluştu" });
  }
};

module.exports = { listGuideTours, assignGuideToTour, removeGuideFromTour };