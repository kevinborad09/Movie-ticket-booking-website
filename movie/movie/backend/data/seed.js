/**
 * Seed script — populates MongoDB with initial movies, cinemas (theatres), shows, and users.
 * Run with:  node data/seed.js
 *
 * After seeding, open MongoDB Compass and connect to:
 *   mongodb://127.0.0.1:27017/cinebook
 *
 * You will see 5 collections:
 *   - movies
 *   - users
 *   - bookings
 *   - shows
 *   - cinemas
 */

require("dotenv").config();
const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const Cinema = require("../models/Cinema");
const Show = require("../models/Show");
const User = require("../models/User");
const Booking = require("../models/Booking");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/cinebook";

// ── Movie seed data ─────────────────────────────────────────────────────────
const moviesData = [
  {
    title: "Pushpa 2: The Rule",
    genre: "Action • Thriller • Drama",
    rating: 8.5,
    year: 2024,
    duration: "3h 20m",
    language: "Hindi",
    poster: "/posters/pushpa2.jpg",
    description:
      "Pushpa Raj returns with more power and vengeance. As the red sandalwood smuggling empire expands, the stakes get higher and deadlier. The rule is simple — either rule or be ruled.",
    director: "Sukumar",
    cast: ["Allu Arjun", "Rashmika Mandanna", "Fahadh Faasil"],
    featured: true,
    certification: "UA",
    status: "now-showing",
    formats: ["2D", "IMAX", "Dolby Atmos"],
    releaseDate: new Date("2024-12-06"),
    trailerUrl: "https://youtube.com/watch?v=pushpa2_trailer",
  },
  {
    title: "Stree 2",
    genre: "Horror • Comedy • Fantasy",
    rating: 8.2,
    year: 2024,
    duration: "2h 30m",
    language: "Hindi",
    poster: "/posters/stree2.jpg",
    description:
      "The ghost of Stree returns to haunt Chanderi once again, but this time she brings an even more terrifying entity. The boys must unite to save their town from a new supernatural threat.",
    director: "Amar Kaushik",
    cast: ["Rajkummar Rao", "Shraddha Kapoor", "Pankaj Tripathi"],
    featured: true,
    certification: "UA",
    status: "now-showing",
    formats: ["2D", "3D"],
    releaseDate: new Date("2024-08-15"),
    trailerUrl: "https://youtube.com/watch?v=stree2_trailer",
  },
  {
    title: "Singham Again",
    genre: "Action • Drama • Thriller",
    rating: 7.8,
    year: 2024,
    duration: "2h 45m",
    language: "Hindi",
    poster: "/posters/singham_again.jpg",
    description:
      "DCP Bajirao Singham embarks on his most dangerous mission yet, taking on a powerful villain who threatens national security. The lion roars once more to protect the innocent.",
    director: "Rohit Shetty",
    cast: ["Ajay Devgn", "Deepika Padukone", "Tiger Shroff"],
    featured: false,
    certification: "UA",
    status: "now-showing",
    formats: ["2D", "IMAX"],
    releaseDate: new Date("2024-11-01"),
    trailerUrl: "https://youtube.com/watch?v=singham_again_trailer",
  },
  {
    title: "Bhool Bhulaiyaa 3",
    genre: "Horror • Comedy • Mystery",
    rating: 7.5,
    year: 2024,
    duration: "2h 38m",
    language: "Hindi",
    poster: "/posters/bhool_bhulaiyaa3.jpg",
    description:
      "Rooh Baba returns for another spooky adventure in a haunted haveli. With double the ghosts and double the fun, this time the mystery goes deeper than ever before.",
    director: "Anees Bazmee",
    cast: ["Kartik Aaryan", "Vidya Balan", "Triptii Dimri"],
    featured: false,
    certification: "UA",
    status: "now-showing",
    formats: ["2D", "3D"],
    releaseDate: new Date("2024-11-01"),
    trailerUrl: "https://youtube.com/watch?v=bhool3_trailer",
  },
  {
    title: "War 2",
    genre: "Action • Thriller • Espionage",
    rating: 8.0,
    year: 2025,
    duration: "2h 35m",
    language: "Hindi",
    poster: "/posters/war2.jpg",
    description:
      "India's top spy agent is pulled back into action when a global terror network threatens to destabilize world peace. High-octane action across multiple countries in a race against time.",
    director: "Ayan Mukerji",
    cast: ["Hrithik Roshan", "Jr NTR", "Kiara Advani"],
    featured: false,
    certification: "UA",
    status: "now-showing",
    formats: ["2D", "IMAX", "Dolby Atmos"],
    releaseDate: new Date("2025-08-14"),
    trailerUrl: "https://youtube.com/watch?v=war2_trailer",
  },
  {
    title: "Border 2",
    genre: "War • Action • Drama",
    rating: 8.3,
    year: 2025,
    duration: "2h 50m",
    language: "Hindi",
    poster: "/posters/border2.jpg",
    description:
      "Based on true events from the Battle of Longewala, Border 2 tells the story of Indian soldiers who held their ground against impossible odds, defending the nation with unbreakable courage.",
    director: "Anurag Singh",
    cast: ["Sunny Deol", "Varun Dhawan", "Diljit Dosanjh"],
    featured: false,
    certification: "UA",
    status: "now-showing",
    formats: ["2D", "IMAX"],
    releaseDate: new Date("2025-01-23"),
    trailerUrl: "https://youtube.com/watch?v=border2_trailer",
  },
  {
    title: "Deva",
    genre: "Action • Thriller • Crime",
    rating: 7.6,
    year: 2025,
    duration: "2h 22m",
    language: "Hindi",
    poster: "/posters/deva.jpg",
    description:
      "A fearless cop dives deep into Mumbai's criminal underworld to uncover a massive drug syndicate. But as he gets closer to the truth, he realizes the conspiracy runs deeper than he imagined.",
    director: "Rosshan Andrrews",
    cast: ["Shahid Kapoor", "Pooja Hegde", "Pavail Gulati"],
    featured: false,
    certification: "A",
    status: "now-showing",
    formats: ["2D"],
    releaseDate: new Date("2025-01-31"),
    trailerUrl: "https://youtube.com/watch?v=deva_trailer",
  },
  {
    title: "Sky Force",
    genre: "Action • War • Drama",
    rating: 7.9,
    year: 2025,
    duration: "2h 15m",
    language: "Hindi",
    poster: "/posters/sky_force.jpg",
    description:
      "India's first air strike movie — based on the untold story of India's bravest air force mission. A tribute to the fearless pilots who changed the course of history.",
    director: "Abhishek Anil Kapur",
    cast: ["Akshay Kumar", "Veer Pahariya", "Sara Ali Khan"],
    featured: false,
    certification: "UA",
    status: "now-showing",
    formats: ["2D", "IMAX"],
    releaseDate: new Date("2025-01-24"),
    trailerUrl: "https://youtube.com/watch?v=skyforce_trailer",
  },
];

