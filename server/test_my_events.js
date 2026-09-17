const http = require('http');

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
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

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${message}`);
    process.exit(1);
  }
  console.log(`✅ Passed: ${message}`);
}

async function run() {
  console.log('--- STARTING MY EVENTS / ORGANIZER MANAGEMENT TESTS ---\n');

  const ts = Date.now();

  // 1. Create Organizer 1
  const org1 = await request('POST', '/api/auth/register', {
    name: 'Organizer Alpha',
    email: `alpha_${ts}@campus.edu`,
    password: 'Password123!',
    role: 'organizer',
  });
  assert(org1.status === 201, 'Organizer 1 registered');
  const org1Token = org1.body.token;

  // 2. Create Organizer 2
  const org2 = await request('POST', '/api/auth/register', {
    name: 'Organizer Beta',
    email: `beta_${ts}@campus.edu`,
    password: 'Password123!',
    role: 'organizer',
  });
  assert(org2.status === 201, 'Organizer 2 registered');
  const org2Token = org2.body.token;

  // 3. Create Student
  const student = await request('POST', '/api/auth/register', {
    name: 'Student Charlie',
    email: `charlie_${ts}@campus.edu`,
    password: 'Password123!',
    role: 'student',
  });
  assert(student.status === 201, 'Student registered');
  const studentToken = student.body.token;

  // 4. Organizer 1 creates Event 1 and Event 2
  const ev1 = await request(
    'POST',
    '/api/events',
    {
      title: 'Robotics Hackathon 2026',
      description: 'Annual campus engineering and robotics hackathon with hardware lab access.',
      category: 'Tech & Hackathons',
      location: 'Engineering Building Room 101',
      date: '2026-10-15',
      startTime: '09:00',
      endTime: '17:00',
      maximumParticipants: 40,
    },
    org1Token
  );
  assert(ev1.status === 201, 'Organizer 1 created Event 1');
  const ev1Id = ev1.body.data.id || ev1.body.data._id;

  const ev2 = await request(
    'POST',
    '/api/events',
    {
      title: 'AI in Medicine Seminar',
      description: 'Special guest lecture from leading biomedical researchers.',
      category: 'Workshop & Seminar',
      location: 'Science Hall Amphitheater',
      date: '2026-10-20',
      startTime: '14:00',
      endTime: '16:00',
      maximumParticipants: 100,
    },
    org1Token
  );
  assert(ev2.status === 201, 'Organizer 1 created Event 2');
  const ev2Id = ev2.body.data.id || ev2.body.data._id;

  // 5. Organizer 2 creates Event 3
  const ev3 = await request(
    'POST',
    '/api/events',
    {
      title: 'Design Systems Workshop',
      description: 'Figma to React workflow for campus club designers.',
      category: 'Arts & Performance',
      location: 'Art & Media Center Lab 3',
      date: '2026-10-25',
      startTime: '10:00',
      endTime: '12:30',
      maximumParticipants: 25,
    },
    org2Token
  );
  assert(ev3.status === 201, 'Organizer 2 created Event 3');
  const ev3Id = ev3.body.data.id || ev3.body.data._id;

  // 6. Student registers for Event 1
  const reg1 = await request('POST', `/api/events/${ev1Id}/register`, {}, studentToken);
  assert(reg1.status === 201 && reg1.body.success, 'Student successfully registered for Event 1');

  // 7. Security Check: Student CANNOT call GET /api/events/my-events (403 Forbidden)
  const studentMyEvents = await request('GET', '/api/events/my-events', null, studentToken);
  assert(studentMyEvents.status === 403, 'Security: Student is forbidden from calling /api/events/my-events');

  // 8. Organizer 1 calls GET /api/events/my-events -> gets only Event 1 and Event 2
  const org1MyEvents = await request('GET', '/api/events/my-events', null, org1Token);
  assert(org1MyEvents.status === 200, 'Organizer 1 fetched own events');
  assert(org1MyEvents.body.count === 2, `Organizer 1 has exactly 2 events (got ${org1MyEvents.body.count})`);
  const ev1InList = org1MyEvents.body.data.find((e) => e.id === ev1Id);
  assert(ev1InList && ev1InList.currentParticipants === 1, 'Event 1 has currentParticipants: 1');
  assert(ev1InList && ev1InList.remainingSpots === 39, 'Event 1 has remainingSpots: 39');

  // 9. Organizer 2 calls GET /api/events/my-events -> gets only Event 3
  const org2MyEvents = await request('GET', '/api/events/my-events', null, org2Token);
  assert(org2MyEvents.status === 200 && org2MyEvents.body.count === 1, 'Organizer 2 sees only their 1 event');
  assert(org2MyEvents.body.data[0].id === ev3Id, 'Organizer 2 event is Event 3');

  // 10. Security: Organizer 2 cannot view registrations for Organizer 1 event (403 Forbidden)
  const rivalRegs = await request('GET', `/api/events/${ev1Id}/registrations`, null, org2Token);
  assert(rivalRegs.status === 403, 'Security: Rival organizer forbidden from viewing registrations');

  // 11. Security: Student cannot view registrations for Event 1 (403 Forbidden)
  const studentRegs = await request('GET', `/api/events/${ev1Id}/registrations`, null, studentToken);
  assert(studentRegs.status === 403, 'Security: Student forbidden from viewing registrations');

  // 12. Owner Organizer 1 views registrations for Event 1
  const ownerRegs = await request('GET', `/api/events/${ev1Id}/registrations`, null, org1Token);
  assert(ownerRegs.status === 200, 'Organizer 1 successfully retrieved registrations list');
  assert(ownerRegs.body.count === 1, 'Registrations list has 1 registered student');
  const attendee = ownerRegs.body.data[0];
  assert(attendee.user && attendee.user.name === 'Student Charlie', 'Attendee name is Student Charlie');
  assert(attendee.user.email === `charlie_${ts}@campus.edu`, 'Attendee email is correct');
  assert(attendee.user.password === undefined, 'Security: Attendee password is not exposed');

  // 13. Security: Rival Organizer 2 cannot delete Event 1 (403 Forbidden)
  const rivalDel = await request('DELETE', `/api/events/${ev1Id}`, null, org2Token);
  assert(rivalDel.status === 403, 'Security: Rival organizer forbidden from deleting Event 1');

  // 14. Owner Organizer 1 deletes Event 2
  const ownerDel = await request('DELETE', `/api/events/${ev2Id}`, null, org1Token);
  assert(ownerDel.status === 200 && ownerDel.body.success, 'Organizer 1 successfully deleted Event 2');

  // 15. Verify Organizer 1 now has only 1 event
  const org1FinalEvents = await request('GET', '/api/events/my-events', null, org1Token);
  assert(org1FinalEvents.body.count === 1, 'Organizer 1 now has 1 event remaining');

  console.log('\n🎉 ALL BACKEND MY EVENTS & SECURITY TESTS PASSED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
