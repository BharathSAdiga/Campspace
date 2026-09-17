const { Event } = require('../models/Event');
const { EventRegistration } = require('../models/EventRegistration');
const { parseTimeToMinutes } = require('../validators/event.validator');

/**
 * Escapes regex special characters to prevent ReDoS and regex syntax crashes
 * @param {String} string
 * @returns {String}
 */
const escapeRegex = (string) => {
  if (typeof string !== 'string') return '';
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Create a new event listing
 * @param {Object} eventData - Validated event attributes
 * @param {String} organizerId - Authenticated organizer ID
 * @returns {Promise<Object>} Created event document
 */
const createEvent = async (eventData, organizerId) => {
  const event = await Event.create({
    ...eventData,
    organizer: organizerId,
    currentParticipants: 0,
  });

  const populated = await Event.findById(event._id).populate(
    'organizer',
    'name email role'
  );

  return populated;
};

/**
 * Fetch paginated and filtered events
 * @param {Object} query - Query parameters
 * @returns {Promise<Object>} { data, pagination, total }
 */
const getEvents = async (query = {}) => {
  const {
    search,
    category,
    status = 'ACTIVE',
    startDate,
    endDate,
    organizer,
    sort = 'soonest',
    page = 1,
    limit = 12,
  } = query;

  const filter = {};

  // Status filtering (if 'ALL', show any status; otherwise default to ACTIVE)
  if (status && status.toUpperCase() !== 'ALL') {
    filter.status = status.toUpperCase();
  }

  // Category filter
  if (category && category !== 'ALL') {
    filter.category = category;
  }

  // Organizer filter
  if (organizer) {
    filter.organizer = organizer;
  }

  // Date range filter
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      const parsedStart = new Date(startDate);
      if (!isNaN(parsedStart.getTime())) {
        filter.date.$gte = parsedStart;
      }
    }
    if (endDate) {
      const parsedEnd = new Date(endDate);
      if (!isNaN(parsedEnd.getTime())) {
        filter.date.$lte = parsedEnd;
      }
    }
  }

  // Search filter across title, description, or location safely
  if (search && search.trim()) {
    const term = escapeRegex(search.trim());
    filter.$or = [
      { title: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { location: { $regex: term, $options: 'i' } },
    ];
  }

  // Sorting
  let sortCriteria = { date: 1, startTime: 1 };
  switch (sort) {
    case 'newest':
      sortCriteria = { createdAt: -1 };
      break;
    case 'oldest':
      sortCriteria = { createdAt: 1 };
      break;
    case 'soonest':
      sortCriteria = { date: 1, startTime: 1 };
      break;
    case 'latest_date':
      sortCriteria = { date: -1 };
      break;
    case 'most_popular':
      sortCriteria = { currentParticipants: -1 };
      break;
    default:
      sortCriteria = { date: 1, startTime: 1 };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
  const skip = (pageNum - 1) * limitNum;

  const [events, total] = await Promise.all([
    Event.find(filter)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limitNum)
      .populate('organizer', 'name email role')
      .lean(),
    Event.countDocuments(filter),
  ]);

  const mapped = events.map((e) => {
    const item = { ...e, id: e._id.toString() };
    delete item._id;
    delete item.__v;
    if (!item.banner && item.image) item.banner = item.image;
    if (!item.image && item.banner) item.image = item.banner;
    return item;
  });

  return {
    count: mapped.length,
    total,
    pagination: {
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum) || 1,
      hasNext: pageNum * limitNum < total,
      hasPrev: pageNum > 1,
    },
    data: mapped,
  };
};

/**
 * Fetch single event by ID
 * @param {String} id - Event ID
 * @param {String} currentUserId - Optional user ID to check registration
 * @returns {Promise<Object>} Event document
 */
const getEventById = async (id, currentUserId = null) => {
  const event = await Event.findById(id).populate('organizer', 'name email role');
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  const result = event.toJSON ? event.toJSON() : event.toObject();

  // Check if current user is registered
  if (currentUserId) {
    const registration = await EventRegistration.findOne({
      event: id,
      user: currentUserId,
      status: 'REGISTERED',
    });
    result.isRegistered = Boolean(registration);
  } else {
    result.isRegistered = false;
  }

  // Calculate spots remaining
  result.remainingSpots = Math.max(0, result.maximumParticipants - (result.currentParticipants || 0));

  return result;
};

