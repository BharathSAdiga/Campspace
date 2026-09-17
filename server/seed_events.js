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
    req.write(data);
    req.end();
  });
}

function put(path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: 'PUT',
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
    req.write(data);
    req.end();
  });
}

const sampleEvents = [
  {
    title: 'HackCampus 2026: 24-Hour AI & Web3 Hackathon',
    description: 'Join over 200 student developers, designers, and innovators for 24 hours of non-stop building, mentoring, workshops, and tech keynote sessions. Industry mentors from Google, Stripe, and Figma will be onsite to support teams. Catering and hardware kits will be provided.',
    category: 'Tech & Hackathons',
    date: new Date(Date.now() + 86400000 * 5).toISOString(),
    startTime: '09:00',
    endTime: '18:00',
    location: 'Engineering Innovation Hall - Building B',
    maximumParticipants: 150,
    banner: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Fall Career & Internship Fair: Tech & Engineering',
    description: 'Connect directly with hiring managers and talent recruiters from 45+ premier technology, engineering, and consulting firms. Bring printed copies of your resume. Professional or smart casual attire recommended. Student ID required for admission.',
    category: 'Career & Professional',
    date: new Date(Date.now() + 86400000 * 12).toISOString(),
    startTime: '11:00',
    endTime: '16:00',
    location: 'Campus Center Great Ballroom',
    maximumParticipants: 300,
    banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Sunset Acoustic Jam & Open Mic Night',
    description: 'Relax after midterms with live acoustic sets, open-mic performances, hot cider, and craft snacks by the lawn amphitheater. Sign-up sheets for 10-minute student slots open 30 minutes before kick-off. Bring blankets and lawn chairs!',
    category: 'Arts & Performance',
    date: new Date(Date.now() + 86400000 * 3).toISOString(),
    startTime: '18:30',
    endTime: '21:30',
    location: 'South Quad Outdoor Amphitheater',
    maximumParticipants: 80,
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Deep Learning Workshop: PyTorch & Transformers',
    description: 'Hands-on practical seminar walking through fine-tuning open-source LLMs and modern attention mechanisms using PyTorch and HuggingFace. Laptops required with Python 3.10+ installed. Free GPU cloud compute vouchers provided to all registered participants.',
    category: 'Workshop & Seminar',
    date: new Date(Date.now() + 86400000 * 8).toISOString(),
    startTime: '14:00',
    endTime: '17:00',
    location: 'Science Library - Computer Lab 3',
    maximumParticipants: 40,
    banner: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Intramural 3v3 Basketball Tournament',
    description: 'Annual double-elimination 3v3 basketball showdown. Prizes for 1st, 2nd, and 3rd place teams, including custom intramural champion championship hoodies. Co-ed rosters welcome. Hydration stations and referees provided.',
    category: 'Sports & Recreation',
    date: new Date(Date.now() + 86400000 * 15).toISOString(),
    startTime: '10:00',
    endTime: '15:00',
    location: 'Campus Recreation Center - Courts 1 & 2',
    maximumParticipants: 32,
    banner: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Global Campus Cultural Gala & Food Festival',
    description: 'Celebrate our vibrant international campus community! Enjoy traditional music, dance ensembles, fashion presentations, and authentic regional culinary tastings representing over 30 countries and cultural student associations.',
    category: 'Cultural',
    date: new Date(Date.now() + 86400000 * 20).toISOString(),
    startTime: '17:00',
    endTime: '22:00',
    location: 'Student Union Pavilion & Plaza',
    maximumParticipants: 250,
    banner: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Executive Leadership Roundtable (Full Event)',
    description: 'Exclusive fireside discussion with university alumni founders and venture partners on building venture-backed ventures right out of college. Limited intimate seating.',
    category: 'Career & Professional',
    date: new Date(Date.now() + 86400000 * 6).toISOString(),
    startTime: '16:00',
    endTime: '17:30',
    location: 'Alumni House - Boardroom A',
    maximumParticipants: 2,
    banner: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80',
  },
  {
    title: 'Astronomy Club Star-Gazing Night (Cancelled Due to Weather)',
    description: 'Observatory evening viewing Saturn rings and deep-sky nebulae through the university 16-inch Cassegrain telescope. Event has been cancelled due to forecasted heavy cloud cover.',
    category: 'Academic',
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    startTime: '20:00',
    endTime: '23:00',
    location: 'Physics Department Rooftop Observatory',
    maximumParticipants: 50,
    banner: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80',
  },
];

