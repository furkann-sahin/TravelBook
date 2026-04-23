const mongoose = require("mongoose");
const User = mongoose.model("User");
const { createResponse } = require("../utils/create-response");
const passport = require("passport");

// User registration controller
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return createResponse(res, 400, {
        status: "error",
        message: "Ad, e-posta ve şifre alanları zorunludur",
        statusCode: 400,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return createResponse(res, 409, {
        status: "error",
        message: "Bu e-posta adresi zaten kayıtlı",
        statusCode: 409,
      });
    }

    const user = new User({
      name,
      email,
      phone: phone || "",
    });

    user.setPassword(password);
    await user.save();

    const token = user.generateJWT();

    createResponse(res, 201, {
      status: "success",
      message: `${user.name} başarıyla kayıt oldu`,
      token,
    });
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Kullanıcı kaydı sırasında sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
      statusCode: 500,
    });
  }
};

// User login controller
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
      "user-local",
      { session: false },
      (err, user, info) => {
        if (err) {
          return createResponse(res, 500, {
            status: "error",
            message: "Sunucu hatası oluştu",
            statusCode: 500,
          });
        }
        if (!user) {
          return createResponse(res, 401, {
            status: "error",
            message: info.message,
            statusCode: 401,
          });
        }

        const token = user.generateJWT();

        createResponse(res, 200, {
          status: "success",
          message: `${user.name} başarıyla giriş yaptı`,
          token,
        });
      },
    )(req, res);
  } catch (error) {
    createResponse(res, 500, {
      status: "error",
      message: `Kullanıcı girişi sırasında sunucu hatası oluştu. Detay: ${error?.message || "Bilinmeyen hata"}`,
      statusCode: 500,
    });
  }
};

module.exports = {
  register,
  login,
};
