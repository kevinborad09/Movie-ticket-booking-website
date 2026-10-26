const express = require("express");
const router = express.Router();
const { getTheatres, getTheatreById, getShows, getShowById, getMoviesByTheatre } = require("../controllers/theatreController");

router.get("/", getTheatres);
router.get("/:id", getTheatreById);
router.get("/:id/movies", getMoviesByTheatre);

module.exports = router;
