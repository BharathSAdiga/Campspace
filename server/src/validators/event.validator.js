const mongoose = require('mongoose');
const { EVENT_CATEGORIES, EVENT_STATUS } = require('../models/Event');

/**
 * Validate MongoDB ObjectId
 * @param {String} id
 * @returns {Boolean}
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Validate Event Creation Payload
 * @param {Object} data - req.body
 * @returns {Object} { isValid, errors, sanitized }
 */
const validateCreateEventInput = (data) => {
  const errors = {};

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const description = typeof data.description === 'string' ? data.description.trim() : '';
  const category = typeof data.category === 'string' ? data.category.trim() : '';
  const location = typeof data.location === 'string' ? data.location.trim() : '';
  const startTime = typeof data.startTime === 'string' ? data.startTime.trim() : '';
  const endTime = typeof data.endTime === 'string' ? data.endTime.trim() : '';
  const banner = typeof data.banner === 'string' ? data.banner.trim() : (typeof data.image === 'string' ? data.image.trim() : '');
  const image = typeof data.image === 'string' ? data.image.trim() : banner;

  const maxParticipants =
    data.maximumParticipants !== undefined && data.maximumParticipants !== null
      ? Number(data.maximumParticipants)
      : NaN;

  // Title validation
  if (!title) {
    errors.title = 'Event title is required';
  } else if (title.length < 3 || title.length > 120) {
    errors.title = 'Event title must be between 3 and 120 characters';
  }

  // Description validation
  if (!description) {
    errors.description = 'Event description is required';
  } else if (description.length < 10 || description.length > 5000) {
    errors.description = 'Event description must be between 10 and 5000 characters';
  }

  // Category validation
  if (!category) {
    errors.category = 'Event category is required';
  } else if (!EVENT_CATEGORIES.includes(category)) {
    errors.category = `Invalid category. Allowed: ${EVENT_CATEGORIES.join(', ')}`;
  }

  // Location validation
  if (!location) {
    errors.location = 'Event location is required';
  } else if (location.length > 150) {
    errors.location = 'Location cannot exceed 150 characters';
  }

  // Date validation
  if (!data.date) {
    errors.date = 'Event date is required';
  } else {
    const parsedDate = new Date(data.date);
    if (isNaN(parsedDate.getTime())) {
      errors.date = 'Please provide a valid event date format (e.g. YYYY-MM-DD)';
    }
  }

  // Start & End Time validation
  if (!startTime) {
    errors.startTime = 'Start time is required (e.g. 14:00 or 2:00 PM)';
  }
  if (!endTime) {
    errors.endTime = 'End time is required (e.g. 16:00 or 4:00 PM)';
  }

  // Maximum participants validation
  if (isNaN(maxParticipants)) {
    errors.maximumParticipants = 'Maximum participants limit is required';
  } else if (!Number.isInteger(maxParticipants) || maxParticipants < 1) {
    errors.maximumParticipants = 'Maximum participants must be a positive integer greater than or equal to 1';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      title,
      description,
      category,
      location,
      date: new Date(data.date),
      startTime,
      endTime,
      maximumParticipants: maxParticipants,
      banner,
      image,
      status: data.status && EVENT_STATUS.includes(data.status) ? data.status : 'ACTIVE',
    },
  };
};

/**
 * Validate Event Update Payload
 * @param {Object} data - req.body
 * @returns {Object} { isValid, errors, sanitized }
 */
const validateUpdateEventInput = (data) => {
  const errors = {};
  const sanitized = {};

  if (data.title !== undefined) {
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    if (!title || title.length < 3 || title.length > 120) {
      errors.title = 'Event title must be between 3 and 120 characters';
    } else {
      sanitized.title = title;
    }
  }

  if (data.description !== undefined) {
    const description = typeof data.description === 'string' ? data.description.trim() : '';
    if (!description || description.length < 10 || description.length > 5000) {
      errors.description = 'Event description must be between 10 and 5000 characters';
    } else {
      sanitized.description = description;
    }
  }

  if (data.category !== undefined) {
    const category = typeof data.category === 'string' ? data.category.trim() : '';
    if (!EVENT_CATEGORIES.includes(category)) {
      errors.category = `Invalid category. Allowed: ${EVENT_CATEGORIES.join(', ')}`;
    } else {
      sanitized.category = category;
    }
  }

  if (data.location !== undefined) {
    const location = typeof data.location === 'string' ? data.location.trim() : '';
    if (!location || location.length > 150) {
      errors.location = 'Location must be between 1 and 150 characters';
    } else {
      sanitized.location = location;
    }
  }

  if (data.date !== undefined) {
    const parsedDate = new Date(data.date);
    if (isNaN(parsedDate.getTime())) {
      errors.date = 'Invalid date format';
    } else {
      sanitized.date = parsedDate;
    }
  }

  if (data.startTime !== undefined) {
    const startTime = typeof data.startTime === 'string' ? data.startTime.trim() : '';
    if (!startTime) {
      errors.startTime = 'Start time cannot be empty';
    } else {
      sanitized.startTime = startTime;
    }
  }

  if (data.endTime !== undefined) {
    const endTime = typeof data.endTime === 'string' ? data.endTime.trim() : '';
    if (!endTime) {
      errors.endTime = 'End time cannot be empty';
    } else {
      sanitized.endTime = endTime;
    }
  }

  if (data.maximumParticipants !== undefined) {
    const max = Number(data.maximumParticipants);
    if (isNaN(max) || !Number.isInteger(max) || max < 1) {
      errors.maximumParticipants = 'Maximum participants must be a positive integer >= 1';
    } else {
      sanitized.maximumParticipants = max;
    }
  }

  if (data.status !== undefined) {
    if (!EVENT_STATUS.includes(data.status)) {
      errors.status = `Invalid status. Allowed: ${EVENT_STATUS.join(', ')}`;
    } else {
      sanitized.status = data.status;
    }
  }

  if (data.banner !== undefined || data.image !== undefined) {
    const imgUrl = (typeof data.banner === 'string' ? data.banner : (typeof data.image === 'string' ? data.image : '')).trim();
    sanitized.banner = imgUrl;
    sanitized.image = imgUrl;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
};

module.exports = {
  isValidObjectId,
  validateCreateEventInput,
  validateUpdateEventInput,
};
