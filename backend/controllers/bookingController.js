const Asset = require("../models/Asset");
const Booking = require("../models/Booking");

const createBooking = async (req, res, next) => {
  try {
    const { assetId, startTime, endTime } = req.body;
    if (!assetId || !startTime || !endTime) {
      return res.status(400).json({ message: "assetId, startTime and endTime are required" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) return res.status(400).json({ message: "endTime must be after startTime" });

    const asset = await Asset.findById(assetId);
    if (!asset) return res.status(404).json({ message: "Asset not found" });
    if (!asset.isBookable) return res.status(400).json({ message: "This asset is not marked as bookable" });

    // Overlap rule: 9:00-10:00 blocks 9:30-10:30, allows 10:00-11:00
    const overlapping = await Booking.findOne({
      asset: assetId,
      status: { $in: ["Upcoming", "Ongoing"] },
      startTime: { $lt: end },
      endTime: { $gt: start },
    });

    if (overlapping) {
      return res.status(409).json({ message: "This time slot overlaps with an existing booking", conflictingBooking: overlapping });
    }

    const booking = await Booking.create({ asset: assetId, bookedBy: req.user._id, startTime: start, endTime: end });
    res.status(201).json(booking);
  } catch (err) { next(err); }
};

const getBookingsForAsset = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ asset: req.params.assetId }).populate("bookedBy", "name email").sort({ startTime: 1 });
    res.json(bookings);
  } catch (err) { next(err); }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ bookedBy: req.user._id }).populate("asset", "assetTag name").sort({ startTime: -1 });
    res.json(bookings);
  } catch (err) { next(err); }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const isOwner = booking.bookedBy.toString() === req.user._id.toString();
    const isPrivileged = ["Admin", "AssetManager", "DepartmentHead"].includes(req.user.role);
    if (!isOwner && !isPrivileged) return res.status(403).json({ message: "Not authorized to cancel this booking" });

    booking.status = "Cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (err) { next(err); }
};

const rescheduleBooking = async (req, res, next) => {
  try {
    const { startTime, endTime } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (start >= end) return res.status(400).json({ message: "endTime must be after startTime" });

    const overlapping = await Booking.findOne({
      _id: { $ne: booking._id }, asset: booking.asset,
      status: { $in: ["Upcoming", "Ongoing"] }, startTime: { $lt: end }, endTime: { $gt: start },
    });
    if (overlapping) return res.status(409).json({ message: "New time slot overlaps with an existing booking" });

    booking.startTime = start;
    booking.endTime = end;
    await booking.save();
    res.json(booking);
  } catch (err) { next(err); }
};

module.exports = { createBooking, getBookingsForAsset, getMyBookings, cancelBooking, rescheduleBooking };