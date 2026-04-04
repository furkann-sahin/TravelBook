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

// Update user password
const updateUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;
    const authenticatedUserId = req.userId || req.payload?.id;

    if (authenticatedUserId !== userId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi şifrenizi güncelleyebilirsiniz",
      });
    }

    if (!oldPassword || !newPassword) {
      return createResponse(res, 400, {
        status: "error",
        message: "oldPassword ve newPassword alanları zorunludur",
      });
    }

    const user = await User.findById(userId).select("+passwordHash +salt");

    if (!user) {
      return createResponse(res, 404, {
        status: "error",
        message: "Kullanıcı bulunamadı",
      });
    }

    if (!user.validatePassword(oldPassword)) {
      return createResponse(res, 400, {
        status: "error",
        message: "Eski şifre hatalı",
      });
    }

    user.setPassword(newPassword);
    await user.save();

    createResponse(res, 200, {
      status: "success",
      message: "Şifre başarıyla güncellendi",
    });
  } catch (error) {
    console.error("Şifre güncellenirken hata oluştu:", error);
    createResponse(res, 500, {
      status: "error",
      message: "Sunucu hatası oluştu",
    });
  }
};

// List user purchases
const getUserPurchases = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;
    const authenticatedUserId = req.userId || req.payload?.id;

    if (authenticatedUserId !== userId) {
      return createResponse(res, 403, {
        status: "error",
        message: "Yalnızca kendi seyahatlerinizi görüntüleyebilirsiniz",
      });
    }

    if (status && !["past", "future"].includes(status)) {
      return createResponse(res, 400, {
        status: "error",
        message: "status parametresi past veya future olmalıdır",
      });
    }

    const filteredPurchases = [];

    createResponse(res, 200, {
      status: "success",
      results: filteredPurchases.length,
      data: filteredPurchases,
    });
  } catch (error) {
    console.error("Seyahatler alınırken hata oluştu:", error);
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
  updateUserPassword,
  getUserPurchases,
  deleteUser,
};
