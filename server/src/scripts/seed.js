const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { User, Event, Product } = require('../models');

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/campspace';
  console.log(`Connecting to MongoDB at: ${uri}`);
  await mongoose.connect(uri);

  console.log('Connected. Clearing existing data...');
  await User.deleteMany({});
  await Event.deleteMany({});
  await Product.deleteMany({});

  console.log('Creating demo users...');
  const admin = await User.create({
    name: 'Campus Admin',
    email: 'admin@campus.edu',
    password: 'password123',
    role: 'admin',
  });

  const student = await User.create({
    name: 'Alex Rivera',
    email: 'alex@campus.edu',
    password: 'password123',
    role: 'student',
  });

  console.log('Creating sample campus events...');
  await Event.create([
    {
      title: 'Annual Hackathon 2026: Build The Future',
      description: 'Join 400+ campus engineers and designers for a 36-hour sprint building real-world AI, Web, and hardware solutions with top industry mentors.',
      category: 'Tech & Hackathons',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      startTime: '09:00 AM',
      endTime: '09:00 PM',
      location: 'Student Innovation Center, Hall A',
      organizer: admin._id,
      maximumParticipants: 450,
      currentParticipants: 120,
      status: 'ACTIVE',
    },
    {
      title: 'Career & Internship Expo Spring 2026',
      description: 'Connect directly with over 80 visiting tech companies, research labs, and finance firms offering full-time and summer intern positions.',
      category: 'Career & Professional',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      startTime: '10:00 AM',
      endTime: '04:00 PM',
      location: 'Campus Sports Arena & Exhibition Hall',
      organizer: admin._id,
      maximumParticipants: 1000,
      currentParticipants: 340,
      status: 'ACTIVE',
    },
    {
      title: 'Acoustic Sunset Quad Concert',
      description: 'An evening of live student performances, food trucks, and acoustic indie sets under the campus quad lanterns.',
      category: 'Arts & Performance',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      startTime: '06:00 PM',
      endTime: '09:30 PM',
      location: 'Central Lawn & Amphitheater',
      organizer: admin._id,
      maximumParticipants: 300,
      currentParticipants: 85,
      status: 'ACTIVE',
    },
  ]);

  console.log('Creating sample marketplace products...');
  await Product.create([
    {
      title: 'TI-84 Plus CE Graphing Calculator (Mint Condition)',
      description: 'Used for one semester of Calculus. Comes with charging cable, slide case, and original packaging. Battery lasts weeks.',
      price: 65,
      category: 'Electronics',
      condition: 'Like New',
      seller: student._id,
      status: 'ACTIVE',
    },
    {
      title: 'Organic Chemistry: Structure and Function (8th Edition)',
      description: 'Essential textbook for Chem 201. Clean pages with no highlighting or dog-ears. Saved me through midterms!',
      price: 45,
      category: 'Textbooks',
      condition: 'Good',
      seller: student._id,
      status: 'ACTIVE',
    },
    {
      title: 'Adjustable Ergonomic Dorm Desk Chair',
      description: 'Comfortable mesh high-back chair with lumbar support and pneumatic height adjustment. Moving out sale.',
      price: 50,
      category: 'Furniture',
      condition: 'Good',
      seller: student._id,
      status: 'ACTIVE',
    },
  ]);

  console.log('Seed completed successfully!');
  const userCount = await User.countDocuments();
  const eventCount = await Event.countDocuments();
  const productCount = await Product.countDocuments();
  console.log(`Current DB State: ${userCount} users, ${eventCount} events, ${productCount} products.`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
