const mongoose = require("mongoose");
const Guide = mongoose.model("Guide");
const { createResponse } = require("../utils/create-response");

// GET /api/guides
const getAllGuides = async (_req, res) => {
  try {
    const guides = await Guide.find()
      .select("name email phone experience languages bio rating profileImage")
      .sort({ rating: -1 });

    const guideList = guides.map((guide) => ({
      id: guide._id,
      name: guide.name,
      email: guide.email,
      phone: guide.phone,
      experience: guide.experience,
      languages: guide.languages,
      bio: guide.bio,
      rating: guide.rating,
      profileImage: guide.profileImage || null,
    }));

    createResponse(res, 200, {
      status: "success",
      results: guideList.length,
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

module.exports = { getAllGuides };