async function run() {
  console.log('Seeding campus events...');

  // 1. Create Organizer User
  const orgEmail = `event_organizer_${Date.now()}@campus.edu`;
  const regOrg = await post('/api/auth/register', {
    name: 'Campus Events Board',
    email: orgEmail,
    password: 'password123',
    role: 'organizer',
  });

  const orgToken = regOrg.body.token;
  console.log('Organizer registered:', orgEmail);

  // 2. Create Student User for testing registration
  const studentEmail = `alex.rivera_${Date.now()}@campus.edu`;
  const regStudent = await post('/api/auth/register', {
    name: 'Alex Rivera',
    email: studentEmail,
    password: 'password123',
    role: 'student',
  });
  const studentToken = regStudent.body.token;
  console.log('Student registered:', studentEmail);

  // 3. Create Another Student User to fill up capacity on the Full Event
  const student2Email = `jordan.lee_${Date.now()}@campus.edu`;
  const regStudent2 = await post('/api/auth/register', {
    name: 'Jordan Lee',
    email: student2Email,
    password: 'password123',
    role: 'student',
  });
  const student2Token = regStudent2.body.token;

  // 4. Create Student User 3
  const student3Email = `taylor.kim_${Date.now()}@campus.edu`;
  const regStudent3 = await post('/api/auth/register', {
    name: 'Taylor Kim',
    email: student3Email,
    password: 'password123',
    role: 'student',
  });
  const student3Token = regStudent3.body.token;

  const createdEvents = [];

  for (const ev of sampleEvents) {
    const res = await post('/api/events', ev, orgToken);
    if (res.body && res.body.data) {
      createdEvents.push(res.body.data);
      console.log(`Created event: ${res.body.data.title} (ID: ${res.body.data.id})`);
    } else {
      console.error('Failed to create event:', ev.title, res.body);
    }
  }

  // Set the "Full Event" to maximum capacity by registering 2 students
  const fullEv = createdEvents.find((e) => e.title.includes('(Full Event)'));
  if (fullEv) {
    await post(`/api/events/${fullEv.id}/register`, {}, student2Token);
    await post(`/api/events/${fullEv.id}/register`, {}, student3Token);
    console.log(`Filled event ${fullEv.id} to 2/2 capacity.`);
  }

  // Set the "Cancelled" event status to CANCELLED
  const cancelEv = createdEvents.find((e) => e.title.includes('Cancelled Due to Weather'));
  if (cancelEv) {
    await put(`/api/events/${cancelEv.id}`, { status: 'CANCELLED' }, orgToken);
    console.log(`Marked event ${cancelEv.id} as CANCELLED.`);
  }

  // Pre-register student 1 to the HackCampus event so we can test the "Registered" state & cancellation
  const hackEv = createdEvents.find((e) => e.title.includes('HackCampus'));
  if (hackEv) {
    await post(`/api/events/${hackEv.id}/register`, {}, studentToken);
    console.log(`Pre-registered Alex Rivera to ${hackEv.title}`);
  }

  console.log('\n--- Seed Summary ---');
  console.log('Student Email: ', studentEmail);
  console.log('Student Password: password123');
  console.log('Student Token: ', studentToken.substring(0, 20) + '...');
  console.log('Events created count: ', createdEvents.length);
  if (hackEv) console.log('HackCampus ID (Pre-registered): ', hackEv.id);
  if (fullEv) console.log('Full Event ID: ', fullEv.id);
  if (cancelEv) console.log('Cancelled Event ID: ', cancelEv.id);
}

run().catch(console.error);
