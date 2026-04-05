const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();
require("../src/models/db");

const Tour = mongoose.model("Tour");

const SAMPLE_TOUR = {
  title: "Pamukkale Kültür Turu",
  description:
    "Pamukkale travertenleri ve Hierapolis antik kentini kapsayan kültür turu deneyimi.",
  price: 3200,
  location: "Denizli",
  date: "2026-07-20",
  duration: "2 gün 1 gece",
  included: [
    "Müze girişleri",
    "Otel konaklama",
    "Kahvaltı",
    "Rehberlik hizmeti",
  ],
  images: [
    "https://example.com/pamukkale1.jpg",
    "https://example.com/pamukkale2.jpg",
  ],
};

const seedTour = async () => {
  try {
    const date = new Date(SAMPLE_TOUR.date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const payload = {
      ...SAMPLE_TOUR,
      date,
      name: SAMPLE_TOUR.title,
      startDate: date,
      endDate,
      totalCapacity: 20,
      filledCapacity: 0,
      places: [],
      companyId: new mongoose.Types.ObjectId("000000000000000000000001"),
    };

    const tour = await Tour.findOneAndUpdate(
      { title: payload.title, date: payload.date },
      payload,
      {
        returnDocument: "after",
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true,
      },
    );

    console.log("Sample tour inserted/updated successfully:", tour._id.toString());
  } catch (error) {
    console.error("Failed to seed sample tour:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seedTour();
