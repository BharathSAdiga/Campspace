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

async function testRules() {
  console.log('--- TESTING BACKEND BUSINESS RULES ---');

  // Register two fresh test students
  const st1 = await request('POST', '/api/auth/register', {
    name: 'Rule Tester One',
    email: `ruletester1_${Date.now()}@campus.edu`,
    password: 'password123',
    role: 'student',
  });
  const token1 = st1.body.token;

  const st2 = await request('POST', '/api/auth/register', {
    name: 'Rule Tester Two',
    email: `ruletester2_${Date.now()}@campus.edu`,
    password: 'password123',
    role: 'student',
  });
  const token2 = st2.body.token;

  // Get active events
  const eventsRes = await request('GET', '/api/events');
  const events = eventsRes.body.data;
  const openEvent = events.find((e) => e.title.includes('Sunset Acoustic Jam'));
  const fullEvent = events.find((e) => e.title.includes('(Full Event)'));

  console.log('Using open event:', openEvent.id, openEvent.title);
  console.log('Using full event:', fullEvent.id, fullEvent.title);

  // Rule 4 & Normal Flow: Student 1 registers for openEvent
  const reg1 = await request('POST', `/api/events/${openEvent.id}/register`, {}, token1);
  console.log('Rule 4 (Student registers):', reg1.status, reg1.body.message);
  if (reg1.status !== 201 && reg1.status !== 200) throw new Error('Failed to register');

  // Rule 1: Duplicate registration test (Student 1 registers again for openEvent)
  const dup = await request('POST', `/api/events/${openEvent.id}/register`, {}, token1);
  console.log('Rule 1 (Duplicate registration check):', dup.status, dup.body.message);
  if (dup.status !== 400 || !dup.body.message.includes('already registered')) {
    throw new Error('Duplicate registration rule failed!');
  }

  // Rule 2: Cannot register when full
  const fullReg = await request('POST', `/api/events/${fullEvent.id}/register`, {}, token1);
  console.log('Rule 2 (Full event registration check):', fullReg.status, fullReg.body.message);
  if (fullReg.status !== 400 || !fullReg.body.message.includes('maximum participant capacity')) {
    throw new Error('Full event capacity rule failed!');
  }

  // Rule 3: Cannot register for cancelled event
  const cancelledRes = await request('GET', '/api/events?status=CANCELLED');
  const cancelledEvent = cancelledRes.body.data[0];
  const cancelReg = await request('POST', `/api/events/${cancelledEvent.id}/register`, {}, token1);
  console.log('Rule 3 (Cancelled event registration check):', cancelReg.status, cancelReg.body.message);
  if (cancelReg.status !== 400 || !cancelReg.body.message.includes('CANCELLED')) {
    throw new Error('Cancelled event rule failed!');
  }

  // Rule 5: User can cancel only their own registration (Student 2 tries to cancel Student 1's registration)
  const falseCancel = await request('DELETE', `/api/events/${openEvent.id}/register`, {}, token2);
  console.log('Rule 5 (Cannot cancel others registration):', falseCancel.status, falseCancel.body.message);
  if (falseCancel.status !== 400 || !falseCancel.body.message.includes('do not have an active registration')) {
    throw new Error('Rule 5 failed: Student 2 could cancel or got wrong error!');
  }

  // User 1 successfully cancels own registration
  const validCancel = await request('DELETE', `/api/events/${openEvent.id}/register`, {}, token1);
  console.log('Rule 5 (Valid cancellation of own registration):', validCancel.status, validCancel.body.message);
  if (validCancel.status !== 200) {
    throw new Error('Valid cancellation failed!');
  }

  console.log('\n ALL 5 BACKEND BUSINESS RULES VERIFIED SUCCESSFULLY!\n');
}

testRules().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
