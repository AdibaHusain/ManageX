const Asset = require("../models/Asset");
const Allocation = require("../models/Allocation");
const Booking = require("../models/Booking");
const MaintenanceRequest = require("../models/MaintenanceRequest");
const TransferRequest = require("../models/TransferRequest");

const getDashboardKPIs = async (req, res, next) => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const endOfToday = new Date(now.setHours(23, 59, 59, 999));

    const [assetsAvailable, assetsAllocated, maintenanceToday, activeBookings, pendingTransfers, upcomingReturns, overdueReturns] = await Promise.all([
      Asset.countDocuments({ status: "Available" }),
      Asset.countDocuments({ status: "Allocated" }),
      MaintenanceRequest.countDocuments({
        status: { $in: ["Approved", "Technician Assigned", "In Progress"] },
        updatedAt: { $gte: startOfToday, $lte: endOfToday },
      }),
      Booking.countDocuments({ status: { $in: ["Upcoming", "Ongoing"] } }),
      TransferRequest.countDocuments({ status: "Requested" }),
      Allocation.countDocuments({ status: "Active", expectedReturnDate: { $gte: new Date(), $lte: sevenDaysFromNow } }),
      Allocation.countDocuments({ status: "Active", expectedReturnDate: { $lt: new Date() } }),
    ]);

    res.json({ assetsAvailable, assetsAllocated, maintenanceToday, activeBookings, pendingTransfers, upcomingReturns, overdueReturns });
  } catch (err) { next(err); }
};

module.exports = { getDashboardKPIs };