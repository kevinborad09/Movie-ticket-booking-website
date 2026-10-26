const Cinema = require("../models/Cinema");
const Show = require("../models/Show");
const Movie = require("../models/Movie");
const Booking = require("../models/Booking");

// @desc    Get all theatres/cinemas
// @route   GET /api/theatres
const getTheatres = async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    const list = cinemas.map((c) => {
      const obj = c.toObject();
      return {
        id: obj._id,
        _id: obj._id,
        name: obj.name,
        location: obj.location,
        address: obj.address,
        image: obj.image,
        screenCount: obj.screens.length,
        screenTypes: [...new Set(obj.screens.map((s) => s.type))],
      };
    });
    res.status(200).json({ success: true, count: list.length, data: list });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching theatres" });
  }
};

// @desc    Get theatre/cinema by ID
// @route   GET /api/theatres/:id
const getTheatreById = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ success: false, message: "Theatre not found" });
    }
    res.status(200).json({ success: true, data: cinema });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get shows for a movie (optionally filtered by date)
// @route   GET /api/shows?movieId=...&date=2026-10-02
const getShows = async (req, res) => {
  try {
    const { movieId, date, theatreId } = req.query;
    const filter = {};

    if (movieId) filter.movie = movieId;
    if (date) filter.date = date;
    if (theatreId) filter.cinema = theatreId;

    const shows = await Show.find(filter).populate("cinema", "name location address");

    // Group shows by cinema for the UI
    const grouped = {};
    shows.forEach((show) => {
      const cinemaId = show.cinema._id.toString();
      if (!grouped[cinemaId]) {
        grouped[cinemaId] = {
          theatre: {
            id: show.cinema._id,
            _id: show.cinema._id,
            name: show.cinema.name,
            location: show.cinema.location,
            address: show.cinema.address,
          },
          shows: [],
        };
      }
      grouped[cinemaId].shows.push(show);
    });

    res.status(200).json({
      success: true,
      count: shows.length,
      data: Object.values(grouped),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching shows" });
  }
};

// @desc    Get a single show by ID (with seat layout)
// @route   GET /api/shows/:id
const getShowById = async (req, res) => {
  try {
    const show = await Show.find({}).then((all) => all.find((s) => s._id.toString() === req.params.id))
      || await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({ success: false, message: "Show not found" });
    }

    const cinema = await Cinema.findById(show.cinema);
    const movie = await Movie.findById(show.movie);
    const screen = cinema.screens[show.screenIndex];

    // Get booked seats for this show
    const bookings = await Booking.find({ show: show._id, status: { $ne: "cancelled" } });
    const bookedSeats = [];
    bookings.forEach((b) => bookedSeats.push(...b.seats));

    // Convert Map to plain object for the rows
    const rowsObj = {};
    if (screen.rows instanceof Map) {
      screen.rows.forEach((value, key) => {
        rowsObj[key] = value;
      });
    } else {
      Object.assign(rowsObj, screen.rows);
    }

    res.status(200).json({
      success: true,
      data: {
        id: show._id,
        _id: show._id,
        movie: { _id: movie._id, id: movie._id, title: movie.title, poster: movie.poster, genre: movie.genre, duration: movie.duration },
        theatre: { _id: cinema._id, id: cinema._id, name: cinema.name, address: cinema.address },
        screen: { name: screen.name, type: screen.type, rows: rowsObj, seatsPerRow: screen.seatsPerRow },
        screenName: show.screenName,
        screenType: show.screenType,
        date: show.date,
        time: show.time,
        price: show.price,
        bookedSeats,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// @desc    Get movies currently running at a specific cinema
// @route   GET /api/theatres/:id/movies
const getMoviesByTheatre = async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);
    if (!cinema) {
      return res.status(404).json({ success: false, message: "Theatre not found" });
    }

    // Get today's date string
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    // Find all shows at this cinema from today onwards
    const cinemaShows = await Show.find({
      cinema: cinema._id,
      date: { $gte: today },
    }).populate("movie");

    // Group by movie and collect show info
    const movieMap = {};
    cinemaShows.forEach((show) => {
      const mid = show.movie._id.toString();
      if (!movieMap[mid]) {
        movieMap[mid] = {
          ...show.movie.toObject(),
          shows: [],
        };
      }
      movieMap[mid].shows.push({
        id: show._id,
        _id: show._id,
        date: show.date,
        time: show.time,
        screenName: show.screenName,
        screenType: show.screenType,
        price: show.price,
      });
    });

    res.status(200).json({
      success: true,
      theatre: {
        id: cinema._id,
        _id: cinema._id,
        name: cinema.name,
        location: cinema.location,
        address: cinema.address,
        image: cinema.image,
        screenCount: cinema.screens.length,
        screenTypes: [...new Set(cinema.screens.map((s) => s.type))],
      },
      data: Object.values(movieMap),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error fetching movies for theatre" });
  }
};

module.exports = { getTheatres, getTheatreById, getShows, getShowById, getMoviesByTheatre };
