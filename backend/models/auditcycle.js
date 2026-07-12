const mongoose = require("mongoose");

const auditItemSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    result: { type: String, enum: ["Pending", "Verified", "Missing", "Damaged"], default: "Pending" },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const auditCycleSchema = new mongoose.Schema(
  {
    scopeDepartment: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null },
    scopeLocation: { type: String, default: null },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    auditors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    items: [auditItemSchema],
    status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditCycle", auditCycleSchema);
