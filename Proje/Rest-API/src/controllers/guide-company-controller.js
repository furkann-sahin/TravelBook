const mongoose = require("mongoose");
const Guide = mongoose.model("Guide");
const Company = mongoose.model("Company");
const { createResponse } = require("../utils/create-response");

// Rehberin kayıt olduğu firmaları listeleme (GET /api/guides/:guideId/companies)
const listSavedGuideCompanies = async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.guideId).populate(
            "registeredCompanies",
            "name email phone address description rating tourCount"
        );
        if (!guide)
            return createResponse(res, 404, { message: "Rehber bulunamadı" });
        createResponse(res, 200, guide.registeredCompanies);
    } catch (error) {
        createResponse(res, 500, {
            message: "Firmalar listelenirken hata oluştu",
        });
    }
};

// Rehber firmaya kayıt olma (POST /api/guides/:guideId/companies)
const applyToCompany = async (req, res) => {
    try {
        const { companyId } = req.body;
        if (!companyId)
            return createResponse(res, 400, { message: "companyId gereklidir" });

        const guide = await Guide.findById(req.params.guideId);
        if (!guide)
            return createResponse(res, 404, { message: "Rehber bulunamadı" });

        const company = await Company.findById(companyId);
        if (!company)
            return createResponse(res, 404, { message: "Firma bulunamadı" });

        // Zaten kayıtlı mı kontrol et
        const companyObjectId = new mongoose.Types.ObjectId(companyId);
        if (guide.registeredCompanies.some((id) => id.equals(companyObjectId))) {
            return createResponse(res, 409, {
                message: "Bu firmaya zaten kayıtlısınız",
            });
        }

        // İki tarafta da güncelle
        guide.registeredCompanies.push(companyObjectId);
        await guide.save();

        const guideObjectId = new mongoose.Types.ObjectId(guide._id);
        if (!company.registeredGuides.some((id) => id.equals(guideObjectId))) {
            company.registeredGuides.push(guideObjectId);
            await company.save();
        }

        createResponse(res, 201, { message: "Firmaya başarıyla kayıt oldunuz" });
    } catch (error) {
        console.error("Firmaya kayıt hatası:", error);
        createResponse(res, 500, {
            message: "Firmaya kayıt olurken hata oluştu",
        });
    }
};

// Rehber firma kaydını silme (DELETE /api/guides/:guideId/companies/:companyId)
const removeFromCompany = async (req, res) => {
    try {
        const { guideId, companyId } = req.params;

        const guide = await Guide.findById(guideId);
        if (!guide)
            return createResponse(res, 404, { message: "Rehber bulunamadı" });

        const companyObjectId = new mongoose.Types.ObjectId(companyId);
        if (!guide.registeredCompanies.some((id) => id.equals(companyObjectId))) {
            return createResponse(res, 404, {
                message: "Bu firma kaydınızda bulunamadı",
            });
        }

        // İki taraftan da sil
        guide.registeredCompanies.pull(companyObjectId);
        await guide.save();

        const company = await Company.findById(companyId);
        if (company) {
            company.registeredGuides.pull(new mongoose.Types.ObjectId(guideId));
            await company.save();
        }

        createResponse(res, 200, { message: "Firma kaydınız başarıyla silindi" });
    } catch (error) {
        console.error("Firmadan ayrılma hatası:", error);
        createResponse(res, 500, {
            message: "Firmadan ayrılırken hata oluştu",
        });
    }
};


module.exports = {
    listSavedGuideCompanies,
    applyToCompany,
    removeFromCompany,
};
