const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
      index: true,
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    duration: {
      type: String,
      default: "N/A",
    },
    language: {
      type: String,
      default: "Hindi",
      trim: true,
    },
    poster: {
      type: String,
      default: "/posters/default.jpg",
    },
    backdrop: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    director: {
      type: String,
      default: "",
    },
    cast: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    trailerUrl: {
      type: String,
      default: "",
    },
    certification: {
      type: String,
      enum: ["U", "UA", "A", "S", "U/A 7+", "U/A 13+", "U/A 16+", ""],
      default: "UA",
    },
    status: {
      type: String,
      enum: ["now-showing", "coming-soon", "ended"],
      default: "now-showing",
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    formats: {
      type: [String],
      default: ["2D"],
      enum: ["2D", "3D", "IMAX", "4DX", "Dolby Atmos"],
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search functionality — language_override avoids conflict with our 'language' field
movieSchema.index(
  { title: "text", genre: "text", director: "text" },
  { language_override: "searchLanguage" }
);

module.exports = mongoose.model("Movie", movieSchema);
