const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
  {
    assetTag: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "AssetCategory", required: true },
    serialNumber: { type: String, trim: true },
    acquisitionDate: { type: Date },
    acquisitionCost: { type: Number, default: 0 },
    condition: { type: String, enum: ["New", "Good", "Fair", "Poor", "Damaged"], default: "New" },
    location: { type: String, trim: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
    photos: [{ type: String }],
    isBookable: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"],
      default: "Available",
    },
    customFieldValues: { type: mongoose.Schema.Types.Mixed, default: {} },
    riskScore: { type: Number, default: 0 },       // Phase 5 ke liye reserved
    auditFlagCount: { type: Number, default: 0 },  // Phase 5 ke liye reserved
  },
  { timestamps: true }
);

assetSchema.index({ serialNumber: 1 });
assetSchema.index({ status: 1 });

module.exports = mongoose.model("Asset", assetSchema);
