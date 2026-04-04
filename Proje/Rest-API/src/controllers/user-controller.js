const mongoose = require("mongoose");
const User = mongoose.model("User");
const { createResponse } = require("../utils/create-response");

// Get user detail
const getUserDetail = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kullanıcı bulunamadı",
      });
    }

    createResponse(res, 200, {
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Kullanıcı detayları alınırken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

// Update user profile
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.payload.id !== userId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi profilinizi güncelleyebilirsiniz",
      });
    }

    const allowedFields = ["name", "phone"];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return createResponse(res, 400, {
        status: "error",
        message: "Güncellenecek alan bulunamadı",
      });
    }

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kullanıcı bulunamadı",
      });
    }

    createResponse(res, 200, {
      status: "success",
      message: "Profil başarıyla güncellendi",
      data: user,
    });
  } catch (error) {
    console.error("Kullanıcı güncellenirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

// Delete user account
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.payload.id !== userId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi hesabınızı silebilirsiniz",
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kullanıcı bulunamadı",
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Kullanıcı silinirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

module.exports = {
  getUserDetail,
  updateUser,
  deleteUser,
};
