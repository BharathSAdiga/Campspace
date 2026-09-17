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

async function runTests() {
  console.log('--- STARTING EVENT CREATION & EDITING TESTS ---\n');

  // 1. Setup Users:
  // Organizer 1 (Owner)
  const org1Res = await request('POST', '/api/auth/register', {
    name: 'Primary Organizer',
    email: `org_primary_${Date.now()}@campus.edu`,
    password: 'password123',
    role: 'organizer',
  });
  const org1Token = org1Res.body.token;
  const org1Id = org1Res.body.user?.id || org1Res.body.user?._id;
  console.log('Registered Organizer 1:', org1Id);

  // Organizer 2 (Attacker / Different Organizer)
  const org2Res = await request('POST', '/api/auth/register', {
    name: 'Rival Organizer',
    email: `org_rival_${Date.now()}@campus.edu`,
    password: 'password123',
    role: 'organizer',
  });
  const org2Token = org2Res.body.token;
  console.log('Registered Organizer 2');

  // Student (Unauthorized to create or edit)
  const studentRes = await request('POST', '/api/auth/register', {
    name: 'Campus Student',
    email: `student_test_${Date.now()}@campus.edu`,
    password: 'password123',
    role: 'student',
  });
  const studentToken = studentRes.body.token;
  console.log('Registered Student User\n');

  // -------------------------------------------------------------
  // TEST: Student cannot create event
  // -------------------------------------------------------------
  const studentCreate = await request(
    'POST',
    '/api/events',
    {
      title: 'Student Unauthorized Event',
      description: 'This event creation should be rejected by the backend authorization layer.',
      category: 'Academic',
      date: new Date(Date.now() + 86400000).toISOString(),
      startTime: '10:00',
      endTime: '12:00',
      location: 'Student Union Room 101',
      maximumParticipants: 25,
    },
    studentToken
  );
  console.log('1. Student cannot create event:', studentCreate.status, studentCreate.body.message);
  if (studentCreate.status !== 403) {
    throw new Error(`Expected 403 for student create, got ${studentCreate.status}`);
  }

  // -------------------------------------------------------------
  // TEST: Validation Failures on Create
  // -------------------------------------------------------------
  // A. Invalid Date
  const invalidDateRes = await request(
    'POST',
    '/api/events',
    {
      title: 'Invalid Date Event',
      description: 'Testing invalid date rejection.',
      category: 'Academic',
      date: 'not-a-real-date',
      startTime: '10:00',
      endTime: '12:00',
      location: 'Hall A',
      maximumParticipants: 50,
    },
    org1Token
  );
  console.log('2. Invalid date check:', invalidDateRes.status, invalidDateRes.body.errors?.date);
  if (invalidDateRes.status !== 400 || !invalidDateRes.body.errors?.date) {
    throw new Error('Failed to reject invalid date');
  }

  // B. Invalid Time: End time before start time
  const invalidTimeRes = await request(
    'POST',
    '/api/events',
    {
      title: 'Invalid Time Chronology Event',
      description: 'Testing end time before start time rejection.',
      category: 'Tech & Hackathons',
      date: new Date(Date.now() + 86400000).toISOString(),
      startTime: '16:00',
      endTime: '14:00', // BEFORE start time!
      location: 'Innovation Lab',
      maximumParticipants: 40,
    },
    org1Token
  );
  console.log('3. Invalid time (end before start) check:', invalidTimeRes.status, invalidTimeRes.body.errors?.endTime);
  if (invalidTimeRes.status !== 400 || !invalidTimeRes.body.errors?.endTime) {
    throw new Error('Failed to reject end time before start time');
  }

  // C. Invalid Participant Limit (0 or negative)
  const invalidLimitRes = await request(
    'POST',
    '/api/events',
    {
      title: 'Zero Capacity Event',
      description: 'Testing zero or negative capacity rejection.',
      category: 'Sports & Recreation',
      date: new Date(Date.now() + 86400000).toISOString(),
      startTime: '09:00',
      endTime: '11:00',
      location: 'Gym',
      maximumParticipants: 0,
    },
    org1Token
  );
  console.log('4. Invalid participant limit check:', invalidLimitRes.status, invalidLimitRes.body.errors?.maximumParticipants);
  if (invalidLimitRes.status !== 400 || !invalidLimitRes.body.errors?.maximumParticipants) {
    throw new Error('Failed to reject non-positive participant limit');
  }

  // -------------------------------------------------------------
  // TEST: Valid Creation & Organizer ID Security
  // -------------------------------------------------------------
  // Attempting to spoof organizer ID in body
  const spoofedOrganizerId = '507f1f77bcf86cd799439011';
  const validCreate = await request(
    'POST',
    '/api/events',
    {
      title: 'AI Agents & Robotics Symposium 2026',
      description: 'Comprehensive demonstration of autonomous agents and humanoid robotics in modern computing.',
      category: 'Tech & Hackathons',
      date: new Date(Date.now() + 86400000 * 7).toISOString(),
      startTime: '13:00',
      endTime: '17:30',
      location: 'Auditorium Magna - Center for Complex Systems',
      maximumParticipants: 120,
      banner: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200',
      organizer: spoofedOrganizerId, // SPOOF ATTEMPT
    },
    org1Token
  );
  console.log('5. Organizer can create event:', validCreate.status, validCreate.body.message);
  if (validCreate.status !== 201 || !validCreate.body.data) {
    throw new Error(`Failed to create event: ${JSON.stringify(validCreate.body)}`);
  }

  const createdEvent = validCreate.body.data;
  const eventId = createdEvent.id || createdEvent._id;
  console.log('   Created Event ID:', eventId);

  // Assert organizer is org1, NOT spoofed ID
  const assignedOrgId = createdEvent.organizer?._id || createdEvent.organizer?.id || createdEvent.organizer;
  if (assignedOrgId.toString() === spoofedOrganizerId) {
    throw new Error('SECURITY VULNERABILITY: Backend trusted spoofed organizer ID from body!');
  }
  console.log('6. Security Check: Organizer ID taken from authenticated session, spoofed body ID ignored. (Passed)');

  // -------------------------------------------------------------
  // TEST: Organizer can edit own event
  // -------------------------------------------------------------
  const editOwn = await request(
    'PUT',
    `/api/events/${eventId}`,
    {
      title: 'AI Agents & Robotics Symposium 2026 (Updated Room)',
      location: 'Auditorium Magna - Hall 4 (Updated Venue)',
      startTime: '13:30',
      endTime: '18:00',
      maximumParticipants: 150,
    },
    org1Token
  );
  console.log('7. Organizer can edit own event:', editOwn.status, editOwn.body.message);
  if (editOwn.status !== 200 || editOwn.body.data.location !== 'Auditorium Magna - Hall 4 (Updated Venue)') {
    throw new Error('Failed to edit own event');
  }

  // -------------------------------------------------------------
  // TEST: Another organizer cannot edit
  // -------------------------------------------------------------
  const editRival = await request(
    'PUT',
    `/api/events/${eventId}`,
    {
      title: 'Hacked by Rival Organizer',
    },
    org2Token
  );
  console.log('8. Rival organizer cannot edit:', editRival.status, editRival.body.message);
  if (editRival.status !== 403) {
    throw new Error(`Expected 403 for rival organizer edit, got ${editRival.status}`);
  }

  // -------------------------------------------------------------
  // TEST: Student cannot edit
  // -------------------------------------------------------------
  const editStudent = await request(
    'PUT',
    `/api/events/${eventId}`,
    {
      title: 'Hacked by Student',
    },
    studentToken
  );
  console.log('9. Student cannot edit:', editStudent.status, editStudent.body.message);
  if (editStudent.status !== 403) {
    throw new Error(`Expected 403 for student edit, got ${editStudent.status}`);
  }

  // -------------------------------------------------------------
  // TEST: Invalid Event ID on Edit
  // -------------------------------------------------------------
  const invalidIdEdit = await request(
    'PUT',
    '/api/events/invalid-event-id-format',
    {
      title: 'Non-existent Event',
    },
    org1Token
  );
  console.log('10. Invalid event ID on edit check:', invalidIdEdit.status, invalidIdEdit.body.message);
  if (invalidIdEdit.status !== 400) {
    throw new Error(`Expected 400 for invalid ID format, got ${invalidIdEdit.status}`);
  }

  // -------------------------------------------------------------
  // TEST: Invalid ID (valid ObjectId format but non-existent in DB)
  // -------------------------------------------------------------
  const nonExistentEdit = await request(
    'PUT',
    '/api/events/6aab765f94e6c22743131999',
    {
      title: 'Non-existent Event',
    },
    org1Token
  );
  console.log('11. Non-existent event ID check:', nonExistentEdit.status, nonExistentEdit.body.message);
  if (nonExistentEdit.status !== 404) {
    throw new Error(`Expected 404 for non-existent event, got ${nonExistentEdit.status}`);
  }

  console.log('\n ALL EVENT CREATION & EDITING TESTS PASSED PERFECTLY!\n');
}

runTests().catch((err) => {
  console.error('\nTEST FAILED:', err);
  process.exit(1);
});
