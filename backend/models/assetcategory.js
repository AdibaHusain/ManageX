const mongoose = require("mongoose");

const customFieldSchema = new mongoose.Schema(
  {
    fieldName: { type: String, required: true },
    fieldType: { type: String, enum: ["text", "number", "date"], default: "text" },
  },
  { _id: false }
);

const assetCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    prefix: { type: String, trim: true, uppercase: true, default: "AF" },
    customFields: [customFieldSchema],
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssetCategory", assetCategorySchema);
