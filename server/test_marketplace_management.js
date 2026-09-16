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

async function runTwoUserTests() {
  console.log('====================================================');
  console.log('  Marketplace Management: Two-User Ownership Tests');
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
    const emailA = `usera_${timestamp}@campus.edu`;
    const emailB = `userb_${timestamp}@campus.edu`;

    // 1. Register User A
    const regA = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'User Alice', email: emailA, password: 'password123', role: 'student' }
    );
    const tokenA = regA.body.token;

    // 2. Register User B
    const regB = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'User Bob', email: emailB, password: 'password123', role: 'student' }
    );
    const tokenB = regB.body.token;

    // 3. User A creates Product A
    const createRes = await request(
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
        title: 'Product A - Chemistry Lab Goggles',
        description: 'ANSI Z87 certified splash resistant eye protection.',
        price: 15,
        category: 'Stationery',
        condition: 'Like New',
        location: 'Chemistry Lab B',
      }
    );
    assert(createRes.status === 201, '1. User A successfully creates Product A');
    const productA = createRes.body.data;
    const productAId = productA.id || productA._id;

    // 4. GET /api/products/my-listings without auth -> 401
    const unauthMy = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products/my-listings',
      method: 'GET',
    });
    assert(unauthMy.status === 401, '2. GET /api/products/my-listings without auth returns 401 Unauthorized');

    // 5. GET /api/products/my-listings for User A -> includes Product A
    const myA = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products/my-listings',
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      myA.status === 200 && myA.body.data.some((p) => (p.id || p._id) === productAId),
      '3. GET /api/products/my-listings for User A returns Product A'
    );

    // 6. GET /api/products/my-listings for User B -> does NOT include Product A
    const myB = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/products/my-listings',
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(
      myB.status === 200 && !myB.body.data.some((p) => (p.id || p._id) === productAId),
      '4. GET /api/products/my-listings for User B strictly excludes User A\'s products'
    );

    // 7. User B attempts to EDIT Product A -> 403 Forbidden
    const editByB = await request(
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
      { price: 5, title: 'Hacked Title' }
    );
    assert(editByB.status === 403, '5. User B CANNOT edit Product A (403 Forbidden)');

    // 8. User A EDITS Product A -> 200 OK
    const editByA = await request(
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
      { price: 18, location: 'Updated Pickup - Lab C' }
    );
    assert(
      editByA.status === 200 && editByA.body.data.price === 18 && editByA.body.data.location === 'Updated Pickup - Lab C',
      '6. User A CAN edit Product A (200 OK)'
    );

    // 9. User B attempts to change status of Product A -> 403 Forbidden
    const statusByB = await request(
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
    assert(statusByB.status === 403, '7. User B CANNOT change Product A status (403 Forbidden)');

    // 10. User A marks Product A as SOLD -> 200 OK
    const statusByA = await request(
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
      statusByA.status === 200 && statusByA.body.data.status === 'SOLD',
      '8. User A CAN mark Product A as SOLD (200 OK)'
    );

    // 11. User B attempts to DELETE Product A -> 403 Forbidden
    const deleteByB = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/products/${productAId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(deleteByB.status === 403, '9. User B CANNOT delete Product A (403 Forbidden)');

    // 12. User A DELETES Product A -> 200 OK
    const deleteByA = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/products/${productAId}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(deleteByA.status === 200, '10. User A CAN delete Product A (200 OK)');

    // 13. Confirm Product A is deleted -> 404
    const getDeleted = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/products/${productAId}`,
      method: 'GET',
    });
    assert(getDeleted.status === 404, '11. Product A is verified deleted (404 Not Found)');

    console.log('====================================================');
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log('====================================================');
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTwoUserTests();
