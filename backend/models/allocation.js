const mongoose = require("mongoose");

const allocationSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
    allocatedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
    allocatedDate: { type: Date, default: Date.now },
    expectedReturnDate: { type: Date },
    actualReturnDate: { type: Date, default: null },
    conditionOnReturn: { type: String, default: null },
    status: { type: String, enum: ["Active", "Returned", "Overdue"], default: "Active" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Allocation", allocationSchema);
