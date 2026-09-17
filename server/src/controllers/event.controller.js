const eventService = require('../services/event.service');
const eventRegistrationService = require('../services/eventRegistration.service');
const {
  isValidObjectId,
  validateCreateEventInput,
  validateUpdateEventInput,
} = require('../validators/event.validator');

/**
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Private (Organizers and Admins only)
 */
const create = async (req, res, next) => {
  try {
    const { isValid, errors, sanitized } = validateCreateEventInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Event validation failed',
        errors,
      });
    }

    const organizerId = req.user.id || req.user._id;
    const event = await eventService.createEvent(sanitized, organizerId);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all events with filters and pagination
 * @route   GET /api/events
 * @access  Public
 */
const getAll = async (req, res, next) => {
  try {
    const result = await eventService.getEvents(req.query);

    res.status(200).json({
      success: true,
      count: result.count,
      total: result.total,
      pagination: result.pagination,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single event by ID
 * @route   GET /api/events/:id
 * @access  Public (Includes user registration status if authenticated)
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    const currentUserId = req.user ? req.user.id || req.user._id : null;
    const event = await eventService.getEventById(id, currentUserId);

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an event
 * @route   PUT /api/events/:id
 * @access  Private (Organizer owner or Admin)
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    const { isValid, errors, sanitized } = validateUpdateEventInput(req.body);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Event update validation failed',
        errors,
      });
    }

    const userId = req.user.id || req.user._id;
    const userRole = req.user.role;

    const updated = await eventService.updateEvent(id, sanitized, userId, userRole);

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Private (Organizer owner or Admin)
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    const userId = req.user.id || req.user._id;
    const userRole = req.user.role;

    const result = await eventService.deleteEvent(id, userId, userRole);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Register current user for an event
 * @route   POST /api/events/:id/register
 * @access  Private (Authenticated users)
 */
const register = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    const userId = req.user.id || req.user._id;
    const result = await eventRegistrationService.registerForEvent(id, userId);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel current user's registration for an event
 * @route   DELETE /api/events/:id/register
 * @access  Private (Authenticated users)
 */
const cancelRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    const userId = req.user.id || req.user._id;
    const result = await eventRegistrationService.cancelRegistration(id, userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get attendee registrations list for an event
 * @route   GET /api/events/:id/registrations
 * @access  Private (Organizer owner or Admin only)
 */
const getRegistrations = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format',
      });
    }

    const userId = req.user.id || req.user._id;
    const userRole = req.user.role;

    const result = await eventRegistrationService.getEventRegistrations(id, userId, userRole);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get events owned by authenticated organizer
 * @route   GET /api/events/my-events
 * @access  Private (Organizer owner or Admin)
 */
const getMyEvents = async (req, res, next) => {
  try {
    const organizerId = req.user.id || req.user._id;
    const events = await eventService.getMyEvents(organizerId, req.query);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  register,
  cancelRegistration,
  getRegistrations,
  getMyEvents,
};
