const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["IMAX", "Dolby Atmos", "4K Laser", "Gold Class", "3D", "Standard"],
  },
  rows: {
    type: Map,
    of: {
      type: String,
      enum: ["vip", "premium", "regular"],
    },
    required: true,
  },
  seatsPerRow: {
    type: Number,
    required: true,
    min: 1,
  },
  totalSeats: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const cinemaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Cinema name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      default: "Mumbai",
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "/posters/default.jpg",
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    facilities: {
      type: [String],
      default: ["Parking", "Food Court"],
      enum: [
        "Parking",
        "Food Court",
        "Wheelchair Accessible",
        "Dolby Sound",
        "Recliner Seats",
        "M-Ticket",
        "Online Booking",
        "3D Glasses",
        "Couple Seats",
        "WiFi",
      ],
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    screens: [screenSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    openingTime: {
      type: String,
      default: "09:00 AM",
    },
    closingTime: {
      type: String,
      default: "11:30 PM",
    },
  },
  {
    timestamps: true,
  }
);

// Index for location-based queries
cinemaSchema.index({ city: 1 });
cinemaSchema.index({ name: "text", location: "text" });

module.exports = mongoose.model("Cinema", cinemaSchema);
