const express = require("express");
const router = express.Router();
const { createBooking, getBookingsForAsset, getMyBookings, cancelBooking, rescheduleBooking } = require("../controllers/bookingController");
const { protect } = require("../middleware/auth");

router.use(protect);
router.post("/", createBooking);
router.get("/my", getMyBookings);
router.get("/asset/:assetId", getBookingsForAsset);
router.patch("/:id/cancel", cancelBooking);
router.patch("/:id/reschedule", rescheduleBooking);

module.exports = router;