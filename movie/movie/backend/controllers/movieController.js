const Movie = require("../models/Movie");

// @desc    Get all movies
// @route   GET /api/movies
const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: movies.length, data: movies });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error: Unable to fetch movies" });
  }
};

// @desc    Get featured movie
// @route   GET /api/movies/featured
const getFeaturedMovie = async (req, res) => {
  try {
    const featured = await Movie.findOne({ featured: true });
    if (!featured) {
      return res.status(404).json({ success: false, message: "No featured movie found" });
    }
    res.status(200).json({ success: true, data: featured });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get movie by ID
// @route   GET /api/movies/:id
const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ success: false, message: "Movie not found" });
    }
    res.status(200).json({ success: true, data: movie });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { getMovies, getFeaturedMovie, getMovieById };
