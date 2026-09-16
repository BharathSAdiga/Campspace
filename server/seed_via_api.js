const http = require('http');

function post(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      },
      (res) => {
        let respData = '';
        res.on('data', (c) => (respData += c));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(respData) }));
      }
    );
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

const items = [
  {
    title: 'Campbell Biology 12th Edition',
    description: 'Required textbook for BIO 101 and 102. Minimal pencil notes in first 2 chapters, otherwise pristine condition. Includes unopened online access code.',
    price: 65,
    category: 'Textbooks',
    condition: 'Like New',
    location: 'Science Library - 2nd Floor',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=60'],
  },
  {
    title: 'Apple iPad Air (5th Gen, 64GB WiFi) + Apple Pencil',
    description: 'Space Gray iPad Air with M1 chip. Comes with Apple Pencil 2nd generation, magnetic folio case, and original charger. Battery health at 96%. Great for lecture note-taking.',
    price: 420,
    category: 'Electronics',
    condition: 'Like New',
    location: 'Engineering Building B Lobby',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=60'],
  },
  {
    title: 'Ergonomic Mesh Swivel Desk Chair',
    description: 'Breathable high-back mesh chair with adjustable lumbar support and flip-up armrests. Selling because moving to unfurnished apartment.',
    price: 45,
    category: 'Furniture',
    condition: 'Good',
    location: 'North Residential Village',
    images: ['https://images.unsplash.com/photo-1580481077197-2856f685c4cf?w=800&auto=format&fit=crop&q=60'],
  },
  {
    title: 'TI-84 Plus CE Color Graphing Calculator',
    description: 'Rose Gold graphing calculator approved for SAT, ACT, AP Calc, and College Algebra. Rechargeable lithium battery with charging cable.',
    price: 75,
    category: 'Electronics',
    condition: 'Good',
    location: 'Campus Center Food Court',
    images: ['https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=60'],
  },
  {
    title: 'Campus Oversized Champion Hoodie (Size L)',
    description: 'Authentic university heavyweight fleece pullover hoodie in navy blue. Worn only a few times during homecoming season. Clean, no stains.',
    price: 30,
    category: 'Clothing',
    condition: 'Like New',
    location: 'South Campus Quad',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=60'],
  },
  {
    title: 'Compact 3.2 Cu. Ft. Mini Fridge with Freezer',
    description: 'Frigidaire double-door mini fridge. Super quiet compressor, perfect for dorm room. Cleaned and defrosted, ready for pickup.',
    price: 90,
    category: 'Dorm & Housing',
    condition: 'Good',
    location: 'Oak Hall Dormitory',
    images: ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&auto=format&fit=crop&q=60'],
  },
  {
    title: 'Organic Chemistry Model Kit (240 Pieces)',
    description: 'Molecular model set for general and organic chemistry courses. All bonds, atoms, and disconnect tool included in plastic storage case.',
    price: 18,
    category: 'Stationery',
    condition: 'Like New',
    location: 'Chemistry Building 1st Floor',
    images: ['https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=60'],
  },
  {
    title: 'Trek FX 2 Hybrid Commuter Bicycle (19" Frame)',
    description: 'Reliable campus commuter bike with 24-speed Shimano gears, lightweight aluminum frame, kickstand, and rear cargo rack. Includes Kryptonite U-lock.',
    price: 210,
    category: 'Sports & Fitness',
    condition: 'Good',
    location: 'Campus Bike Shelter East',
    images: ['https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=60'],
  },
];

async function run() {
  const email = `campus_seller_${Date.now()}@campus.edu`;
  const reg = await post('/api/auth/register', {
    name: 'Sarah Chen',
    email,
    password: 'password123',
    role: 'student',
  });

  const token = reg.body.token;
  console.log('Registered seed user:', email);

  for (const item of items) {
    const res = await post('/api/products', item, token);
    console.log(`Created: ${item.title} -> status ${res.status}`);
  }

  console.log('Finished seeding real marketplace products via API!');
}

run().catch(console.error);
