const mongoose = require('mongoose');
const { User } = require('./src/models/User');
const { Resource } = require('./src/models/Resource');
const { Club } = require('./src/models/Club');
const config = require('./src/config/env');

async function seed() {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to DB for seeding modules');

    // Ensure we have an admin user and organizer/student
    let admin = await User.findOne({ email: 'admin@campspace.edu' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin Coordinator',
        email: 'admin@campspace.edu',
        password: 'password123',
        role: 'admin',
      });
      console.log('Created admin user: admin@campspace.edu');
    }

    let student = await User.findOne({ email: 'student@campspace.edu' });
    if (!student) {
      student = await User.create({
        name: 'Alex Johnson',
        email: 'student@campspace.edu',
        password: 'password123',
        role: 'student',
      });
      console.log('Created student user: student@campspace.edu');
    }

    // Seed Resources if empty
    const resourceCount = await Resource.countDocuments();
    if (resourceCount === 0) {
      const sampleResources = [
        {
          name: 'Main Auditorium',
          description: 'Large state-of-the-art auditorium equipped for university conferences, guest lectures, and film screenings.',
          category: 'Room',
          location: 'Building A, Ground Floor',
          capacity: 450,
          facilities: ['Dual Projectors', 'Surround Audio', 'Stage Lighting', 'Climate Control'],
          status: 'Available',
          createdBy: admin._id,
        },
        {
          name: 'Advanced Robotics & IoT Lab',
          description: 'Equipped with 3D printers, soldering stations, microcontrollers, and testing rigs for engineering projects.',
          category: 'Laboratory',
          location: 'Science Complex, Room 302',
          capacity: 35,
          facilities: ['Soldering Stations', '3D Printers', 'Oscilloscopes', 'Safety Gear'],
          status: 'Available',
          createdBy: admin._id,
        },
        {
          name: 'Collaborative Study Suite B',
          description: 'Quiet collaborative study room with high-speed Wi-Fi, whiteboard walls, and meeting display.',
          category: 'Room',
          location: 'Library, 3rd Floor',
          capacity: 12,
          facilities: ['Smart TV', 'Whiteboard Wall', 'Ergonomic Seating', 'Conference Cam'],
          status: 'Available',
          createdBy: admin._id,
        },
        {
          name: 'Sony Cinema Line FX3 Camera Kit',
          description: 'Professional 4K cinema camera with 24-70mm GM lens, wireless mic set, and carbon fiber tripod for media production.',
          category: 'Equipment',
          location: 'Media Arts Center, Equipment Desk',
          capacity: 1,
          facilities: ['Tripod Included', 'Wireless Mic', 'Extra Batteries', 'Hard Case'],
          status: 'Available',
          createdBy: admin._id,
        },
        {
          name: 'Indoor Badminton & Squash Arena',
          description: 'Wooden sprung court reserved for team practice, intramural matches, and student recreational booking.',
          category: 'Sports',
          location: 'Student Athletic Center',
          capacity: 20,
          facilities: ['Hardwood Flooring', 'Court Lights', 'Lockers', 'Water Station'],
          status: 'Available',
          createdBy: admin._id,
        },
      ];

      await Resource.insertMany(sampleResources);
      console.log(`Seeded ${sampleResources.length} resources!`);
    } else {
      console.log(`Resources already exist (${resourceCount} found).`);
    }

    // Seed Clubs if empty
    const clubCount = await Club.countDocuments();
    if (clubCount === 0) {
      const sampleClubs = [
        {
          name: 'Google Developer Student Club',
          description: 'University chapter focused on mobile and web app development, cloud architecture, and open source collaboration. We host weekly hackathons, codelabs, and tech talks with industry engineers.',
          category: 'Technology',
          coordinator: admin._id,
          members: [admin._id, student._id],
          createdBy: admin._id,
        },
        {
          name: 'Robotics & Autonomous Systems',
          description: 'Student engineering team designing autonomous rover systems, combat bots, and IoT hardware for national collegiate robotics competitions.',
          category: 'Technology',
          coordinator: admin._id,
          members: [admin._id],
          createdBy: admin._id,
        },
        {
          name: 'Campus Shutterbugs Photography Club',
          description: 'A vibrant collective of digital photographers, videographers, and visual storytellers capturing campus life, portraiture, and architectural landscapes.',
          category: 'Arts',
          coordinator: admin._id,
          members: [admin._id],
          createdBy: admin._id,
        },
        {
          name: 'Model United Nations & Debate Society',
          description: 'Promoting diplomatic discourse, parliamentary debate, and public speaking through regional simulations and competitive collegiate circuits.',
          category: 'Social',
          coordinator: admin._id,
          members: [admin._id],
          createdBy: admin._id,
        },
      ];

      await Club.insertMany(sampleClubs);
      console.log(`Seeded ${sampleClubs.length} clubs!`);
    } else {
      console.log(`Clubs already exist (${clubCount} found).`);
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
