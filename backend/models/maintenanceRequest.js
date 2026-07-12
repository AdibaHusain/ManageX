const mongoose = require("mongoose");

const maintenanceRequestSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    raisedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    issueDescription: { type: String, required: true },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], default: "Medium" },
    photo: { type: String, default: null },
    technicianAssigned: { type: String, default: null },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Technician Assigned", "In Progress", "Resolved"],
      default: "Pending",
    },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    resolvedDate: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaintenanceRequest", maintenanceRequestSchema);
