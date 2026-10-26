const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { createBooking, getUserBookings, getBookingById, cancelBooking } = require("../controllers/bookingController");

router.post("/", protect, createBooking);
router.get("/", protect, getUserBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