// ── Cinema (Theatre) seed data ──────────────────────────────────────────────
const cinemasData = [
  {
    name: "CineBook IMAX Centre",
    location: "Kurla West",
    city: "Mumbai",
    address: "Phoenix Marketcity, LBS Marg, Kurla West, Mumbai 400070",
    image: "/posters/pushpa2.jpg",
    phone: "+91 22 6789 1234",
    email: "imax@cinebook.com",
    facilities: ["Parking", "Food Court", "Dolby Sound", "Wheelchair Accessible", "M-Ticket", "Online Booking"],
    rating: 4.5,
    totalReviews: 2340,
    openingTime: "09:00 AM",
    closingTime: "12:00 AM",
    screens: [
      {
        name: "IMAX Screen",
        type: "IMAX",
        rows: { A: "vip", B: "vip", C: "premium", D: "premium", E: "premium", F: "regular", G: "regular", H: "regular" },
        seatsPerRow: 12,
        totalSeats: 96,
        isActive: true,
      },
      {
        name: "Screen 2",
        type: "Dolby Atmos",
        rows: { A: "premium", B: "premium", C: "regular", D: "regular", E: "regular", F: "regular" },
        seatsPerRow: 14,
        totalSeats: 84,
        isActive: true,
      },
    ],
  },
  {
    name: "CineBook Cineplex",
    location: "Ghatkopar West",
    city: "Mumbai",
    address: "R City Mall, LBS Marg, Ghatkopar West, Mumbai 400086",
    image: "/posters/singham_again.jpg",
    phone: "+91 22 6789 5678",
    email: "cineplex@cinebook.com",
    facilities: ["Parking", "Food Court", "Online Booking", "M-Ticket", "3D Glasses"],
    rating: 4.2,
    totalReviews: 1856,
    openingTime: "09:30 AM",
    closingTime: "11:30 PM",
    screens: [
      {
        name: "Screen 1",
        type: "4K Laser",
        rows: { A: "premium", B: "premium", C: "premium", D: "regular", E: "regular", F: "regular", G: "regular" },
        seatsPerRow: 16,
        totalSeats: 112,
        isActive: true,
      },
      {
        name: "Screen 2",
        type: "Standard",
        rows: { A: "premium", B: "regular", C: "regular", D: "regular", E: "regular" },
        seatsPerRow: 12,
        totalSeats: 60,
        isActive: true,
      },
      {
        name: "Screen 3",
        type: "Standard",
        rows: { A: "premium", B: "regular", C: "regular", D: "regular", E: "regular", F: "regular" },
        seatsPerRow: 14,
        totalSeats: 84,
        isActive: true,
      },
    ],
  },
  {
    name: "CineBook Gold Lounge",
    location: "Lower Parel",
    city: "Mumbai",
    address: "Palladium Mall, Lower Parel, Mumbai 400013",
    image: "/posters/sky_force.jpg",
    phone: "+91 22 6789 9012",
    email: "gold@cinebook.com",
    facilities: ["Parking", "Food Court", "Recliner Seats", "Couple Seats", "WiFi", "Online Booking"],
    rating: 4.8,
    totalReviews: 987,
    openingTime: "10:00 AM",
    closingTime: "11:00 PM",
    screens: [
      {
        name: "Gold Screen 1",
        type: "Gold Class",
        rows: { A: "vip", B: "vip", C: "vip", D: "premium", E: "premium" },
        seatsPerRow: 8,
        totalSeats: 40,
        isActive: true,
      },
      {
        name: "Gold Screen 2",
        type: "Gold Class",
        rows: { A: "vip", B: "vip", C: "premium", D: "premium" },
        seatsPerRow: 10,
        totalSeats: 40,
        isActive: true,
      },
    ],
  },
  {
    name: "Starlight Multiplex",
    location: "Thane",
    city: "Mumbai",
    address: "Viviana Mall, Eastern Express Highway, Thane, Mumbai 400601",
    image: "/posters/deva.jpg",
    phone: "+91 22 6789 3456",
    email: "starlight@cinebook.com",
    facilities: ["Parking", "Food Court", "3D Glasses", "Online Booking", "M-Ticket"],
    rating: 4.0,
    totalReviews: 1245,
    openingTime: "09:00 AM",
    closingTime: "11:30 PM",
    screens: [
      {
        name: "Screen 1",
        type: "Standard",
        rows: { A: "premium", B: "premium", C: "regular", D: "regular", E: "regular", F: "regular", G: "regular", H: "regular" },
        seatsPerRow: 16,
        totalSeats: 128,
        isActive: true,
      },
      {
        name: "Screen 2",
        type: "3D",
        rows: { A: "premium", B: "premium", C: "regular", D: "regular", E: "regular", F: "regular" },
        seatsPerRow: 14,
        totalSeats: 84,
        isActive: true,
      },
    ],
  },
];

