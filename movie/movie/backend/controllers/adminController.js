const Movie = require("../models/Movie");
const Cinema = require("../models/Cinema");
const Show = require("../models/Show");
const User = require("../models/User");
const Booking = require("../models/Booking");

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalMovies = await Movie.countDocuments();
    const totalTheatres = await Cinema.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });
    const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });
    const totalShows = await Show.countDocuments();

    const revenueResult = await Booking.aggregate([
      { $match: { status: "confirmed" } },
      { $group: { _id: null, total: { $sum: "$grandTotal" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalMovies,
        totalTheatres,
        totalUsers,
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalRevenue,
        totalShows,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/admin/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const data = bookings.map((b) => {
      const obj = b.toObject();
      return {
        ...obj,
        userName: obj.user ? obj.user.name : "Unknown",
        userEmail: obj.user ? obj.user.email : "",
      };
    });

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const data = [];

    for (const user of users) {
      const bookingCount = await Booking.countDocuments({ user: user._id });
      const userObj = user.toObject();
      delete userObj.password;
      data.push({ ...userObj, bookingCount });
    }

    res.status(200).json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Add a movie (admin)
// @route   POST /api/admin/movies
const addMovie = async (req, res) => {
  try {
    const { title, genre, rating, year, duration, language, poster, description, director, cast } = req.body;
    if (!title || !genre) {
      return res.status(400).json({ success: false, message: "Title and genre are required" });
    }

    const movie = await Movie.create({
      title,
      genre,
      rating: rating || 0,
      year: year || new Date().getFullYear(),
      duration: duration || "N/A",
      language: language || "English",
      poster: poster || "/posters/default.jpg",
      description: description || "",
      director: director || "",
      cast: cast || [],
      featured: false,
    });

    res.status(201).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Delete a movie (admin)
// @route   DELETE /api/admin/movies/:id
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.status(200).json({ success: true, message: "Movie deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getStats, getAllBookings, getAllUsers, addMovie, deleteMovie };
