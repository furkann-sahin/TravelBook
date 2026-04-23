const mongoose = require("mongoose");
const Guide = mongoose.model("Guide");
const Company = mongoose.model("Company");
const { createResponse } = require("../utils/create-response");

// Rehber Tüm Tur Firmalarını Listeleme (GET /api/companies)
const listCompanies = async (req, res) => {
    try {
        const companies = await Company.find().select("name email phone address description rating tourCount");
        createResponse(res, 200, {
            status: "success",
            results: companies.length,
            data: companies,
        });
    } catch (error) {
        createResponse(res, 500, { status: "error", message: "Firmalar listelenirken hata oluştu" });
    }
};

// Rehber Detayı Gösterme
const getGuideDetail = async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.guideId);
        if (!guide) return createResponse(res, 404, { status: "error", message: "Rehber bulunamadı" });
        createResponse(res, 200, { status: "success", data: guide });
    } catch (error) {
        createResponse(res, 500, { status: "error", message: "Detay getirilirken hata oluştu" });
    }
};

// Rehber Profil Güncelleme
const updateGuideProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone, biography, languages, expertRoutes, experienceYears, profileImageUrl, instagram, linkedin } = req.body;
      
        if (req.payload.id !== req.params.guideId) {
            return createResponse(res, 403, { status: "error", message: "Yalnızca kendi profilinizi güncelleyebilirsiniz" });
        }

        const updatedGuide = await Guide.findByIdAndUpdate(
            req.params.guideId,
            { firstName, lastName, phone, biography, languages, expertRoutes, experienceYears, profileImageUrl, instagram, linkedin },
            { new: true, runValidators: true }
        );

        if (!updatedGuide) return createResponse(res, 404, { status: "error", message: "Rehber bulunamadı" });
        createResponse(res, 200, { status: "success", data: updatedGuide });
    } catch (error) {
        console.error("Güncelleme hatası:", error);
        createResponse(res, 500, { status: "error", message: "Güncelleme sırasında hata oluştu" });
    }
};

const ensureGuideOwnership = (req, res) => {
    if (req.payload.id !== req.params.guideId) {
        createResponse(res, 403, { status: "error", message: "Yalnızca kendi profilinizi güncelleyebilirsiniz" });
        return false;
    }

    return true;
};

// Rehber Kayıt Silme
const deleteGuide = async (req, res) => {
    try {
        if (req.payload.id !== req.params.guideId) {
            return createResponse(res, 403, { status: "error", message: "Yalnızca kendi hesabınızı silebilirsiniz" });
        }

        const deletedGuide = await Guide.findByIdAndDelete(req.params.guideId);
        if (!deletedGuide) return createResponse(res, 404, { status: "error", message: "Rehber bulunamadı" });
        createResponse(res, 200, { status: "success", message: "Kaydınız başarıyla silinmiştir" });
    } catch (error) {
        createResponse(res, 500, { status: "error", message: "Silme sırasında hata oluştu" });
    }
};

// Profil Resmi Yükleme
const uploadProfileImage = async (req, res) => {
    try {
        if (!ensureGuideOwnership(req, res)) return;

        if (!req.file) return createResponse(res, 400, { status: "error", message: "Dosya yüklenemedi" });

        const imageUrl = `/uploads/guides/${req.file.filename}`;
        const guide = await Guide.findByIdAndUpdate(
            req.params.guideId,
            { profileImageUrl: imageUrl },
            { new: true }
        );
        if (!guide) return createResponse(res, 404, { status: "error", message: "Rehber bulunamadı" });
        createResponse(res, 200, { status: "success", data: { profileImageUrl: imageUrl } });
    } catch (error) {
        console.error("Resim yükleme hatası:", error);
        createResponse(res, 500, { status: "error", message: "Resim yüklenirken hata oluştu" });
    }
};

const uploadBannerImage = async (req, res) => {
    try {
        if (!ensureGuideOwnership(req, res)) return;

        if (!req.file) return createResponse(res, 400, { status: "error", message: "Dosya yüklenemedi" });

        const imageUrl = `/uploads/guides/${req.file.filename}`;
        const guide = await Guide.findByIdAndUpdate(
            req.params.guideId,
            { bannerImageUrl: imageUrl },
            { new: true }
        );

        if (!guide) return createResponse(res, 404, { status: "error", message: "Rehber bulunamadı" });
        createResponse(res, 200, { status: "success", data: { bannerImageUrl: imageUrl } });
    } catch (error) {
        console.error("Kapak fotoğrafı yükleme hatası:", error);
        createResponse(res, 500, { status: "error", message: "Kapak fotoğrafı yüklenirken hata oluştu" });
    }
};

const uploadGalleryImage = async (req, res) => {
    try {
        if (!ensureGuideOwnership(req, res)) return;

        if (!req.file) return createResponse(res, 400, { status: "error", message: "Dosya yüklenemedi" });

        const imageUrl = `/uploads/guides/${req.file.filename}`;
        const guide = await Guide.findByIdAndUpdate(
            req.params.guideId,
            { $addToSet: { galleryImageUrls: imageUrl } },
            { new: true }
        );

        if (!guide) return createResponse(res, 404, { status: "error", message: "Rehber bulunamadı" });
        createResponse(res, 200, {
            status: "success",
            data: {
                imageUrl,
                galleryImageUrls: guide.galleryImageUrls,
            },
        });
    } catch (error) {
        console.error("Galeri fotoğrafı yükleme hatası:", error);
        createResponse(res, 500, { status: "error", message: "Galeri fotoğrafı yüklenirken hata oluştu" });
    }
};

const removeGalleryImage = async (req, res) => {
    try {
        if (!ensureGuideOwnership(req, res)) return;

        const { imageUrl } = req.body;
        if (!imageUrl) {
            return createResponse(res, 400, { status: "error", message: "Silinecek fotoğraf belirtilmedi" });
        }

        const guide = await Guide.findByIdAndUpdate(
            req.params.guideId,
            { $pull: { galleryImageUrls: imageUrl } },
            { new: true }
        );

        if (!guide) return createResponse(res, 404, { status: "error", message: "Rehber bulunamadı" });
        createResponse(res, 200, {
            status: "success",
            data: { galleryImageUrls: guide.galleryImageUrls },
        });
    } catch (error) {
        console.error("Galeri fotoğrafı silme hatası:", error);
        createResponse(res, 500, { status: "error", message: "Galeri fotoğrafı silinirken hata oluştu" });
    }
};

// GET /api/guides
const getAllGuides = async (_req, res) => {
  try {
    const guides = await Guide.find()
      .select("firstName lastName email phone experienceYears languages biography rating profileImageUrl")
      .sort({ rating: -1 });

    const guideList = guides.map((guide) => ({
      id: guide._id,
      name: `${guide.firstName || ""} ${guide.lastName || ""}`.trim(),
      email: guide.email,
      phone: guide.phone,
      experience: guide.experienceYears,
      languages: guide.languages,
      bio: guide.biography,
      rating: guide.rating,
      profileImage: guide.profileImageUrl || null,
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

module.exports = {
    listCompanies,
    getGuideDetail,
    updateGuideProfile,
    deleteGuide,
    getAllGuides,
    uploadProfileImage,
    uploadBannerImage,
    uploadGalleryImage,
    removeGalleryImage,
};
