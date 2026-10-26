const theatres = [
  {
    id: 1,
    name: "CineBook IMAX Centre",
    location: "Mumbai",
    address: "Phoenix Marketcity, LBS Marg, Kurla West, Mumbai 400070",
    image: "/posters/pushpa2.jpg",
    screens: [
      {
        id: 1,
        name: "IMAX Screen",
        type: "IMAX",
        rows: { A: "vip", B: "vip", C: "premium", D: "premium", E: "premium", F: "regular", G: "regular", H: "regular" },
        seatsPerRow: 12,
      },
      {
        id: 2,
        name: "Screen 2",
        type: "Dolby Atmos",
        rows: { A: "premium", B: "premium", C: "regular", D: "regular", E: "regular", F: "regular" },
        seatsPerRow: 14,
      },
    ],
  },
  {
    id: 2,
    name: "CineBook Cineplex",
    location: "Mumbai",
    address: "R City Mall, LBS Marg, Ghatkopar West, Mumbai 400086",
    image: "/posters/singham_again.jpg",
    screens: [
      {
        id: 3,
        name: "Screen 1",
        type: "4K Laser",
        rows: { A: "premium", B: "premium", C: "premium", D: "regular", E: "regular", F: "regular", G: "regular" },
        seatsPerRow: 16,
      },
      {
        id: 4,
        name: "Screen 2",
        type: "Standard",
        rows: { A: "premium", B: "regular", C: "regular", D: "regular", E: "regular" },
        seatsPerRow: 12,
      },
      {
        id: 5,
        name: "Screen 3",
        type: "Standard",
        rows: { A: "premium", B: "regular", C: "regular", D: "regular", E: "regular", F: "regular" },
        seatsPerRow: 14,
      },
    ],
  },
  {
    id: 3,
    name: "CineBook Gold Lounge",
    location: "Mumbai",
    address: "Palladium Mall, Lower Parel, Mumbai 400013",
    image: "/posters/sky_force.jpg",
    screens: [
      {
        id: 6,
        name: "Gold Screen 1",
        type: "Gold Class",
        rows: { A: "vip", B: "vip", C: "vip", D: "premium", E: "premium" },
        seatsPerRow: 8,
      },
      {
        id: 7,
        name: "Gold Screen 2",
        type: "Gold Class",
        rows: { A: "vip", B: "vip", C: "premium", D: "premium" },
        seatsPerRow: 10,
      },
    ],
  },
  {
    id: 4,
    name: "Starlight Multiplex",
    location: "Mumbai",
    address: "Viviana Mall, Eastern Express Highway, Thane, Mumbai 400601",
    image: "/posters/deva.jpg",
    screens: [
      {
        id: 8,
        name: "Screen 1",
        type: "Standard",
        rows: { A: "premium", B: "premium", C: "regular", D: "regular", E: "regular", F: "regular", G: "regular", H: "regular" },
        seatsPerRow: 16,
      },
      {
        id: 9,
        name: "Screen 2",
        type: "3D",
        rows: { A: "premium", B: "premium", C: "regular", D: "regular", E: "regular", F: "regular" },
        seatsPerRow: 14,
      },
    ],
  },
];

module.exports = theatres;
