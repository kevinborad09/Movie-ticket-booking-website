const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: [true, "Show is required"],
    },
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
    // Snapshot fields — stored so bookings remain readable even if show/movie is deleted
    movieTitle: {
      type: String,
      required: true,
    },
    moviePoster: {
      type: String,
      default: "",
    },
    cinemaName: {
      type: String,
      required: true,
    },
    cinemaAddress: {
      type: String,
      default: "",
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
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    seats: {
      type: [String],
      required: [true, "At least one seat is required"],
      validate: {
        validator: (v) => v.length > 0,
        message: "At least one seat must be selected",
      },
    },
    seatCount: {
      type: Number,
      required: true,
      min: 1,
    },
    seatCategories: {
      regular: { type: Number, default: 0 },
      premium: { type: Number, default: 0 },
      vip: { type: Number, default: 0 },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      default: 0,
    },
    gst: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "pending", "completed"],
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["completed", "refunded", "pending", "failed"],
      default: "completed",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "upi", "netbanking", "wallet", "cash"],
      default: "card",
    },
    paymentId: {
      type: String,
      default: "",
    },
    qrCode: {
      type: String,
      default: "",
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate bookingId before saving
bookingSchema.pre("save", async function () {
  if (!this.bookingId) {
    const count = await mongoose.model("Booking").countDocuments();
    this.bookingId = `BK${String(count + 1).padStart(5, "0")}`;
  }
  // Auto-calculate seatCount
  if (this.seats && !this.seatCount) {
    this.seatCount = this.seats.length;
  }
});

// Index for quick user-booking lookups
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ show: 1 });
bookingSchema.index({ movie: 1 });
bookingSchema.index({ cinema: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ date: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
