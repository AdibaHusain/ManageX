const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "Asset Assigned", "Maintenance Approved", "Maintenance Rejected",
        "Booking Confirmed", "Booking Cancelled", "Booking Reminder",
        "Transfer Approved", "Overdue Return Alert", "Audit Discrepancy Flagged",
      ],
      required: true,
    },
    message: { type: String, required: true },
    relatedAsset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", default: null },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
