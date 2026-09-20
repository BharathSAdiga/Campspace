const { Event } = require('../models/Event');
const { EventRegistration } = require('../models/EventRegistration');

/**
 * Register a user for an active event
 * @param {String} eventId - Target event ID
 * @param {String} userId - Authenticated student ID
 * @returns {Promise<Object>} Registration details
 */
const registerForEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  // Business Rule: Event organizer cannot register as an attendee for their own event
  const organizerId =
    event.organizer?._id?.toString() ||
    event.organizer?.id?.toString() ||
    event.organizer?.toString();
  if (organizerId && organizerId === userId.toString()) {
    const error = new Error('You are the organizer of this event and cannot reserve attendee tickets');
    error.statusCode = 400;
    throw error;
  }

  // Business Rule: Cannot register for CANCELLED or CLOSED events
  if (event.status !== 'ACTIVE') {
    const error = new Error(`Cannot register for an event with status '${event.status}'`);
    error.statusCode = 400;
    throw error;
  }

  // Business Rule: Prevent duplicate registration
  const existingRegistration = await EventRegistration.findOne({
    event: eventId,
    user: userId,
  });

  if (existingRegistration && existingRegistration.status === 'REGISTERED') {
    const error = new Error('You are already registered for this event');
    error.statusCode = 400;
    throw error;
  }

  // Business Rule: Registration must not exceed maximumParticipants
  const currentCount = await EventRegistration.countDocuments({
    event: eventId,
    status: 'REGISTERED',
  });

  if (currentCount >= event.maximumParticipants) {
    const error = new Error('Event has reached its maximum participant capacity');
    error.statusCode = 400;
    throw error;
  }

  // Create or reactivate registration
  if (existingRegistration) {
    existingRegistration.status = 'REGISTERED';
    existingRegistration.registeredAt = new Date();
    await existingRegistration.save();
  } else {
    await EventRegistration.create({
      event: eventId,
      user: userId,
      status: 'REGISTERED',
    });
  }

  // Sync event current participants count
  const updatedCount = await EventRegistration.countDocuments({
    event: eventId,
    status: 'REGISTERED',
  });
  event.currentParticipants = updatedCount;
  await event.save();

  return {
    success: true,
    message: 'Successfully registered for event',
    eventId,
    currentParticipants: updatedCount,
    maximumParticipants: event.maximumParticipants,
    remainingSpots: Math.max(0, event.maximumParticipants - updatedCount),
  };
};

/**
 * Cancel current user's registration for an event
 * @param {String} eventId - Target event ID
 * @param {String} userId - Authenticated user ID
 * @returns {Promise<Object>} Cancellation result
 */
const cancelRegistration = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  // Find active registration for this user
  const registration = await EventRegistration.findOne({
    event: eventId,
    user: userId,
    status: 'REGISTERED',
  });

  if (!registration) {
    const error = new Error('You do not have an active registration for this event');
    error.statusCode = 400;
    throw error;
  }

  // Cancel only this user's registration
  registration.status = 'CANCELLED';
  await registration.save();

  // Sync event current participants count
  const updatedCount = await EventRegistration.countDocuments({
    event: eventId,
    status: 'REGISTERED',
  });
  event.currentParticipants = updatedCount;
  await event.save();

  return {
    success: true,
    message: 'Your event registration has been cancelled successfully',
    eventId,
    currentParticipants: updatedCount,
    remainingSpots: Math.max(0, event.maximumParticipants - updatedCount),
  };
};

/**
 * Fetch registrations for an event (Organizer or Admin only)
 * Safe handling: Exposes only safe participant fields (never password/secrets)
 * @param {String} eventId - Target event ID
 * @param {String} userId - Requesting user ID
 * @param {String} userRole - Requesting user role
 * @returns {Promise<Object>} List of attendee registrations
 */
const getEventRegistrations = async (eventId, userId, userRole) => {
  const event = await Event.findById(eventId);
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  // Authorization: Only event organizer or admin can view attendee list
  const isOwner = event.organizer.toString() === userId.toString();
  const isAdmin = userRole === 'admin';

  if (!isOwner && !isAdmin) {
    const error = new Error('Forbidden: Only the event organizer can view the registrations list');
    error.statusCode = 403;
    throw error;
  }

  const registrations = await EventRegistration.find({
    event: eventId,
    status: 'REGISTERED',
  })
    .sort({ registeredAt: 1 })
    .populate('user', 'name email role createdAt')
    .lean();

  const sanitizedAttendees = registrations.map((r) => {
    const item = { ...r, id: r._id.toString() };
    delete item._id;
    delete item.__v;
    if (item.user && item.user._id) {
      item.user.id = item.user._id.toString();
      delete item.user._id;
      delete item.user.__v;
      delete item.user.password;
    }
    return item;
  });

  return {
    eventId,
    eventTitle: event.title,
    count: sanitizedAttendees.length,
    maximumParticipants: event.maximumParticipants,
    data: sanitizedAttendees,
  };
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
};
