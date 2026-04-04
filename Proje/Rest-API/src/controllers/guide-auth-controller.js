const mongoose = require("mongoose");
const Guide = mongoose.model("Guide");
const { createResponse } = require("../utils/create-response");
const passport = require("passport");

// Rehber Kayıt (Register)
const register = async (req, res) => {
    try {
        // YAML dosyasıyla birebir aynı parametreler
        const { firstName, lastName, email, password, biography, languages, expertRoutes, phone } = req.body;

        // Sadece YAML'da required olanları zorunlu tutuyoruz
        if (!firstName || !lastName || !email || !password) {
            return createResponse(res, 400, {
                status: "error",
                message: "Ad, soyad, e-posta ve şifre zorunludur",
                statusCode: 400,
            });
        }

        const existingGuide = await Guide.findOne({ email });
        if (existingGuide) {
            return createResponse(res, 409, {
                status: "error",
                message: "Bu e-posta adresi zaten kayıtlı",
                statusCode: 409,
            });
        }

        const guide = new Guide({
            firstName,
            lastName,
            email,
            phone,
            biography,
            languages,
            expertRoutes
        });

        guide.setPassword(password);
        await guide.save();

        const token = guide.generateJWT();

        createResponse(res, 201, {
            status: "success",
            message: `${guide.firstName} başarıyla kayıt oldu`,
            token: token,
            guideId: guide._id,
        });
    } catch (error) {
        console.error("Rehber kayıt hatası:", error);
        createResponse(res, 500, {
            status: "error",
            message: "Sunucu hatası oluştu",
            statusCode: 500,
        });
    }
};

// Rehber Giriş (Login)
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return createResponse(res, 400, {
                status: "error",
                message: "E-posta ve şifre gereklidir",
                statusCode: 400,
            });
        }

        passport.authenticate(
            "guide-local",
            { session: false },
            (err, guide, info) => {
                if (err) {
                    return createResponse(res, 500, {
                        status: "error",
                        message: "Sunucu hatası oluştu",
                        statusCode: 500,
                    });
                }
                if (!guide) {
                    return createResponse(res, 401, {
                        status: "error",
                        message: info.message || "Giriş başarısız",
                        statusCode: 401,
                    });
                }

                const token = guide.generateJWT();

                createResponse(res, 200, {
                    status: "success",
                    message: `${guide.firstName} başarıyla giriş yaptı`,
                    token: token,
                    guideId: guide._id,
                });
            },
        )(req, res);
    } catch (error) {
        console.error("Rehber giriş hatası:", error);
        createResponse(res, 500, {
            status: "error",
            message: "Sunucu hatası oluştu",
            statusCode: 500,
        });
    }
};

module.exports = {
    register,
    login,
};