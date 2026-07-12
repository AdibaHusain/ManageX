require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Department = require("./models/Department");
const AssetCategory = require("./models/AssetCategory");

const seed = async () => {
  await connectDB();
  await User.deleteMany({});
  await Department.deleteMany({});
  await AssetCategory.deleteMany({});

  const admin = await User.create({
    name: "System Admin", email: "admin@assetiq.com",
    password: "Admin@123", role: "Admin", status: "Active",
  });

  const engineering = await Department.create({ name: "Engineering", code: "ENG", head: null });
  const facilities = await Department.create({ name: "Facilities", code: "FAC", head: null });

  await AssetCategory.create([
    { name: "Electronics", prefix: "EL", customFields: [{ fieldName: "Warranty Period", fieldType: "text" }] },
    { name: "Furniture", prefix: "FN", customFields: [] },
    { name: "Vehicles", prefix: "VH", customFields: [{ fieldName: "Fuel Type", fieldType: "text" }] },
  ]);

  console.log("Seed complete. Admin login -> admin@assetiq.com / Admin@123");
  console.log(`Departments: Engineering(${engineering._id}), Facilities(${facilities._id})`);
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => { console.error("Seed failed:", err); process.exit(1); });
