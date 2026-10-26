const movies = require("./movies");
const theatres = require("./theatres");

// Generate shows dynamically for the next 3 days.
// Each movie plays at multiple theatres/screens/times.

function generateShows() {
  const shows = [];
  let showId = 1;

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

  const timeSlots = ["10:00 AM", "01:15 PM", "04:30 PM", "07:45 PM", "10:30 PM"];

  const prices = {
    IMAX:        { regular: 300, premium: 500, vip: 750 },
    "Dolby Atmos": { regular: 280, premium: 450, vip: 700 },
    "4K Laser":  { regular: 250, premium: 400, vip: 650 },
    "Gold Class": { regular: 500, premium: 700, vip: 1000 },
    "3D":        { regular: 220, premium: 350, vip: 550 },
    Standard:    { regular: 180, premium: 280, vip: 450 },
  };

  movies.forEach((movie, mi) => {
    theatres.forEach((theatre) => {
      theatre.screens.forEach((screen, si) => {
        // Each screen shows 2-3 time slots for each movie (spread across the day)
        const slotStart = (mi + si) % timeSlots.length;
        const slotCount = 2 + (mi % 2); // 2 or 3 shows per screen per movie

        for (let s = 0; s < slotCount; s++) {
          const slotIndex = (slotStart + s * 2) % timeSlots.length;

          dates.forEach((date) => {
            shows.push({
              id: showId++,
              movieId: movie.id,
              theatreId: theatre.id,
              screenId: screen.id,
              screenName: screen.name,
              screenType: screen.type,
              theatreName: theatre.name,
              date,
              time: timeSlots[slotIndex],
              price: prices[screen.type] || prices.Standard,
            });
          });
        }
      });
    });
  });

  return shows;
}

const shows = generateShows();
module.exports = shows;