// ── Default admin/user accounts ─────────────────────────────────────────────
const usersData = [
  {
    name: "Admin User",
    email: "admin@cinebook.com",
    password: "admin123",
    phone: "9876543210",
    role: "admin",
    city: "Mumbai",
    gender: "male",
    isVerified: true,
    favouriteGenres: ["Action", "Thriller", "Drama"],
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "user123",
    phone: "9876543211",
    role: "user",
    city: "Mumbai",
    gender: "male",
    dateOfBirth: new Date("1995-05-15"),
    isVerified: true,
    favouriteGenres: ["Action", "Comedy"],
  },
  {
    name: "Priya Sharma",
    email: "priya@example.com",
    password: "user123",
    phone: "9876543212",
    role: "user",
    city: "Mumbai",
    gender: "female",
    dateOfBirth: new Date("1998-08-22"),
    isVerified: true,
    favouriteGenres: ["Horror", "Comedy", "Romance"],
  },
  {
    name: "Rahul Verma",
    email: "rahul@example.com",
    password: "user123",
    phone: "9876543213",
    role: "user",
    city: "Mumbai",
    gender: "male",
    dateOfBirth: new Date("2000-12-10"),
    isVerified: false,
    favouriteGenres: ["Action", "War"],
  },
];

// ── Price map per screen type ───────────────────────────────────────────────
const prices = {
  IMAX: { regular: 300, premium: 500, vip: 750 },
  "Dolby Atmos": { regular: 280, premium: 450, vip: 700 },
  "4K Laser": { regular: 250, premium: 400, vip: 650 },
  "Gold Class": { regular: 500, premium: 700, vip: 1000 },
  "3D": { regular: 220, premium: 350, vip: 550 },
  Standard: { regular: 180, premium: 280, vip: 450 },
};

