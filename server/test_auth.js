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
  console.log('--- Starting Comprehensive Authentication & Authorization Test Suite ---');
  let passed = 0;
  let failed = 0;

  const assert = (condition, title) => {
    if (condition) {
      console.log(`PASS: ${title}`);
      passed++;
    } else {
      console.error(`FAIL: ${title}`);
      failed++;
    }
  };

  try {
    const randomSuffix = Math.floor(Math.random() * 100000);
    const studentEmail = `student_${randomSuffix}@campus.edu`;
    const organizerEmail = `organizer_${randomSuffix}@campus.edu`;

    // 1. Validation failure on registration
    const res1 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      { email: 'bad_email', password: '123' }
    );
    assert(res1.status === 400, 'Register returns 400 for invalid inputs');

    // 2. Valid Student Registration
    const res2 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Alex Student',
        email: studentEmail,
        password: 'password123',
        role: 'student',
      }
    );
    assert(res2.status === 201 && res2.body.token && res2.body.user.role === 'student', 'Student register returns 201 and student role');
    assert(res2.body.user.password === undefined, 'Password hash is omitted in user response');
    const studentToken = res2.body.token;

    // 3. Duplicate Email Prevention
    const res3 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Duplicate Alex',
        email: studentEmail,
        password: 'password123',
      }
    );
    assert(res3.status === 409, 'Duplicate email registration returns 409 Conflict');

    // 4. Invalid Login Credentials
    const res4 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: studentEmail,
        password: 'wrong_password_999',
      }
    );
    assert(res4.status === 401, 'Login with incorrect password returns 401 Unauthorized');

    // 5. Valid Student Login
    const res5 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        email: studentEmail,
        password: 'password123',
      }
    );
    assert(res5.status === 200 && res5.body.token, 'Login with valid credentials returns 200 OK and JWT token');

    // 6. GET /api/auth/me without token
    const res6 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET',
    });
    assert(res6.status === 401, 'GET /api/auth/me without token returns 401');

    // 7. GET /api/auth/me with valid Bearer token
    const res7 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${studentToken}`,
      },
    });
    assert(res7.status === 200 && res7.body.user.email === studentEmail, 'GET /api/auth/me returns 200 and authenticated profile');

    // 8. Role Authorization: Student accessing Organizer route -> 403 Forbidden
    const res8 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/role-check/organizer-or-admin',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${studentToken}`,
      },
    });
    assert(res8.status === 403, 'Student accessing organizer-only endpoint receives 403 Forbidden');

    // 9. Valid Organizer Registration & Authorized Access
    const res9 = await request(
      {
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/register',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      },
      {
        name: 'Jordan Organizer',
        email: organizerEmail,
        password: 'password123',
        role: 'organizer',
      }
    );
    assert(res9.status === 201 && res9.body.user.role === 'organizer', 'Organizer register returns 201 and organizer role');
    const organizerToken = res9.body.token;

    // 10. Role Authorization: Organizer accessing Organizer route -> 200 OK
    const res10 = await request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/role-check/organizer-or-admin',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${organizerToken}`,
      },
    });
    assert(res10.status === 200 && res10.body.success === true, 'Organizer successfully accesses role-restricted endpoint (200 OK)');

    console.log(`\nResults: ${passed} passed, ${failed} failed`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