/**
 * Update an existing event (Owner or Admin only)
 * @param {String} id - Event ID
 * @param {Object} updateData - Validated updates
 * @param {String} userId - Requesting user ID
 * @param {String} userRole - Requesting user role
 * @returns {Promise<Object>} Updated event
 */
const updateEvent = async (id, updateData, userId, userRole) => {
  const event = await Event.findById(id);
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  // Ownership verification
  const isOwner = event.organizer.toString() === userId.toString();
  const isAdmin = userRole === 'admin';

  if (!isOwner && !isAdmin) {
    const error = new Error('Forbidden: You are not authorized to modify this event');
    error.statusCode = 403;
    throw error;
  }

  // Never allow changing the original organizer via update
  delete updateData.organizer;

  // Prevent invalid chronology on partial time updates
  const effectiveStartTime = updateData.startTime || event.startTime;
  const effectiveEndTime = updateData.endTime || event.endTime;
  if (effectiveStartTime && effectiveEndTime) {
    const startMin = parseTimeToMinutes(effectiveStartTime);
    const endMin = parseTimeToMinutes(effectiveEndTime);
    if (startMin !== null && endMin !== null && endMin <= startMin) {
      const error = new Error('End time must be after start time');
      error.statusCode = 400;
      throw error;
    }
  }

  // Prevent reducing maximum capacity below current registrations
  if (
    updateData.maximumParticipants !== undefined &&
    updateData.maximumParticipants < (event.currentParticipants || 0)
  ) {
    const error = new Error(
      `Cannot reduce maximum capacity to ${updateData.maximumParticipants} because ${event.currentParticipants} attendees are already registered.`
    );
    error.statusCode = 400;
    throw error;
  }

  Object.assign(event, updateData);
  await event.save();

  const updated = await Event.findById(id).populate('organizer', 'name email role');
  return updated;
};

/**
 * Delete an existing event (Owner or Admin only)
 * @param {String} id - Event ID
 * @param {String} userId - Requesting user ID
 * @param {String} userRole - Requesting user role
 * @returns {Promise<Object>} Result message
 */
const deleteEvent = async (id, userId, userRole) => {
  const event = await Event.findById(id);
  if (!event) {
    const error = new Error('Event not found');
    error.statusCode = 404;
    throw error;
  }

  // Ownership verification
  const isOwner = event.organizer.toString() === userId.toString();
  const isAdmin = userRole === 'admin';

  if (!isOwner && !isAdmin) {
    const error = new Error('Forbidden: You are not authorized to delete this event');
    error.statusCode = 403;
    throw error;
  }

  // Clean up registrations
  await EventRegistration.deleteMany({ event: id });

  // Delete event
  await Event.findByIdAndDelete(id);

  return { success: true, message: 'Event and associated registrations deleted successfully' };
};

/**
 * Fetch events owned by the authenticated organizer
 * @param {String} organizerId - Authenticated organizer ID
 * @param {Object} query - Optional status or sort query
 * @returns {Promise<Array>} List of events owned by organizer
 */
const getMyEvents = async (organizerId, query = {}) => {
  const filter = { organizer: organizerId };

  if (query.status && query.status.toUpperCase() !== 'ALL') {
    filter.status = query.status.toUpperCase();
  }

  let sortCriteria = { date: 1, startTime: 1 };
  if (query.sort === 'newest') sortCriteria = { createdAt: -1 };
  if (query.sort === 'oldest') sortCriteria = { createdAt: 1 };
  if (query.sort === 'most_popular') sortCriteria = { currentParticipants: -1 };

  const events = await Event.find(filter)
    .sort(sortCriteria)
    .populate('organizer', 'name email role')
    .lean();

  return events.map((e) => {
    const item = { ...e, id: e._id.toString() };
    delete item._id;
    delete item.__v;
    if (!item.banner && item.image) item.banner = item.image;
    if (!item.image && item.banner) item.image = item.banner;
    item.remainingSpots = Math.max(0, (item.maximumParticipants || 0) - (item.currentParticipants || 0));
    return item;
  });
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getMyEvents,
};
