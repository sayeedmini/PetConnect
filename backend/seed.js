const mongoose = require("mongoose");
require("dotenv").config();

const Groomer = require("./models/Groomer");
const Booking = require("./models/Booking");

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    // Clear existing data
    await Groomer.deleteMany();
    await Booking.deleteMany();

    // Seed groomers with PRECISE Dhaka coordinates
    await Groomer.insertMany([
      {
        name: "Sarah's Pet Spa",
        email: "sarah@petconnect.com",
        experience: "5 Years",
        services: ["Bath & Brush", "Nail Trimming", "Ear Cleaning"],
        pricing: [{ packageName: "Basic Bath", price: 40, description: "Includes bath, brush out, and ear cleaning" }],
        location: { type: "Point", coordinates: [90.4152, 23.8161] },
        address: "Located in Gulshan 2, Dhaka",
        portfolioImages: [
          "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=500&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "The Bark Butler",
        email: "barkbutler@petconnect.com",
        experience: "8 Years",
        services: ["Full Grooming", "Teeth Brushing", "De-Shedding"],
        pricing: [{ packageName: "Full Works", price: 85, description: "Everything your pet needs." }],
        location: { type: "Point", coordinates: [90.4066, 23.7937] },
        address: "Located in Banani, Dhaka",
        portfolioImages: [
          "https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?w=500&auto=format&fit=crop&q=60",
          "https://images.unsplash.com/photo-1599561046222-a2076ed0d414?w=500&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Paws & Relax Grooming",
        email: "paws@petconnect.com",
        experience: "3 Years",
        services: ["Flea Treatment", "Nail Trimming", "Bath & Brush"],
        pricing: [{ packageName: "Flea & Tick Combo", price: 60, description: "Flea removal and bath." }],
        location: { type: "Point", coordinates: [90.3881, 23.8724] },
        address: "Located in Uttara Sector 4, Dhaka",
        portfolioImages: [
          "https://plus.unsplash.com/premium_photo-1663126298656-33616be83c32?w=500&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Dapper Dog Salon",
        email: "dapper@petconnect.com",
        experience: "10 Years",
        services: ["Full Grooming", "Creative Styling", "Nail Trimming"],
        pricing: [
          { packageName: "Show Dog Prep", price: 120, description: "Get ready for the runway." },
          { packageName: "Standard Trim", price: 65, description: "Basic trim and styling." },
        ],
        location: { type: "Point", coordinates: [90.3742, 23.7461] },
        address: "Located in Dhanmondi 27, Dhaka",
        portfolioImages: [
          "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Squeaky Clean Pets",
        email: "squeaky@petconnect.com",
        experience: "2 Years",
        services: ["Bath & Brush", "Ear Cleaning"],
        pricing: [{ packageName: "Puppy Intro", price: 30, description: "A gentle first bath experience." }],
        location: { type: "Point", coordinates: [90.3900, 23.7562] },
        address: "Located in Farmgate, Dhaka",
        portfolioImages: [
          "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Fluff & Puff Mobile",
        email: "fluff@petconnect.com",
        experience: "7 Years",
        services: ["Full Grooming", "Bath & Brush", "Nail Trimming", "De-Shedding"],
        pricing: [{ packageName: "Mobile Full Service", price: 95, description: "We bring the salon to you!" }],
        location: { type: "Point", coordinates: [90.4126, 23.7231] },
        address: "Located in Gulistan, Dhaka",
        portfolioImages: [
          "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=60",
        ],
      },
      {
        name: "Luxury Paw Spa",
        email: "luxury@petconnect.com",
        experience: "15 Years",
        services: ["Bath & Brush", "Full Grooming", "Spa Massage"],
        pricing: [{ packageName: "Pampered Pooch", price: 150, description: "The absolute royal treatment." }],
        location: { type: "Point", coordinates: [90.4131, 23.7925] },
        address: "Located in Gulshan 1, Dhaka",
        portfolioImages: [
          "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=500&auto=format&fit=crop&q=60",
        ],
      },
    ]);

    console.log("Database seeded with precision coordinates!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();
