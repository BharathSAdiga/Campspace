const mongoose = require('mongoose');
const { User } = require('./src/models/User');

const API_URL = 'http://localhost:5000/api';

async function fetchApi(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });
  const data = await res.json();
  if (!res.ok) {
    const error = new Error(data.message || 'API Error');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

async function runTests() {
  console.log('Starting module integration tests...');
  
  // 1. Connect to DB to get user info
  await mongoose.connect('mongodb://127.0.0.1:27017/campspace');
  console.log('Connected to DB');

  // Ensure users exist
  const adminUser = await User.findOne({ role: 'admin' });
  const studentUser = await User.findOne({ role: 'student' });
  
  if (!adminUser || !studentUser) {
    console.error('Please run a seed script to ensure test users exist.');
    process.exit(1);
  }

  // Login both users to get tokens
  const adminRes = await fetchApi(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email: adminUser.email, password: 'password123' })
  });
  const adminToken = adminRes.token;

  const studentRes = await fetchApi(`${API_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email: studentUser.email, password: 'password123' })
  });
  const studentToken = studentRes.token;

  console.log('Users authenticated successfully');

  // ---------------------------------------------------------
  // RESOURCE TESTS
  // ---------------------------------------------------------
  console.log('\n--- Testing Resources ---');
  let resourceId;
  
  try {
    const createRes = await fetchApi(`${API_URL}/resources`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: 'Main Auditorium',
        description: 'Large hall for events',
        category: 'Room',
        location: 'Block A, 1st Floor',
        capacity: 500,
        facilities: ['Projector', 'Sound System', 'AC']
      })
    });
    resourceId = createRes.data.id;
    console.log('✅ Resource created successfully:', resourceId);

    const getRes = await fetchApi(`${API_URL}/resources`);
    console.log(`✅ Get resources successful: ${getRes.count} found`);

  } catch (err) {
    console.error('❌ Resource tests failed:', err.data || err.message);
  }

  // ---------------------------------------------------------
  // BOOKING TESTS
  // ---------------------------------------------------------
  console.log('\n--- Testing Bookings ---');
  let bookingId;
  
  try {
    const bookingRes = await fetchApi(`${API_URL}/bookings`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` },
      body: JSON.stringify({
        resource: resourceId,
        date: '2026-10-15',
        startTime: '10:00',
        endTime: '12:00',
        purpose: 'Tech Talk'
      })
    });
    bookingId = bookingRes.data.id;
    console.log('✅ Booking created successfully:', bookingId);

    try {
      await fetchApi(`${API_URL}/bookings`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
        body: JSON.stringify({
          resource: resourceId,
          date: '2026-10-15',
          startTime: '11:00', // Overlaps
          endTime: '13:00',
          purpose: 'Overlap Test'
        })
      });
      console.error('❌ Overlap detection FAILED (allowed overlapping booking)');
    } catch (err) {
      if (err.status === 409) {
        console.log('✅ Overlap detection working correctly (409 conflict returned)');
      } else {
        console.error('❌ Overlap detection failed with wrong error:', err.data || err.message);
      }
    }

    const myBookings = await fetchApi(`${API_URL}/bookings/my`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log(`✅ Get my bookings successful: ${myBookings.count} found`);

    await fetchApi(`${API_URL}/bookings/${bookingId}/approve`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Booking approved successfully');

  } catch (err) {
    console.error('❌ Booking tests failed:', err.data || err.message);
  }

  // ---------------------------------------------------------
  // CLUB TESTS
  // ---------------------------------------------------------
  console.log('\n--- Testing Clubs ---');
  let clubId;
  
  try {
    const createClubRes = await fetchApi(`${API_URL}/clubs`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        name: 'Robotics Club ' + Date.now(),
        description: 'Building robots and drones.',
        category: 'Technology',
        coordinator: adminUser._id
      })
    });
    clubId = createClubRes.data.id;
    console.log('✅ Club created successfully:', clubId);

    await fetchApi(`${API_URL}/clubs/${clubId}/join`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log('✅ Club joined successfully');

    try {
      await fetchApi(`${API_URL}/clubs/${clubId}/join`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      console.error('❌ Duplicate join prevention FAILED');
    } catch (err) {
      if (err.status === 400) {
        console.log('✅ Duplicate join prevention working correctly (400 returned)');
      } else {
        console.error('❌ Duplicate join failed with wrong error:', err.data || err.message);
      }
    }

    await fetchApi(`${API_URL}/clubs/${clubId}/leave`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log('✅ Club left successfully');

  } catch (err) {
    console.error('❌ Club tests failed:', err.data || err.message);
  }

  console.log('\nAll tests completed.');
  process.exit(0);
}

runTests();
