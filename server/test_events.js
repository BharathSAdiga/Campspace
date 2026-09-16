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

async function runEventTests() {
  console.log('====================================================');
  console.log('  Events Module Backend Foundation Verification Suite');
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
    const student1Email = `student1_${ts}@campus.edu`;
    const student2Email = `student2_${ts}@campus.edu`;
    const organizer1Email = `organizer1_${ts}@campus.edu`;
    const organizer2Email = `organizer2_${ts}@campus.edu`;
    const password = 'Password123!';

    // 1. Setup Users
    console.log('\n--- Step 1: User Registration & Authentication ---');
    // Register Student 1
    const regS1 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'Student One', email: student1Email, password, role: 'student' }
    );
    assert(regS1.status === 201 && regS1.body.token, 'Register Student 1');
    const tokenS1 = regS1.body.token;

    // Register Student 2
    const regS2 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'Student Two', email: student2Email, password, role: 'student' }
    );
    assert(regS2.status === 201 && regS2.body.token, 'Register Student 2');
    const tokenS2 = regS2.body.token;

    // Register Organizer 1
    const regO1 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'Club President Alice', email: organizer1Email, password, role: 'organizer' }
    );
    assert(regO1.status === 201 && regO1.body.token, 'Register Organizer 1');
    const tokenO1 = regO1.body.token;

    // Register Organizer 2
    const regO2 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { name: 'Workshop Host Bob', email: organizer2Email, password, role: 'organizer' }
    );
    assert(regO2.status === 201 && regO2.body.token, 'Register Organizer 2');
    const tokenO2 = regO2.body.token;

    // 2. Role Authorization for Event Creation
    console.log('\n--- Step 2: Role Authorization Checks ---');
    const studentCreateAttempt = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/events',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenS1}`,
        },
      },
      {
        title: 'Unauthorized Student Hackathon',
        description: 'Trying to create an event without organizer permissions.',
        category: 'Tech & Hackathons',
        location: 'Student Center',
        date: '2026-10-15',
        startTime: '10:00 AM',
        endTime: '5:00 PM',
        maximumParticipants: 50,
      }
    );
    assert(
      studentCreateAttempt.status === 403,
      'Student role cannot create events (403 Forbidden)'
    );

    // Organizer creates a valid event
    const event1Payload = {
      title: 'Annual Campus Hackathon 2026',
      description: 'Join over 100 students for 24 hours of coding, mentorship, and building awesome projects.',
      category: 'Tech & Hackathons',
      location: 'Computer Science Building - Atrium',
      date: '2026-10-25',
      startTime: '09:00 AM',
      endTime: '09:00 PM',
      maximumParticipants: 100,
      banner: 'https://images.unsplash.com/photo-hackathon',
    };

    const organizerCreateRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/events',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenO1}`,
        },
      },
      event1Payload
    );
    assert(
      organizerCreateRes.status === 201 && organizerCreateRes.body.data.id,
      'Authorized Organizer creates event successfully (201 Created)'
    );
    const event1Id = organizerCreateRes.body.data.id;
    assert(
      organizerCreateRes.body.data.organizer &&
        organizerCreateRes.body.data.organizer.email === organizer1Email,
      'Organizer field is automatically bound to authenticated user'
    );

    // 3. Validation Rules
    console.log('\n--- Step 3: Payload & ID Validation ---');
    const missingFieldsRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/events',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenO1}`,
        },
      },
      { title: 'Incomplete Event' }
    );
    assert(
      missingFieldsRes.status === 400 && missingFieldsRes.body.errors,
      'Missing required fields returns 400 Bad Request with field errors'
    );

    const invalidDateRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/events',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenO1}`,
        },
      },
      { ...event1Payload, date: 'not-a-valid-date' }
    );
    assert(invalidDateRes.status === 400, 'Invalid date format returns 400 Bad Request');

    const invalidCapacityRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/events',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenO1}`,
        },
      },
      { ...event1Payload, maximumParticipants: -5 }
    );
    assert(invalidCapacityRes.status === 400, 'Negative maximumParticipants returns 400 Bad Request');

    const invalidIdRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/events/invalid-object-id',
      method: 'GET',
    });
    assert(invalidIdRes.status === 400, 'Invalid event ID format returns 400 Bad Request');

    const nonExistentRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/events/507f1f77bcf86cd799439011',
      method: 'GET',
    });
    assert(nonExistentRes.status === 404, 'Non-existent event ID returns 404 Not Found');

    // 4. Discovery & Filtering
    console.log('\n--- Step 4: GET Events Query & Filters ---');
    const getAllRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/events',
      method: 'GET',
    });
    assert(
      getAllRes.status === 200 && getAllRes.body.data.length >= 1,
      'GET /api/events returns event list with pagination'
    );

    const getFilterRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/events?category=Tech%20%26%20Hackathons',
      method: 'GET',
    });
    assert(
      getFilterRes.status === 200 &&
        getFilterRes.body.data.every((e) => e.category === 'Tech & Hackathons'),
      'GET /api/events filters accurately by category'
    );

    // 5. Ownership Enforcement (PUT / DELETE)
    console.log('\n--- Step 5: Ownership Enforcement for Edits & Deletes ---');
    const unauthorizedEditRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/events/${event1Id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenO2}`, // Bob is not the owner
        },
      },
      { title: 'Hacked Title By Bob' }
    );
    assert(
      unauthorizedEditRes.status === 403,
      'Non-owner organizer cannot edit event (403 Forbidden)'
    );

    const authorizedEditRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/events/${event1Id}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenO1}`, // Alice is the owner
        },
      },
      { title: 'Annual Campus Hackathon 2026 - Extended' }
    );
    assert(
      authorizedEditRes.status === 200 &&
        authorizedEditRes.body.data.title === 'Annual Campus Hackathon 2026 - Extended',
      'Event owner can update event details (200 OK)'
    );

    // 6. Registration Flow & Duplicate Prevention
    console.log('\n--- Step 6: Registration Flow & Duplicate Prevention ---');
    const regRes1 = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${event1Id}/register`,
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenS1}` },
    });
    assert(
      regRes1.status === 201 && regRes1.body.currentParticipants === 1,
      'Student registers for event successfully (201 Created)'
    );

    // Duplicate registration attempt
    const dupRegRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${event1Id}/register`,
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenS1}` },
    });
    assert(
      dupRegRes.status === 400 && dupRegRes.body.message.includes('already registered'),
      'Duplicate registration prevented (400 Bad Request)'
    );

    // Verify GET /api/events/:id indicates isRegistered = true for Student 1
    const detailS1Res = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${event1Id}`,
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenS1}` },
    });
    assert(
      detailS1Res.status === 200 && detailS1Res.body.data.isRegistered === true,
      'GET /api/events/:id returns isRegistered = true for registered caller'
    );

    // 7. Capacity Enforcement
    console.log('\n--- Step 7: Capacity Limit Enforcement ---');
    // Create an exclusive workshop with capacity: 1
    const workshopRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/events',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenO1}`,
        },
      },
      {
        title: 'VIP 1-on-1 AI Mentorship Session',
        description: 'Exclusive single-seat session with an industry AI engineer.',
        category: 'Workshop & Seminar',
        location: 'Innovation Lab 101',
        date: '2026-11-01',
        startTime: '02:00 PM',
        endTime: '03:00 PM',
        maximumParticipants: 1, // Only 1 seat
      }
    );
    assert(workshopRes.status === 201, 'Create workshop with capacity of 1');
    const workshopId = workshopRes.body.data.id;

    // Student 1 registers (fills the only seat)
    const seat1Res = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${workshopId}/register`,
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenS1}` },
    });
    assert(
      seat1Res.status === 201 && seat1Res.body.remainingSpots === 0,
      'Student 1 takes the last available seat (capacity reached)'
    );

    // Student 2 attempts to register for full workshop
    const seatOverflowRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${workshopId}/register`,
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenS2}` },
    });
    assert(
      seatOverflowRes.status === 400 &&
        seatOverflowRes.body.message.includes('maximum participant capacity'),
      'Registration beyond maximumParticipants is rejected (400 Bad Request)'
    );

    // 8. Cancellation Flow & Capacity Re-opening
    console.log('\n--- Step 8: Registration Cancellation & Spot Reopening ---');
    // Student 1 cancels their seat
    const cancelRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${workshopId}/register`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenS1}` },
    });
    assert(
      cancelRes.status === 200 && cancelRes.body.remainingSpots === 1,
      'Student 1 cancels registration and frees up a spot (200 OK)'
    );

    // Student 1 cancelling again
    const repeatCancelRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${workshopId}/register`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenS1}` },
    });
    assert(
      repeatCancelRes.status === 400,
      'Cancelling non-existent registration returns 400 Bad Request'
    );

    // Now Student 2 can take the reopened seat!
    const seat2Res = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${workshopId}/register`,
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenS2}` },
    });
    assert(
      seat2Res.status === 201 && seat2Res.body.remainingSpots === 0,
      'Student 2 registers successfully into reopened spot'
    );

    // 9. Cancelled Event Inactive Status Check
    console.log('\n--- Step 9: Inactive & Cancelled Event Status ---');
    // Organizer cancels the event
    const setCancelledRes = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: `/api/events/${workshopId}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenO1}`,
        },
      },
      { status: 'CANCELLED' }
    );
    assert(
      setCancelledRes.status === 200 && setCancelledRes.body.data.status === 'CANCELLED',
      'Event status set to CANCELLED'
    );

    // Student attempts to register for CANCELLED event
    const regCancelledRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${workshopId}/register`,
      method: 'POST',
      headers: { Authorization: `Bearer ${tokenS1}` },
    });
    assert(
      regCancelledRes.status === 400 &&
        regCancelledRes.body.message.includes("Cannot register for an event with status 'CANCELLED'"),
      'Registration rejected for CANCELLED events (400 Bad Request)'
    );

    // 10. Attendee List Security & Safe Fields
    console.log('\n--- Step 10: Attendee List Security & Safe Fields ---');
    // Student attempts to access attendee list
    const studentAttendeeRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${event1Id}/registrations`,
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenS1}` },
    });
    assert(
      studentAttendeeRes.status === 403,
      'Student cannot access registrations list (403 Forbidden)'
    );

    // Non-owner organizer attempts to access attendee list
    const nonOwnerAttendeeRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${event1Id}/registrations`,
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenO2}` },
    });
    assert(
      nonOwnerAttendeeRes.status === 403,
      'Non-owner organizer cannot access registrations list (403 Forbidden)'
    );

    // Event Owner accesses attendee list
    const ownerAttendeeRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${event1Id}/registrations`,
      method: 'GET',
      headers: { Authorization: `Bearer ${tokenO1}` },
    });
    assert(
      ownerAttendeeRes.status === 200 && ownerAttendeeRes.body.count === 1,
      'Event organizer successfully retrieves attendee registrations (200 OK)'
    );
    const firstAttendee = ownerAttendeeRes.body.data[0];
    assert(
      firstAttendee.user &&
        firstAttendee.user.email === student1Email &&
        !firstAttendee.user.password &&
        !firstAttendee.user.__v,
      'Participant details expose safe fields only (no passwords or credentials)'
    );

    // 11. Event Deletion & Registration Cascading
    console.log('\n--- Step 11: Event Deletion & Registration Cascade ---');
    const deleteRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${event1Id}`,
      method: 'DELETE',
      headers: { Authorization: `Bearer ${tokenO1}` },
    });
    assert(deleteRes.status === 200, 'Event owner deletes event successfully (200 OK)');

    const getDeletedRes = await request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/events/${event1Id}`,
      method: 'GET',
    });
    assert(getDeletedRes.status === 404, 'Deleted event is no longer accessible (404 Not Found)');

    // Summary
    console.log('\n====================================================');
    console.log(`Results: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Unexpected error running event test suite:', err);
    process.exit(1);
  }
}

runEventTests();
