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

async function runWishlistTests() {
  console.log('====================================================');
  console.log('  Marketplace Wishlist Feature Verification Suite');
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
    const ts = Date.now();
    const userAEmail = `wishlist_user_a_${ts}@campus.edu`;
    const userBEmail = `wishlist_user_b_${ts}@campus.edu`;
    const password = 'Password123!';

    // Register User A
    const regA = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'Alice Wishlist', email: userAEmail, password, role: 'student' }
    );
    assert(regA.status === 201 && regA.body.token, 'Register User A');
    let tokenA = regA.body.token;

    // Register User B
    const regB = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'Bob Wishlist', email: userBEmail, password, role: 'student' }
    );
    assert(regB.status === 201 && regB.body.token, 'Register User B');
    const tokenB = regB.body.token;

    // Create 2 test products by User A
    const prod1Res = await request(
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
        title: 'MacBook Air M2 16GB',
        description: 'Excellent condition laptop for computer science students.',
        price: 850,
        category: 'Electronics',
        condition: 'Like New',
        location: 'Engineering Hall',
      }
    );
    assert(prod1Res.status === 201, 'Create Product 1');
    const prod1Id = prod1Res.body.data.id;

    const prod2Res = await request(
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
        title: 'Calculus 4th Edition',
        description: 'Hardcover textbook, no markings inside.',
        price: 45,
        category: 'Textbooks',
        condition: 'Good',
        location: 'Campus Library',
      }
    );
    assert(prod2Res.status === 201, 'Create Product 2');
    const prod2Id = prod2Res.body.data.id;

    // 0. Initial Wishlist for User A should be empty
    const initialWishlist = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/wishlist',
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      initialWishlist.status === 200 && initialWishlist.body.data.length === 0,
      'Initial Wishlist for User A is empty'
    );

    // 1. Add Product 1 to Wishlist
    console.log('\n--- Test 1: Add Product ---');
    const addRes1 = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/wishlist/${prod1Id}`,
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      addRes1.status === 200 &&
        addRes1.body.data.length === 1 &&
        addRes1.body.data[0].id === prod1Id,
      'POST /api/wishlist/:productId adds product successfully'
    );

    // Also add Product 2
    const addRes2 = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/wishlist/${prod2Id}`,
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      addRes2.status === 200 && addRes2.body.data.length === 2,
      'Add second product to wishlist'
    );

    // 2. Duplicate Add
    console.log('\n--- Test 2: Prevent Duplicate Add ---');
    const dupRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/wishlist/${prod1Id}`,
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      dupRes.status === 200 && dupRes.body.data.length === 2,
      'Duplicate add does not create duplicate entries'
    );

    // 3. Remove Product
    console.log('\n--- Test 3: Remove Product ---');
    const delRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/wishlist/${prod1Id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(
      delRes.status === 200 &&
        delRes.body.data.length === 1 &&
        delRes.body.data[0].id === prod2Id,
      'DELETE /api/wishlist/:productId removes product successfully'
    );

    // 4. Invalid Product Handling
    console.log('\n--- Test 4: Invalid Product Handling ---');
    const invalidIdRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/wishlist/not-a-valid-id`,
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(invalidIdRes.status === 400, 'Invalid ObjectId format returns 400 Bad Request');

    const nonExistentRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/wishlist/507f1f77bcf86cd799439011`,
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(nonExistentRes.status === 404, 'Non-existent Product ID returns 404 Not Found');

    // 5. User Isolation
    console.log('\n--- Test 5: User Isolation ---');
    const userBWishlist = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/wishlist',
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    assert(
      userBWishlist.status === 200 && userBWishlist.body.data.length === 0,
      "User B cannot access User A's wishlist items"
    );

    // 6. Logout / Login & Persistence
    console.log('\n--- Test 6: Logout / Login & Wishlist Persistence ---');
    // Simulate re-login (logout clears client token, new login returns fresh token)
    const loginRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: userAEmail, password }
    );
    assert(loginRes.status === 200 && loginRes.body.token, 'User A logs back in with fresh token');
    const newSessionToken = loginRes.body.token;

    const persistedWishlist = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/wishlist',
      method: 'GET',
      headers: { Authorization: `Bearer ${newSessionToken}` },
    });
    assert(
      persistedWishlist.status === 200 &&
        persistedWishlist.body.data.length === 1 &&
        persistedWishlist.body.data[0].id === prod2Id,
      'Wishlist persists accurately across logout and re-login'
    );

    // 7. Safe handling of deleted product
    console.log('\n--- Test 7: Safe Handling of Deleted Product ---');
    // Delete Product 2 directly
    const deleteProd2 = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/products/${prod2Id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenA}` },
    });
    assert(deleteProd2.status === 200, 'Product 2 deleted from products catalog');

    // Now get Wishlist for User A - should safely return 0 products and not crash
    const safeWishlistRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/wishlist',
      method: 'GET',
      headers: { Authorization: `Bearer ${newSessionToken}` },
    });
    assert(
      safeWishlistRes.status === 200 && safeWishlistRes.body.data.length === 0,
      'Safe handling of deleted product: returns empty without errors'
    );

    // Summary
    console.log('\n====================================================');
    console.log(`Results: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unexpected error running tests:', err);
    process.exit(1);
  }
}

runWishlistTests();
