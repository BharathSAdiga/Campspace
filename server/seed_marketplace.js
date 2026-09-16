const mongoose = require('mongoose');
const { User } = require('./src/models/User');
const { Product } = require('./src/models/Product');
const connectDB = require('./src/config/db');

const sampleProducts = [
  {
    title: 'Campbell Biology 12th Edition',
    description: 'Required textbook for BIO 101 and 102. Minimal pencil notes in first 2 chapters, otherwise pristine condition. Includes unopened online access code.',
    price: 65,
    category: 'Textbooks',
    condition: 'Like New',
    location: 'Science Library - 2nd Floor',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60'],
    status: 'ACTIVE',
  },
  {
    title: 'Apple iPad Air (5th Gen, 64GB WiFi) + Apple Pencil',
    description: 'Space Gray iPad Air with M1 chip. Comes with Apple Pencil 2nd generation, magnetic folio case, and original charger. Battery health at 96%. Great for lecture note-taking.',
    price: 420,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Engineering Building B Lobby',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60'],
    status: 'ACTIVE',
  },
  {
    title: 'Ergonomic Mesh Swivel Desk Chair',
    description: 'Breathable high-back mesh chair with adjustable lumbar support and flip-up armrests. Selling because moving to unfurnished apartment.',
    price: 45,
    category: 'Furniture',
    condition: 'Good',
    location: 'North Residential Village',
    images: ['https://images.unsplash.com/photo-1580481077197-2856f685c4cf?w=800&auto=format&fit=crop&q=60'],
    status: 'ACTIVE',
  },
  {
    title: 'TI-84 Plus CE Color Graphing Calculator',
    description: 'Rose Gold graphing calculator approved for SAT, ACT, AP Calc, and College Algebra. Rechargeable lithium battery with charging cable.',
    price: 75,
    category: 'Electronics',
    condition: 'Good',
    location: 'Campus Center Food Court',
    images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=60'],
    status: 'ACTIVE',
  },
  {
    title: 'Campus Oversized Champion Hoodie (Size L)',
    description: 'Authentic university heavyweight fleece pullover hoodie in navy blue. Worn only a few times during homecoming season. Clean, no stains.',
    price: 30,
    category: 'Clothing',
    condition: 'Like New',
    location: 'South Campus Quad',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=60'],
    status: 'ACTIVE',
  },
  {
    title: 'Compact 3.2 Cu. Ft. Mini Fridge with Freezer',
    description: 'Frigidaire double-door mini fridge. Super quiet compressor, perfect for dorm room. Cleaned and defrosted, ready for pickup.',
    price: 90,
    category: 'Dorm & Housing',
    condition: 'Good',
    location: 'Oak Hall Dormitory',
    images: ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=60'],
    status: 'ACTIVE',
  },
  {
    title: 'Organic Chemistry Model Kit (240 Pieces)',
    description: 'Molecular model set for general and organic chemistry courses. All bonds, atoms, and disconnect tool included in plastic storage case.',
    price: 18,
    category: 'Stationery',
    condition: 'Like New',
    location: 'Chemistry Building 1st Floor',
    images: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60'],
    status: 'ACTIVE',
  },
  {
    title: 'Trek FX 2 Hybrid Commuter Bicycle (19" Frame)',
    description: 'Reliable campus commuter bike with 24-speed Shimano gears, lightweight aluminum frame, kickstand, and rear cargo rack. Includes Kryptonite U-lock.',
    price: 210,
    category: 'Sports & Fitness',
    condition: 'Good',
    location: 'Campus Bike Shelter East',
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=60'],
    status: 'ACTIVE',
  },
];

async function seed() {
  try {
    // If not connected, connect
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    // Ensure a default seller user exists
    let user = await User.findOne({ email: 'seller_demo@campus.edu' });
    if (!user) {
      user = await User.create({
        name: 'Sarah Chen',
        email: 'seller_demo@campus.edu',
        password: 'password123',
        role: 'student',
      });
    }

    for (const item of sampleProducts) {
      const exists = await Product.findOne({ title: item.title });
      if (!exists) {
        await Product.create({
          ...item,
          seller: user._id,
        });
      }
    }

    console.log('[Seed] Sample marketplace products seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
}

seed();
