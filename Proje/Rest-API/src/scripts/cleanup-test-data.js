/**
 * MongoDB Test/Sahte Veri Temizleme Scripti
 *
 * Kullanım: node src/scripts/cleanup-test-data.js
 *
 * Bu script MongoDB'deki test/sahte verileri temizler:
 * - Email'de "test", "fake", "example" geçen kullanıcılar ve rehberler
 * - İsimde "Test" geçen turlar
 * - Silinen kullanıcılara/turlara ait satın alma ve favori kayıtları
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

// Model kayıtları
require("../models/db");

async function cleanup() {
  try {
    // Mongoose bağlantısının hazır olmasını bekle
    await new Promise((resolve) => {
      if (mongoose.connection.readyState === 1) return resolve();
      mongoose.connection.once("connected", resolve);
    });

    const User = mongoose.model("User");
    const Tour = mongoose.model("Tour");
    const Purchase = mongoose.model("Purchase");
    const Guide = mongoose.model("Guide");

    console.log("=== TravelBook Test Verisi Temizleme ===\n");

    // 1) Test kullanıcılarını bul ve sil
    const testUserFilter = {
      $or: [
        { email: { $regex: /test|fake|example/i } },
        { name: { $regex: /^test/i } },
      ],
    };
    const testUsers = await User.find(testUserFilter).select("_id name email");
    if (testUsers.length > 0) {
      const userIds = testUsers.map((u) => u._id);
      console.log(`Silinecek test kullanıcıları (${testUsers.length}):`);
      testUsers.forEach((u) => console.log(`  - ${u.name} (${u.email})`));

      // Bu kullanıcılara ait satın almaları sil
      const purchaseResult = await Purchase.deleteMany({ userId: { $in: userIds } });
      console.log(`  → ${purchaseResult.deletedCount} satın alma kaydı silindi`);

      const userResult = await User.deleteMany(testUserFilter);
      console.log(`  → ${userResult.deletedCount} kullanıcı silindi\n`);
    } else {
      console.log("Test kullanıcısı bulunamadı.\n");
    }

    // 2) Test turlarını bul ve sil
    const testTourFilter = {
      $or: [
        { name: { $regex: /^test/i } },
        { description: { $regex: /test|fake|sahte/i } },
      ],
    };
    const testTours = await Tour.find(testTourFilter).select("_id name");
    if (testTours.length > 0) {
      const tourIds = testTours.map((t) => t._id);
      console.log(`Silinecek test turları (${testTours.length}):`);
      testTours.forEach((t) => console.log(`  - ${t.name}`));

      // Bu turlara ait satın almaları sil
      const purchaseResult = await Purchase.deleteMany({ tourId: { $in: tourIds } });
      console.log(`  → ${purchaseResult.deletedCount} satın alma kaydı silindi`);

      const tourResult = await Tour.deleteMany(testTourFilter);
      console.log(`  → ${tourResult.deletedCount} tur silindi\n`);
    } else {
      console.log("Test turu bulunamadı.\n");
    }

    // 3) Test rehberlerini bul ve sil
    const testGuideFilter = {
      $or: [
        { email: { $regex: /test|fake|example/i } },
        { name: { $regex: /^test/i } },
      ],
    };
    const testGuides = await Guide.find(testGuideFilter).select("_id name email");
    if (testGuides.length > 0) {
      console.log(`Silinecek test rehberleri (${testGuides.length}):`);
      testGuides.forEach((g) => console.log(`  - ${g.name} (${g.email})`));

      const guideResult = await Guide.deleteMany(testGuideFilter);
      console.log(`  → ${guideResult.deletedCount} rehber silindi\n`);
    } else {
      console.log("Test rehberi bulunamadı.\n");
    }

    // 4) Yetim satın alma kayıtlarını temizle (silinmiş user/tour'a ait)
    const allPurchases = await Purchase.find().select("userId tourId");
    let orphanCount = 0;
    for (const p of allPurchases) {
      const userExists = await User.exists({ _id: p.userId });
      const tourExists = await Tour.exists({ _id: p.tourId });
      if (!userExists || !tourExists) {
        await Purchase.findByIdAndDelete(p._id);
        orphanCount++;
      }
    }
    if (orphanCount > 0) {
      console.log(`${orphanCount} yetim satın alma kaydı temizlendi.\n`);
    }

    console.log("=== Temizlik tamamlandı ===");
  } catch (error) {
    console.error("Temizlik sırasında hata oluştu:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

cleanup();
