const mongoose = require("mongoose");
const Company = mongoose.model("Company");
const { createResponse } = require("../utils/create-response");
const passport = require("passport");

// Company registration controller
const register = async (req, res) => {
  try {
    const { name, email, password, description, phone, address } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phone || !address) {
      return createResponse(res, 400, {
        status: "error",
        message: "Tüm alanların doldurulması zorunludur",
        statusCode: 400,
      });
    }

    // Check if the company already exists
    const existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return createResponse(res, 409, {
        status: "error",
        message: "Bu e-posta adresi zaten kayıtlı",
        statusCode: 409,
      });
    }

    // Create a new company
    const company = new Company({
      name: name,
      email: email,
      description: description,
      phone: phone,
      address: address,
    });

    // Set password and save the company
    company.setPassword(password);
    await company.save();

    // Generate JWT token for auto-login after registration
    const token = company.generateJWT();

    createResponse(res, 201, {
      status: "success",
      message: `${company.name} başarıyla kayıt oldu`,
      token: token,
    });
  } catch (error) {
    console.error("Error during company registration:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
      statusCode: 500,
    });
  }
};

// Company login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return createResponse(res, 400, {
        status: "error",
        message: "E-posta ve şifre gereklidir",
        statusCode: 400,
      });
    }

    // Authenticate using Passport
    passport.authenticate(
      "company-local",
      { session: false },
      (err, company, info) => {
        if (err) {
          return createResponse(res, 500, {
            status: "error",
            message: "Sunucu hatası oluştu",
            statusCode: 500,
          });
        }
        if (!company) {
          return createResponse(res, 401, {
            status: "error",
            message: info.message,
            statusCode: 401,
          });
        }
        // Generate JWT token
        const token = company.generateJWT();

        createResponse(res, 200, {
          status: "success",
          message: `${company.name} başarıyla giriş yaptı`,
          token: token,
        });
      },
    )(req, res);
  } catch (error) {
    console.error("Error during company login:", error);
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
