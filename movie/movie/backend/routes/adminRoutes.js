const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");
const { getStats, getAllBookings, getAllUsers, addMovie, deleteMovie } = require("../controllers/adminController");

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/bookings", getAllBookings);
router.get("/users", getAllUsers);
router.post("/movies", addMovie);
router.delete("/movies/:id", deleteMovie);

module.exports = router;
