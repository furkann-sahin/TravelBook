const mongoose = require("mongoose");
const Guide = mongoose.model("Guide");
const Company = mongoose.model("Company");
const { createResponse } = require("../utils/create-response");

// Rehber Tüm Tur Firmalarını Listeleme (GET /api/companies)
const listCompanies = async (req, res) => {
    try {
        const companies = await Company.find().select("name email phone address description rating tourCount");
        createResponse(res, 200, companies);
    } catch (error) {
        createResponse(res, 500, { message: "Firmalar listelenirken hata oluştu" });
    }
};

// Rehber Detayı Gösterme
const getGuideDetail = async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.guideId);
        if (!guide) return createResponse(res, 404, { message: "Rehber bulunamadı" });
        createResponse(res, 200, guide);
    } catch (error) {
        createResponse(res, 500, { message: "Detay getirilirken hata oluştu" });
    }
};

// Rehber Profil Güncelleme
const updateGuideProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, biography, languages, expertRoutes, profileImageUrl } = req.body;

        const updatedGuide = await Guide.findByIdAndUpdate(
            req.params.guideId,
            { firstName, lastName, phone, biography, languages, expertRoutes, profileImageUrl },
            { new: true, runValidators: true }
        );

        if (!updatedGuide) return createResponse(res, 404, { message: "Rehber bulunamadı" });
        createResponse(res, 200, updatedGuide);
    } catch (error) {
        console.error("Güncelleme hatası:", error);
        createResponse(res, 500, { message: "Güncelleme sırasında hata oluştu" });
    }
};

// Rehber Kayıt Silme
const deleteGuide = async (req, res) => {
    try {
        const deletedGuide = await Guide.findByIdAndDelete(req.params.guideId);
        if (!deletedGuide) return createResponse(res, 404, { message: "Rehber bulunamadı" });
        createResponse(res, 200, { message: "Kaydınız başarıyla silinmiştir" });
    } catch (error) {
        createResponse(res, 500, { message: "Silme sırasında hata oluştu" });
    }
};

// Profil Resmi Yükleme
const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file) return createResponse(res, 400, { message: "Dosya yüklenemedi" });

        const imageUrl = `/uploads/guides/${req.file.filename}`;
        const guide = await Guide.findByIdAndUpdate(
            req.params.guideId,
            { profileImageUrl: imageUrl },
            { new: true }
        );
        if (!guide) return createResponse(res, 404, { message: "Rehber bulunamadı" });
        createResponse(res, 200, { profileImageUrl: imageUrl });
    } catch (error) {
        console.error("Resim yükleme hatası:", error);
        createResponse(res, 500, { message: "Resim yüklenirken hata oluştu" });
    }
};

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

module.exports = { listCompanies, getGuideDetail, updateGuideProfile, deleteGuide, getAllGuides, uploadProfileImage};
