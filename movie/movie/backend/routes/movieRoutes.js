const express = require("express");
const router = express.Router();
const { getMovies, getFeaturedMovie, getMovieById } = require("../controllers/movieController");

router.get("/", getMovies);
router.get("/featured", getFeaturedMovie);
router.get("/:id", getMovieById);

module.exports = router;
