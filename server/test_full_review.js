const http = require('http');

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body !== undefined && body !== null ? JSON.stringify(body) : '';
    const headers = {
      ...(data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers,
      },
      (res) => {
        let respData = '';
        res.on('data', (c) => (respData += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(respData) });
          } catch (e) {
            resolve({ status: res.statusCode, body: respData });
          }
        });
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

let testCount = 0;
let passCount = 0;
let failCount = 0;
const failures = [];

function assert(condition, testName, detail = '') {
  testCount++;
  if (condition) {
    passCount++;
    console.log(`  ✅ [PASS] ${testName}`);
  } else {
    failCount++;
    const msg = `❌ [FAIL] ${testName} ${detail ? `(${detail})` : ''}`;
    console.error(`  ${msg}`);
    failures.push(msg);
  }
}

async function runReview() {
  console.log('================================================================');
  console.log('  CAMPSPACE: COMPREHENSIVE INTEGRATION & SECURITY REVIEW SUITE');
  console.log('  Modules Under Review: 1. Marketplace  |  2. Events');
  console.log('================================================================\n');

  const ts = Date.now();

  // -------------------------------------------------------------
  // SETUP TEST USERS
  // -------------------------------------------------------------
  console.log('--- 1. SETTING UP TEST USERS ---');
  // Student A
  const resUserA = await request('POST', '/api/auth/register', {
    name: 'Student Alice',
    email: `alice_${ts}@campus.edu`,
    password: 'Password123!',
    role: 'student',
  });
  assert(resUserA.status === 201 && resUserA.body.token, 'Register Student Alice (User A)');
  const tokenA = resUserA.body.token;
  const idA = resUserA.body.user.id || resUserA.body.user._id;

  // Student B
  const resUserB = await request('POST', '/api/auth/register', {
    name: 'Student Bob',
    email: `bob_${ts}@campus.edu`,
    password: 'Password123!',
    role: 'student',
  });
  assert(resUserB.status === 201 && resUserB.body.token, 'Register Student Bob (User B)');
  const tokenB = resUserB.body.token;
  const idB = resUserB.body.user.id || resUserB.body.user._id;

  // Organizer A
  const resOrgA = await request('POST', '/api/auth/register', {
    name: 'Organizer Sarah',
    email: `sarah_org_${ts}@campus.edu`,
    password: 'Password123!',
    role: 'organizer',
  });
  assert(resOrgA.status === 201 && resOrgA.body.token, 'Register Organizer Sarah (Org A)');
  const tokenOrgA = resOrgA.body.token;
  const idOrgA = resOrgA.body.user.id || resOrgA.body.user._id;

  // Organizer B
  const resOrgB = await request('POST', '/api/auth/register', {
    name: 'Organizer Dave',
    email: `dave_org_${ts}@campus.edu`,
    password: 'Password123!',
    role: 'organizer',
  });
  assert(resOrgB.status === 201 && resOrgB.body.token, 'Register Organizer Dave (Org B)');
  const tokenOrgB = resOrgB.body.token;
  const idOrgB = resOrgB.body.user.id || resOrgB.body.user._id;

  console.log();

  // -------------------------------------------------------------
  // MARKETPLACE END-TO-END & DATA INTEGRITY
  // -------------------------------------------------------------
  console.log('--- 2. MARKETPLACE END-TO-END ---');
  // Create Product as Alice (User A)
  const createProdRes = await request(
    'POST',
    '/api/products',
    {
      title: 'iPad Pro 11-inch M2 256GB Space Gray',
      description: 'Barely used iPad with Apple Pencil and Smart Folio case included.',
      category: 'Electronics',
      price: 650,
      condition: 'Like New',
      location: 'Science Library Courtyard',
      images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0'],
    },
    tokenA
  );
  assert(createProdRes.status === 201 && createProdRes.body.success, 'Alice creates product listing');
  const prodA = createProdRes.body.data;
  const prodAId = prodA.id || prodA._id;

  // Verify Product Relationships & Ownership
  assert(prodA.seller && (prodA.seller.id === idA || prodA.seller._id === idA), 'Product relationship: seller correctly assigned to User A');
  assert(prodA.seller.email === `alice_${ts}@campus.edu`, 'Product relationship: seller populated with email');
  assert(prodA.seller.password === undefined, 'Product relationship: seller password not exposed');
  assert(prodA.status === 'ACTIVE', 'New product default status is ACTIVE');

  // Bob creates a product
  const createProdBRes = await request(
    'POST',
    '/api/products',
    {
      title: 'Microeconomics Theory & Applications 12th Ed',
      description: 'Used for ECON 101, very clean with no highlights.',
      category: 'Textbooks',
      price: 45,
      condition: 'Good',
      location: 'Business School Atrium',
      images: [],
    },
    tokenB
  );
  assert(createProdBRes.status === 201, 'Bob creates product listing');
  const prodBId = createProdBRes.body.data.id || createProdBRes.body.data._id;

  // Search & Filter
  const searchRes = await request('GET', '/api/products?search=iPad');
  assert(searchRes.status === 200 && searchRes.body.data.some((p) => p.id === prodAId), 'Marketplace search by keyword returns matching item');

  const filterRes = await request('GET', '/api/products?category=Textbooks');
  assert(filterRes.status === 200 && filterRes.body.data.every((p) => p.category === 'Textbooks'), 'Marketplace filter by category returns only category items');

  const sortRes = await request('GET', '/api/products?sort=price_asc');
  assert(sortRes.status === 200, 'Marketplace sort by price_asc succeeds');

  // Product Details
  const detailRes = await request('GET', `/api/products/${prodAId}`);
  assert(detailRes.status === 200 && detailRes.body.data.id === prodAId, 'Get single product detail by ID');

  // Wishlist Flow
  const addWishRes = await request('POST', `/api/wishlist/${prodAId}`, {}, tokenB);
  assert(addWishRes.status === 200 && addWishRes.body.success, 'Bob adds Alice product to wishlist');

  const getWishRes = await request('GET', '/api/wishlist', null, tokenB);
  assert(getWishRes.status === 200 && getWishRes.body.data.some((p) => p.id === prodAId), 'Bob retrieves wishlist containing Alice product');

  const delWishRes = await request('DELETE', `/api/wishlist/${prodAId}`, null, tokenB);
  assert(delWishRes.status === 200 && !delWishRes.body.data.some((p) => p.id === prodAId), 'Bob removes product from wishlist');

  // Alice checks My Listings
  const myListingsA = await request('GET', '/api/products/my-listings', null, tokenA);
  assert(myListingsA.status === 200 && myListingsA.body.data.some((p) => p.id === prodAId), 'Alice sees own product in My Listings');
  assert(!myListingsA.body.data.some((p) => p.id === prodBId), 'Alice does NOT see Bob product in My Listings');

  // Alice updates product
  const updateProdRes = await request(
    'PUT',
    `/api/products/${prodAId}`,
    {
      price: 620,
      description: 'Price reduced! Includes Apple Pencil and Smart Folio.',
    },
    tokenA
  );
  assert(updateProdRes.status === 200 && updateProdRes.body.data.price === 620, 'Alice updates product price to $620');

  // Alice marks product as SOLD
  const statusRes = await request('PATCH', `/api/products/${prodAId}/status`, { status: 'SOLD' }, tokenA);
  assert(statusRes.status === 200 && statusRes.body.data.status === 'SOLD', 'Alice updates product status to SOLD');

  // Alice deletes product
  const delProdRes = await request('DELETE', `/api/products/${prodAId}`, null, tokenA);
  assert(delProdRes.status === 200 && delProdRes.body.success, 'Alice deletes own product');

  const getDeletedProd = await request('GET', `/api/products/${prodAId}`);
  assert(getDeletedProd.status === 404, 'Deleted product is no longer found (HTTP 404)');

  console.log();

  // -------------------------------------------------------------
  // EVENTS END-TO-END & DATA INTEGRITY
  // -------------------------------------------------------------
  console.log('--- 3. EVENTS END-TO-END ---');
  // Organizer Sarah creates Event
  const createEventRes = await request(
    'POST',
    '/api/events',
    {
      title: 'Full-Stack Web3 & Cloud Workshop',
      description: 'Hands-on lab deploying decentralized apps to containerized infrastructure.',
      category: 'Tech & Hackathons',
      location: 'Computer Science Lab 302',
      date: '2026-11-15',
      startTime: '13:00',
      endTime: '16:00',
      maximumParticipants: 2, // Low capacity to test limits
    },
    tokenOrgA
  );
  assert(createEventRes.status === 201 && createEventRes.body.success, 'Organizer Sarah creates Event (Capacity: 2)');
  const event1 = createEventRes.body.data;
  const event1Id = event1.id || event1._id;

  // Event Relationships & Ownership
  assert(event1.organizer && (event1.organizer.id === idOrgA || event1.organizer._id === idOrgA), 'Event relationship: organizer correctly assigned to Sarah');
  assert(event1.currentParticipants === 0, 'Event initial currentParticipants is 0');
  assert(event1.status === 'ACTIVE', 'Event initial status is ACTIVE');

  // Search & Filter Events
  const searchEvRes = await request('GET', '/api/events?search=Web3');
  assert(searchEvRes.status === 200 && searchEvRes.body.data.some((e) => e.id === event1Id), 'Events search by keyword matches event');

  const filterEvRes = await request('GET', '/api/events?category=Tech%20%26%20Hackathons');
  assert(filterEvRes.status === 200 && filterEvRes.body.data.some((e) => e.id === event1Id), 'Events filter by category matches event');

  // Event Details (with registration status)
  const eventDetailAlice = await request('GET', `/api/events/${event1Id}`, null, tokenA);
  assert(eventDetailAlice.status === 200 && eventDetailAlice.body.data.isRegistered === false, 'Event details: Alice is not yet registered');

  // Registration Flow: Alice registers
  const regAliceRes = await request('POST', `/api/events/${event1Id}/register`, {}, tokenA);
  assert(regAliceRes.status === 201 && regAliceRes.body.success, 'Alice successfully registers for Event');
  assert(regAliceRes.body.currentParticipants === 1, 'Event participant count updated to 1');
  assert(regAliceRes.body.remainingSpots === 1, 'Event remaining spots is 1');

  // Registration Flow: Bob registers (reaches capacity 2 / 2)
  const regBobRes = await request('POST', `/api/events/${event1Id}/register`, {}, tokenB);
  assert(regBobRes.status === 201 && regBobRes.body.currentParticipants === 2, 'Bob registers for Event (now 2/2 full)');

  // Duplicate Registration Prevention
  const dupRegRes = await request('POST', `/api/events/${event1Id}/register`, {}, tokenA);
  assert(dupRegRes.status === 400, 'Duplicate registration prevented (HTTP 400)');

  // Capacity Limit Check (Student C attempts to register when full)
  const resUserC = await request('POST', '/api/auth/register', {
    name: 'Student Charlie',
    email: `charlie_${ts}@campus.edu`,
    password: 'Password123!',
    role: 'student',
  });
  const tokenC = resUserC.body.token;
  const capExceedRes = await request('POST', `/api/events/${event1Id}/register`, {}, tokenC);
  assert(capExceedRes.status === 400 && capExceedRes.body.message.includes('maximum participant capacity'), 'Capacity limit enforced: rejecting 3rd participant on 2-person event (HTTP 400)');

  // View Registrations (Owner Organizer Sarah)
  const viewRegsRes = await request('GET', `/api/events/${event1Id}/registrations`, null, tokenOrgA);
  assert(viewRegsRes.status === 200 && viewRegsRes.body.count === 2, 'Sarah views registrations list (count: 2)');
  assert(viewRegsRes.body.data.every((r) => r.user && r.user.password === undefined), 'Attendee registration safe handling: password stripped');

  // Cancel Registration (Alice cancels)
  const cancelAliceRes = await request('DELETE', `/api/events/${event1Id}/register`, null, tokenA);
  assert(cancelAliceRes.status === 200 && cancelAliceRes.body.success, 'Alice cancels her registration');
  assert(cancelAliceRes.body.currentParticipants === 1, 'Event participant count drops back to 1');

  // Edit Event (Sarah edits time)
  const editEvRes = await request('PUT', `/api/events/${event1Id}`, { startTime: '13:30' }, tokenOrgA);
  assert(editEvRes.status === 200 && editEvRes.body.data.startTime === '13:30', 'Sarah updates event start time');

  // Organizer My Events
  const myEventsRes = await request('GET', '/api/events/my-events', null, tokenOrgA);
  assert(myEventsRes.status === 200 && myEventsRes.body.data.some((e) => e.id === event1Id), 'Sarah finds event in My Events');

  // Status toggle to CANCELLED
  const cancelEvStatusRes = await request('PUT', `/api/events/${event1Id}`, { status: 'CANCELLED' }, tokenOrgA);
  assert(cancelEvStatusRes.status === 200 && cancelEvStatusRes.body.data.status === 'CANCELLED', 'Sarah cancels event (status: CANCELLED)');

  // Cannot register for CANCELLED event
  const regCancelledRes = await request('POST', `/api/events/${event1Id}/register`, {}, tokenC);
  assert(regCancelledRes.status === 400, 'Registration blocked on CANCELLED event (HTTP 400)');

  // Delete Event
  const delEvRes = await request('DELETE', `/api/events/${event1Id}`, null, tokenOrgA);
  assert(delEvRes.status === 200 && delEvRes.body.success, 'Sarah deletes event and clears registrations');

  const getDeletedEv = await request('GET', `/api/events/${event1Id}`);
  assert(getDeletedEv.status === 404, 'Deleted event returns HTTP 404');

  console.log();

  // -------------------------------------------------------------
  // CROSS-USER SECURITY CHECKS
  // -------------------------------------------------------------
  console.log('--- 4. CROSS-USER SECURITY TESTS ---');
  // Setup: Alice creates product X, Sarah creates event Y
  const prodXRes = await request(
    'POST',
    '/api/products',
    {
      title: 'Calculus Early Transcendentals Book',
      description: 'Stewart 8th Edition in great shape.',
      category: 'Textbooks',
      price: 35,
      condition: 'Good',
      location: 'Library',
      images: [],
    },
    tokenA
  );
  const prodXId = prodXRes.body.data.id;

  const eventYRes = await request(
    'POST',
    '/api/events',
    {
      title: 'Campus Photography Walk',
      description: 'Golden hour photo walk around the architectural landmarks.',
      category: 'Arts & Performance',
      location: 'Clocktower Plaza',
      date: '2026-11-20',
      startTime: '16:00',
      endTime: '18:00',
      maximumParticipants: 30,
    },
    tokenOrgA
  );
  const eventYId = eventYRes.body.data.id;

  // 1. User B (Bob) cannot edit User A's (Alice's) product
  const bobEditProd = await request('PUT', `/api/products/${prodXId}`, { price: 1 }, tokenB);
  assert(bobEditProd.status === 403, 'Security: User B cannot edit User A product (HTTP 403)');

  // 2. User B cannot delete User A's product
  const bobDelProd = await request('DELETE', `/api/products/${prodXId}`, null, tokenB);
  assert(bobDelProd.status === 403, 'Security: User B cannot delete User A product (HTTP 403)');

  // 3. User B cannot change User A's product status
  const bobStatusProd = await request('PATCH', `/api/products/${prodXId}/status`, { status: 'SOLD' }, tokenB);
  assert(bobStatusProd.status === 403, 'Security: User B cannot change User A product status (HTTP 403)');

  // 4. Organizer B (Dave) cannot edit Organizer A's (Sarah's) event
  const daveEditEv = await request('PUT', `/api/events/${eventYId}`, { title: 'Hijacked Event' }, tokenOrgB);
  assert(daveEditEv.status === 403, 'Security: Organizer B cannot edit Organizer A event (HTTP 403)');

  // 5. Organizer B cannot delete Organizer A's event
  const daveDelEv = await request('DELETE', `/api/events/${eventYId}`, null, tokenOrgB);
  assert(daveDelEv.status === 403, 'Security: Organizer B cannot delete Organizer A event (HTTP 403)');

  // 6. Organizer B cannot view Organizer A's event registrations
  const daveRegsEv = await request('GET', `/api/events/${eventYId}/registrations`, null, tokenOrgB);
  assert(daveRegsEv.status === 403, 'Security: Organizer B cannot view Organizer A event registrations (HTTP 403)');

  // 7. Student cannot view Organizer A's event registrations
  const aliceRegsEv = await request('GET', `/api/events/${eventYId}/registrations`, null, tokenA);
  assert(aliceRegsEv.status === 403, 'Security: Student cannot view event registrations (HTTP 403)');

  // 8. Unauthorized user (no token) cannot use protected APIs
  const noAuthCreateProd = await request('POST', '/api/products', { title: 'Anon Item' });
  assert(noAuthCreateProd.status === 401, 'Security: Anonymous user cannot create product (HTTP 401)');

  const noAuthMyListings = await request('GET', '/api/products/my-listings');
  assert(noAuthMyListings.status === 401, 'Security: Anonymous user cannot view my-listings (HTTP 401)');

  const noAuthCreateEv = await request('POST', '/api/events', { title: 'Anon Event' });
  assert(noAuthCreateEv.status === 401, 'Security: Anonymous user cannot create event (HTTP 401)');

  const noAuthMyEvents = await request('GET', '/api/events/my-events');
  assert(noAuthMyEvents.status === 401, 'Security: Anonymous user cannot view my-events (HTTP 401)');

  // 9. Organizer restrictions are enforced server-side
  const studentCreateEv = await request(
    'POST',
    '/api/events',
    {
      title: 'Student Attempted Event',
      description: 'Testing if students can bypass frontend checks.',
      category: 'Social & Mixer',
      location: 'Student Union',
      date: '2026-11-22',
      startTime: '18:00',
      endTime: '20:00',
      maximumParticipants: 50,
    },
    tokenA // Student token
  );
  assert(studentCreateEv.status === 403, 'Security: Student role cannot POST /api/events (HTTP 403)');

  const studentMyEvents = await request('GET', '/api/events/my-events', null, tokenA);
  assert(studentMyEvents.status === 403, 'Security: Student role cannot GET /api/events/my-events (HTTP 403)');

  console.log();

  // -------------------------------------------------------------
  // API VALIDATION, STATUS CODES & ERROR STRUCTURES
  // -------------------------------------------------------------
  console.log('--- 5. API VALIDATION & EDGE CASES ---');
  // Invalid ObjectIds
  const invProdId = await request('GET', '/api/products/invalid-id-format');
  assert(invProdId.status === 400 && invProdId.body.success === false, 'Invalid product ID format returns HTTP 400');

  const invEvId = await request('GET', '/api/events/invalid-id-format');
  assert(invEvId.status === 400 && invEvId.body.success === false, 'Invalid event ID format returns HTTP 400');

  const invWishId = await request('POST', '/api/wishlist/invalid-id-format', {}, tokenA);
  assert(invWishId.status === 400 && invWishId.body.success === false, 'Invalid wishlist product ID format returns HTTP 400');

  // Missing Required Fields on Product Creation
  const missProdFields = await request('POST', '/api/products', {}, tokenA);
  assert(missProdFields.status === 400 && missProdFields.body.errors, 'Missing required fields on product create returns HTTP 400 with errors object');
  assert(missProdFields.body.errors.title, 'Error object includes title error');
  assert(missProdFields.body.errors.price, 'Error object includes price error');

  // Missing Required Fields on Event Creation
  const missEvFields = await request('POST', '/api/events', {}, tokenOrgA);
  assert(missEvFields.status === 400 && missEvFields.body.errors, 'Missing required fields on event create returns HTTP 400 with errors object');
  assert(missEvFields.body.errors.title, 'Error object includes title error');
  assert(missEvFields.body.errors.date, 'Error object includes date error');
  assert(missEvFields.body.errors.startTime, 'Error object includes startTime error');

  // Chronological time validation: End time before start time
  const chronoErr = await request(
    'POST',
    '/api/events',
    {
      title: 'Time Travel Event',
      description: 'Start time is after end time test.',
      category: 'Academic',
      location: 'Science Hall',
      date: '2026-11-25',
      startTime: '16:00',
      endTime: '14:00',
      maximumParticipants: 20,
    },
    tokenOrgA
  );
  assert(chronoErr.status === 400 && chronoErr.body.errors.endTime, 'Chronological validation: End time before start time returns HTTP 400');

  // Invalid status transition input
  const invStatusRes = await request('PATCH', `/api/products/${prodXId}/status`, { status: 'FLYING' }, tokenA);
  assert(invStatusRes.status === 400, 'Invalid product status input rejected with HTTP 400');

  // Clean up remaining test product & event
  await request('DELETE', `/api/products/${prodXId}`, null, tokenA);
  await request('DELETE', `/api/events/${eventYId}`, null, tokenOrgA);

  console.log('\n================================================================');
  console.log(`REVIEW COMPLETE: ${testCount} Tests Executed`);
  console.log(`  Passed: ${passCount}`);
  console.log(`  Failed: ${failCount}`);
  if (failures.length > 0) {
    console.log('\nFailures:');
    failures.forEach((f) => console.log('  ' + f));
  } else {
    console.log('  🎉 All integration and security tests PASSED with 0 errors!');
  }
  console.log('================================================================\n');

  if (failCount > 0) process.exit(1);
}

runReview().catch((err) => {
  console.error('Fatal review execution error:', err);
  process.exit(1);
});
