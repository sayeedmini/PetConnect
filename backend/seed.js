const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const GroomerProfile = require('./models/GroomerProfile');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    await User.deleteMany({ role: 'groomer' });
    await GroomerProfile.deleteMany();

    const users = await User.insertMany([
      { name: 'Sarah\'s Pet Spa', email: 'sarah@petconnect.com', password: 'password123', role: 'groomer' },
      { name: 'The Bark Butler', email: 'barkbutler@petconnect.com', password: 'password123', role: 'groomer' },
      { name: 'Paws & Relax Grooming', email: 'paws@petconnect.com', password: 'password123', role: 'groomer' },
      { name: 'Dapper Dog Salon', email: 'dapper@petconnect.com', password: 'password123', role: 'groomer' },
      { name: 'Squeaky Clean Sweets', email: 'squeaky@petconnect.com', password: 'password123', role: 'groomer' },
      { name: 'Fluff & Puff Mobile', email: 'fluff@petconnect.com', password: 'password123', role: 'groomer' },
      { name: 'Luxury Paw Spa', email: 'luxury@petconnect.com', password: 'password123', role: 'groomer' }
    ]);

    await GroomerProfile.insertMany([
      {
        userId: users[0]._id,
        experience: '5 Years',
        services: ['Bath & Brush', 'Nail Trimming', 'Ear Cleaning'],
        pricing: [{ packageName: 'Basic Bath', price: 40, description: 'Includes bath, brush out, and ear cleaning' }],
        location: { type: 'Point', coordinates: [90.4125, 23.8103] }, // Gulshan 2
        addressString: 'Gulshan 2, Dhaka, Bangladesh',
        portfolioImages: [
          'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=500&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=500&auto=format&fit=crop&q=60'
        ]
      },
      {
        userId: users[1]._id,
        experience: '8 Years',
        services: ['Full Grooming', 'Teeth Brushing', 'De-Shedding'],
        pricing: [{ packageName: 'Full works', price: 85, description: 'Everything your pet needs.' }],
        location: { type: 'Point', coordinates: [90.4043, 23.7949] }, // Banani
        addressString: 'Banani, Dhaka, Bangladesh',
        portfolioImages: [
          'https://images.unsplash.com/photo-1606425271394-c3ca9aa1fc06?w=500&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1599561046222-a2076ed0d414?w=500&auto=format&fit=crop&q=60'
        ]
      },
      {
        userId: users[2]._id,
        experience: '3 Years',
        services: ['Flea Treatment', 'Nail Trimming', 'Bath & Brush'],
        pricing: [{ packageName: 'Flea & Tick Combo', price: 60, description: 'Flea removal and bath.' }],
        location: { type: 'Point', coordinates: [90.3795, 23.8759] }, // Uttara
        addressString: 'Uttara Sector 4, Dhaka, Bangladesh',
        portfolioImages: [
          'https://plus.unsplash.com/premium_photo-1663126298656-33616be83c32?w=500&auto=format&fit=crop&q=60'
        ]
      },
      {
        userId: users[3]._id,
        experience: '10 Years',
        services: ['Full Grooming', 'Creative Styling', 'Nail Trimming'],
        pricing: [
          { packageName: 'Show Dog Prep', price: 120, description: 'Get ready for the runway.' },
          { packageName: 'Standard Trim', price: 65, description: 'Basic trim and styling.' }
        ],
        location: { type: 'Point', coordinates: [90.3742, 23.7461] }, // Dhanmondi
        addressString: 'Dhanmondi 27, Dhaka, Bangladesh',
        portfolioImages: [
          'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=500&auto=format&fit=crop&q=60'
        ]
      },
      {
        userId: users[4]._id,
        experience: '2 Years',
        services: ['Bath & Brush', 'Ear Cleaning'],
        pricing: [{ packageName: 'Puppy Intro', price: 30, description: 'A gentle first bath experience.' }],
        location: { type: 'Point', coordinates: [90.3943, 23.7516] }, // Farmgate
        addressString: 'Farmgate, Dhaka, Bangladesh',
        portfolioImages: [
          'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=60'
        ]
      },
      {
        userId: users[5]._id,
        experience: '7 Years',
        services: ['Full Grooming', 'Bath & Brush', 'Nail Trimming', 'De-Shedding'],
        pricing: [{ packageName: 'Mobile Full Service', price: 95, description: 'We bring the salon to you!' }],
        location: { type: 'Point', coordinates: [90.4086, 23.7231] }, // Gulistan
        addressString: 'Gulistan, Dhaka, Bangladesh',
        portfolioImages: [
          'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=500&auto=format&fit=crop&q=60'
        ]
      },
      {
        userId: users[6]._id,
        experience: '15 Years',
        services: ['Bath & Brush', 'Full Grooming', 'Spa Massage'],
        pricing: [{ packageName: 'Pampered Pooch', price: 150, description: 'The absolute royal treatment.' }],
        location: { type: 'Point', coordinates: [90.4127, 23.7925] }, // Gulshan 1
        addressString: 'Gulshan 1, Dhaka, Bangladesh',
        portfolioImages: [
          'https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=500&auto=format&fit=crop&q=60'
        ]
      }
    ]);

    console.log('Database Seeding Successful!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding Failed:', err);
    process.exit(1);
  }
};

seedDB();
