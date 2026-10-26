import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import Cinemas from "./pages/Cinemas";
import CinemaDetails from "./pages/CinemaDetails";
import TheatreSelection from "./pages/TheatreSelection";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import BookingConfirmation from "./pages/BookingConfirmation";
import UserProfile from "./pages/UserProfile";
import BookingHistory from "./pages/BookingHistory";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/movies" element={<Movies />} />
      <Route path="/movies/:id" element={<MovieDetails />} />
      <Route path="/cinemas" element={<Cinemas />} />
      <Route path="/cinemas/:id" element={<CinemaDetails />} />

      {/* Booking flow */}
      <Route path="/booking/theatre/:movieId" element={<TheatreSelection />} />
      <Route path="/booking/seats/:showId" element={<SeatSelection />} />
      <Route path="/booking/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
      <Route path="/booking/confirmation/:bookingId" element={<ProtectedRoute><BookingConfirmation /></ProtectedRoute>} />

      {/* User */}
      <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      <Route path="/bookings" element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}

export default App;
