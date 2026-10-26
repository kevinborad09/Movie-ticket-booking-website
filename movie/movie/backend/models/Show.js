const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "Movie is required"],
    },
    cinema: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cinema",
      required: [true, "Cinema is required"],
    },
    screenIndex: {
      type: Number,
      required: [true, "Screen index is required"],
    },
    screenName: {
      type: String,
      required: true,
    },
    screenType: {
      type: String,
      required: true,
    },
    date: {
      type: String, // format: "YYYY-MM-DD"
      required: [true, "Show date is required"],
    },
    time: {
      type: String, // format: "10:00 AM"
      required: [true, "Show time is required"],
    },
    endTime: {
      type: String, // format: "12:30 PM"
      default: "",
    },
    language: {
      type: String,
      default: "Hindi",
    },
    format: {
      type: String,
      enum: ["2D", "3D", "IMAX", "4DX", "Dolby Atmos"],
      default: "2D",
    },
    price: {
      regular: { type: Number, required: true },
      premium: { type: Number, required: true },
      vip: { type: Number, required: true },
    },
    totalSeats: {
      type: Number,
      default: 0,
    },
    bookedSeatsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "housefull", "completed"],
      default: "active",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
showSchema.index({ movie: 1, date: 1 });
showSchema.index({ cinema: 1, date: 1 });
showSchema.index({ date: 1, time: 1 });
showSchema.index({ status: 1 });

module.exports = mongoose.model("Show", showSchema);
