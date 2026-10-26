const mongoose = require("mongoose");

// Ensure the `id` virtual (string copy of `_id`) is included in JSON output
// so the frontend can use `.id` on every document.
mongoose.set("toJSON", { virtuals: true });
mongoose.set("toObject", { virtuals: true });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
