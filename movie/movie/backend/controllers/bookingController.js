const Booking = require("../models/Booking");
const Show = require("../models/Show");
const Movie = require("../models/Movie");
const Cinema = require("../models/Cinema");
const User = require("../models/User");

// @desc    Create a booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { showId, seats, paymentMethod } = req.body;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ success: false, message: "Please provide showId and seats" });
    }

    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    // Check seat availability
    const existingBookings = await Booking.find({ show: show._id, status: { $ne: "cancelled" } });
    const bookedSeats = [];
    existingBookings.forEach((b) => bookedSeats.push(...b.seats));

    const alreadyBooked = seats.filter((s) => bookedSeats.includes(s));
    if (alreadyBooked.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Seats already booked: ${alreadyBooked.join(", ")}`,
      });
    }

    // Calculate total
    const cinema = await Cinema.findById(show.cinema);
    const screen = cinema.screens[show.screenIndex];
    let totalAmount = 0;

    // Convert Map to plain object for row lookups
    const rowsObj = {};
    if (screen.rows instanceof Map) {
      screen.rows.forEach((value, key) => {
        rowsObj[key] = value;
      });
    } else {
      Object.assign(rowsObj, screen.rows);
    }

    // Track seat categories
    const seatCategories = { regular: 0, premium: 0, vip: 0 };

    seats.forEach((seatId) => {
      const row = seatId.charAt(0);
      const seatType = rowsObj[row] || "regular";
      seatCategories[seatType] = (seatCategories[seatType] || 0) + 1;
      totalAmount += show.price[seatType] || show.price.regular;
    });

    const movie = await Movie.findById(show.movie);
    const convenienceFee = Math.round(totalAmount * 0.05);
    const gst = Math.round(totalAmount * 0.18);
    const grandTotal = totalAmount + convenienceFee + gst;

    const booking = await Booking.create({
      user: req.user._id,
      show: show._id,
      movie: movie._id,
      cinema: cinema._id,
      movieTitle: movie.title,
      moviePoster: movie.poster,
      cinemaName: cinema.name,
      cinemaAddress: cinema.address,
      screenName: show.screenName,
      screenType: show.screenType,
      date: show.date,
      time: show.time,
      seats,
      seatCount: seats.length,
      seatCategories,
      totalAmount,
      convenienceFee,
      gst,
      grandTotal,
      status: "confirmed",
      paymentStatus: "completed",
      paymentMethod: paymentMethod || "card",
      paymentId: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });

    // Update show booked seats count
    await Show.findByIdAndUpdate(show._id, {
      $inc: { bookedSeatsCount: seats.length },
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { totalBookings: 1, totalSpent: grandTotal },
    });

    // Update movie booking count
    await Movie.findByIdAndUpdate(movie._id, {
      $inc: { totalBookings: 1 },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error creating booking" });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings
const getUserBookings = async (req, res) => {
  try {
    const userBookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: userBookings.length, data: userBookings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching bookings" });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking is already cancelled" });
    }

    booking.status = "cancelled";
    booking.paymentStatus = "refunded";
    booking.cancelledAt = new Date();
    booking.refundAmount = booking.grandTotal;
    await booking.save();

    // Update show booked seats count
    await Show.findByIdAndUpdate(booking.show, {
      $inc: { bookedSeatsCount: -booking.seats.length },
    });

    // Update user stats
    await User.findByIdAndUpdate(booking.user, {
      $inc: { totalBookings: -1, totalSpent: -booking.grandTotal },
    });

    // Update movie booking count
    await Movie.findByIdAndUpdate(booking.movie, {
      $inc: { totalBookings: -1 },
    });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createBooking, getUserBookings, getBookingById, cancelBooking };
