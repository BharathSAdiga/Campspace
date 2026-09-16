const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('  Campspace Marketplace Backend Test Suite');
  console.log('====================================================');

  let passed = 0;
  let failed = 0;

  const assert = (condition, title, details) => {
    if (condition) {
      console.log(`PASS: ${title}`);
      passed++;
    } else {
      console.error(`FAIL: ${title}`);
      if (details) console.error('   Details:', details);
      failed++;
    }
  };

  try {
    const timestamp = Date.now();
    const emailA = `seller_a_${timestamp}@campus.edu`;
    const emailB = `buyer_b_${timestamp}@campus.edu`;

    // Setup: Register Seller A
    const regA = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'Seller Alice', email: emailA, password: 'password123', role: 'student' }
    );
    const tokenA = regA.body.token;
    const userA = regA.body.user;

    // Setup: Register User B
    const regB = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'Buyer Bob', email: emailB, password: 'password123', role: 'student' }
    );
    const tokenB = regB.body.token;

    // 1. POST /api/products without token -> 401
    const t1 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/products',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { title: 'Test', price: 10 }
    );
    assert(t1.status === 401, '1. POST /api/products without authentication returns 401 Unauthorized');

    // 2. POST /api/products with invalid data -> 400
    const t2 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/products',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenA}`,
        },
      },
      { title: 'AB', description: 'Too short', price: -5, category: 'InvalidCat' }
    );
    assert(t2.status === 400 && t2.body.errors, '2. POST /api/products with invalid fields returns 400 Bad Request');

    // 3. POST /api/products valid listing by Seller A
    const t3 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/products',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenA}`,
        },
      },
      {
        title: 'Organic Chemistry 8th Edition',
        description: 'Hardcover textbook with no highlighting. Perfect for CHEM 201.',
        price: 55,
        category: 'Textbooks',
        condition: 'Like New',
        location: 'Chemistry Hall Room 102',
        images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c'],
      }
    );
    assert(
      t3.status === 201 &&
        t3.body.data &&
        t3.body.data.title === 'Organic Chemistry 8th Edition' &&
        t3.body.data.status === 'ACTIVE' &&
        t3.body.data.seller.email === emailA,
      '3. POST /api/products creates product, defaults status to ACTIVE, and binds authenticated seller',
      t3.body
    );
    const productA = t3.body.data;
    const productAId = productA.id || productA._id;

    // Seed more items for query testing
    await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/products',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      },
      {
        title: 'Sony WH-1000XM4 Wireless Noise Canceling Headphones',
        description: 'High quality audio with original charging cable and travel case.',
        price: 180,
        category: 'Electronics',
        condition: 'Good',
        location: 'Student Union Hub',
      }
    );

    await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/products',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
      },
      {
        title: 'Adjustable LED Dorm Desk Lamp',
        description: '3 brightness modes with USB-C phone charging port.',
        price: 20,
        category: 'Dorm & Housing',
        condition: 'Good',
        location: 'West Hall Dorm 3',
      }
    );

    // 4. GET /api/products returns paginated list
    const t4 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products',
      method: 'GET',
    });
    assert(
      t4.status === 200 && Array.isArray(t4.body.data) && t4.body.pagination.total >= 3,
      '4. GET /api/products returns paginated list of active listings'
    );

    // 5. GET /api/products?category=Electronics
    const t5 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products?category=Electronics',
      method: 'GET',
    });
    const onlyElectronics = t5.body.data.every((p) => p.category === 'Electronics');
    assert(
      t5.status === 200 && t5.body.data.length >= 1 && onlyElectronics,
      '5. GET /api/products?category=Electronics filters strictly by category'
    );

    // 6. GET /api/products?minPrice=50&maxPrice=100
    const t6 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products?minPrice=50&maxPrice=100',
      method: 'GET',
    });
    const validPrices = t6.body.data.every((p) => p.price >= 50 && p.price <= 100);
    assert(
      t6.status === 200 && t6.body.data.length >= 1 && validPrices,
      '6. GET /api/products with minPrice/maxPrice performs server-side range filtering'
    );

    // 7. GET /api/products?search=Chemistry
    const t7 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products?search=Chemistry',
      method: 'GET',
    });
    assert(
      t7.status === 200 && t7.body.data.some((p) => p.title.includes('Chemistry')),
      '7. GET /api/products?search=Chemistry searches across title and description'
    );

    // 8. GET /api/products?sort=price_asc
    const t8 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products?sort=price_asc',
      method: 'GET',
    });
    const prices = t8.body.data.map((p) => p.price);
    const isSortedAsc = prices.every((v, i) => i === 0 || v >= prices[i - 1]);
    assert(
      t8.status === 200 && isSortedAsc,
      '8. GET /api/products?sort=price_asc orders ascending by price'
    );

    // 9. GET /api/products/:id
    const t9 = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/products/${productAId}`,
      method: 'GET',
    });
    assert(
      t9.status === 200 && t9.body.data.title === 'Organic Chemistry 8th Edition' && t9.body.data.seller.name,
      '9. GET /api/products/:id returns product details and populated seller'
    );

    // 10. GET /api/products/invalid_id -> 400
    const t10 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products/invalid_mongo_id_format',
      method: 'GET',
    });
    assert(t10.status === 400, '10. GET /api/products/:id with malformed ID returns 400 Bad Request');

    // 11. GET /api/products/66e000000000000000000000 -> 404
    const t11 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products/66e000000000000000000000',
      method: 'GET',
    });
    assert(t11.status === 404, '11. GET /api/products/:id for non-existent ID returns 404 Not Found');

    // 12. PUT /api/products/:id by User B (non-owner) -> 403
    const t12 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/products/${productAId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenB}`,
        },
      },
      { price: 10 }
    );
    assert(t12.status === 403, '12. PUT /api/products/:id by non-owner returns 403 Forbidden');

    // 13. PUT /api/products/:id by Seller A (owner) -> 200
    const t13 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/products/${productAId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenA}`,
        },
      },
      { price: 48, location: 'Library 3rd Floor' }
    );
    assert(
      t13.status === 200 && t13.body.data.price === 48 && t13.body.data.location === 'Library 3rd Floor',
      '13. PUT /api/products/:id by owner updates listing (200 OK)'
    );

    // 14. PATCH /api/products/:id/status by User B (non-owner) -> 403
    const t14 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/products/${productAId}/status`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenB}`,
        },
      },
      { status: 'SOLD' }
    );
    assert(t14.status === 403, '14. PATCH /api/products/:id/status by non-owner returns 403 Forbidden');

    // 15. PATCH /api/products/:id/status with invalid status -> 400
    const t15 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/products/${productAId}/status`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenA}`,
        },
      },
      { status: 'INVALID_STATUS' }
    );
    assert(t15.status === 400, '15. PATCH /api/products/:id/status with invalid status returns 400 Bad Request');

    // 16. PATCH /api/products/:id/status by Seller A to 'SOLD' -> 200
    const t16 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/products/${productAId}/status`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenA}`,
        },
      },
      { status: 'SOLD' }
    );
    assert(
      t16.status === 200 && t16.body.data.status === 'SOLD',
      '16. PATCH /api/products/:id/status by owner changes status to SOLD (200 OK)'
    );

    // 17. DELETE /api/products/:id by User B (non-owner) -> 403
    const t17 = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/products/${productAId}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenB}`,
      },
    });
    assert(t17.status === 403, '17. DELETE /api/products/:id by non-owner returns 403 Forbidden');

    // 18. DELETE /api/products/:id by Seller A (owner) -> 200
    const t18 = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/products/${productAId}`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
    });
    assert(t18.status === 200, '18. DELETE /api/products/:id by owner deletes listing (200 OK)');

    // 19. Verify product is gone -> 404
    const t19 = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/products/${productAId}`,
      method: 'GET',
    });
    assert(t19.status === 404, '19. GET /api/products/:id on deleted product returns 404 Not Found');

    console.log('====================================================');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('====================================================');
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
