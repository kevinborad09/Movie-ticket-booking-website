const bcrypt = require("bcryptjs");

// In-memory user and booking store.
// Will be replaced by MongoDB collections in a later phase.

const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@cinebook.com",
    password: bcrypt.hashSync("admin123", 10),
    phone: "9876543210",
    role: "admin",
    avatar: "",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    password: bcrypt.hashSync("user123", 10),
    phone: "9876543211",
    role: "user",
    avatar: "",
    createdAt: "2026-06-15T00:00:00.000Z",
  },
];

const bookings = [];

let _nextUserId = 3;
let _nextBookingId = 1;

module.exports = {
  users,
  bookings,
  getNextUserId() {
    return _nextUserId++;
  },
  getNextBookingId() {
    return `BK${String(_nextBookingId++).padStart(5, "0")}`;
  },
};