// ── Format map per screen type ──────────────────────────────────────────────
const formatMap = {
  IMAX: "IMAX",
  "Dolby Atmos": "Dolby Atmos",
  "4K Laser": "2D",
  "Gold Class": "2D",
  "3D": "3D",
  Standard: "2D",
};

const timeSlots = ["10:00 AM", "01:15 PM", "04:30 PM", "07:45 PM", "10:30 PM"];

// Helper: Calculate approximate end time from start time + duration string
function calcEndTime(startTime, durationStr) {
  const match = durationStr.match(/(\d+)h\s*(\d+)?m?/);
  if (!match) return "";
  const hours = parseInt(match[1]) || 0;
  const mins = parseInt(match[2]) || 0;

  const [time, period] = startTime.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  h += hours;
  m += mins;
  if (m >= 60) { h += 1; m -= 60; }
  h = h % 24;

  const endPeriod = h >= 12 ? "PM" : "AM";
  const endH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${String(endH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${endPeriod}`;
}

// ── Seed function ───────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding");

    // Clear existing data
    await Movie.deleteMany({});
    await Cinema.deleteMany({});
    await Show.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    console.log("🗑️  Cleared existing data (movies, cinemas, shows, users, bookings)");

    // Insert movies
    const insertedMovies = await Movie.insertMany(moviesData);
    console.log(`🎬 Inserted ${insertedMovies.length} movies`);

    // Insert cinemas
    const insertedCinemas = await Cinema.insertMany(cinemasData);
    console.log(`🏛️  Inserted ${insertedCinemas.length} cinemas`);

    // Insert users (one by one so the pre-save password hook runs)
    const insertedUsers = [];
    for (const userData of usersData) {
      const user = await User.create(userData);
      insertedUsers.push(user);
    }
    console.log(`👤 Inserted ${insertedUsers.length} users`);

    // Generate shows for the next 3 days
    const today = new Date();
    const dates = [];
    for (let d = 0; d < 3; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      dates.push(`${y}-${m}-${day}`);
    }

    const showDocs = [];
    insertedMovies.forEach((movie, mi) => {
      insertedCinemas.forEach((cinema) => {
        cinema.screens.forEach((screen, si) => {
          const slotStart = (mi + si) % timeSlots.length;
          const slotCount = 2 + (mi % 2);

          for (let s = 0; s < slotCount; s++) {
            const slotIndex = (slotStart + s * 2) % timeSlots.length;

            dates.forEach((date) => {
              showDocs.push({
                movie: movie._id,
                cinema: cinema._id,
                screenIndex: si,
                screenName: screen.name,
                screenType: screen.type,
                date,
                time: timeSlots[slotIndex],
                endTime: calcEndTime(timeSlots[slotIndex], movie.duration),
                language: movie.language,
                format: formatMap[screen.type] || "2D",
                price: prices[screen.type] || prices.Standard,
                totalSeats: screen.totalSeats || 0,
                bookedSeatsCount: 0,
                status: "active",
                isActive: true,
              });
            });
          }
        });
      });
    });

    await Show.insertMany(showDocs);
    console.log(`🎭 Inserted ${showDocs.length} shows`);

    // Generate sample bookings for the demo users
    const sampleBookings = [];
    const regularUsers = insertedUsers.filter((u) => u.role === "user");

    for (let i = 0; i < Math.min(6, showDocs.length); i++) {
      const showDoc = showDocs[i];
      const user = regularUsers[i % regularUsers.length];

      // Find the inserted show
      const show = await Show.findOne({
        movie: showDoc.movie,
        cinema: showDoc.cinema,
        date: showDoc.date,
        time: showDoc.time,
        screenName: showDoc.screenName,
      });

      if (!show) continue;

      const cinema = await Cinema.findById(show.cinema);
      const movie = await Movie.findById(show.movie);
      const screen = cinema.screens[show.screenIndex];

      // Pick 2-4 random seats
      const seatCount = 2 + (i % 3);
      const seats = [];
      const rowLetters = Array.from(screen.rows.keys());
      const randomRow = rowLetters[i % rowLetters.length];
      for (let s = 1; s <= seatCount; s++) {
        seats.push(`${randomRow}${s}`);
      }

      // Calculate price based on seat type
      const seatType = screen.rows.get(randomRow) || "regular";
      const pricePerSeat = show.price[seatType] || show.price.regular;
      const totalAmount = pricePerSeat * seatCount;
      const convenienceFee = Math.round(totalAmount * 0.05);
      const gst = Math.round(totalAmount * 0.18);
      const grandTotal = totalAmount + convenienceFee + gst;

      const seatCategories = { regular: 0, premium: 0, vip: 0 };
      seatCategories[seatType] = seatCount;

      sampleBookings.push({
        user: user._id,
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
        seatCount,
        seatCategories,
        totalAmount,
        convenienceFee,
        gst,
        grandTotal,
        status: i < 5 ? "confirmed" : "cancelled",
        paymentStatus: i < 5 ? "completed" : "refunded",
        paymentMethod: ["card", "upi", "netbanking", "wallet"][i % 4],
        paymentId: `PAY_${Date.now()}_${i}`,
        cancelledAt: i >= 5 ? new Date() : null,
        refundAmount: i >= 5 ? grandTotal : 0,
      });
    }

    // Insert bookings one by one (so pre-save hook generates bookingId)
    for (const bookingData of sampleBookings) {
      await Booking.create(bookingData);
    }
    console.log(`🎟️  Inserted ${sampleBookings.length} sample bookings`);

    // Update user stats based on bookings
    for (const user of regularUsers) {
      const userBookings = await Booking.find({ user: user._id, status: "confirmed" });
      const totalSpent = userBookings.reduce((sum, b) => sum + b.grandTotal, 0);
      await User.findByIdAndUpdate(user._id, {
        totalBookings: userBookings.length,
        totalSpent,
      });
    }
    console.log("📊 Updated user booking stats");

    // Update movie booking counts
    for (const movie of insertedMovies) {
      const count = await Booking.countDocuments({ movie: movie._id, status: "confirmed" });
      await Movie.findByIdAndUpdate(movie._id, { totalBookings: count });
    }
    console.log("📊 Updated movie booking counts");

    console.log("\n══════════════════════════════════════════════════════════════");
    console.log("🎉 Seeding complete! Open MongoDB Compass to view your data.");
    console.log("══════════════════════════════════════════════════════════════");
    console.log("   Connection:  mongodb://127.0.0.1:27017/cinebook");
    console.log("   Database:    cinebook");
    console.log("   Collections:");
    console.log("     📽️  movies    — " + insertedMovies.length + " documents");
    console.log("     👥 users     — " + insertedUsers.length + " documents");
    console.log("     🎟️  bookings  — " + sampleBookings.length + " documents");
    console.log("     🎭 shows     — " + showDocs.length + " documents");
    console.log("     🏛️  cinemas   — " + insertedCinemas.length + " documents");
    console.log("══════════════════════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding error:", error.message);
    console.error(error);
    process.exit(1);
  }
}

seed();
