const { Booking, Resource } = require('../models');

/**
 * Helper to check for overlapping bookings
 */
const hasOverlap = async (resourceId, date, startTime, endTime) => {
  // Overlap logic:
  // An overlap occurs if an existing booking is on the same date and resource,
  // is NOT Cancelled or Rejected, and:
  // existing.startTime < new.endTime AND existing.endTime > new.startTime
  
  const overlappingBookings = await Booking.find({
    resource: resourceId,
    date: date,
    status: { $in: ['Pending', 'Approved'] },
    startTime: { $lt: endTime },
    endTime: { $gt: startTime }
  });
  
  return overlappingBookings.length > 0;
};

/**
 * Create a new booking
 */
const createBooking = async (bookingData) => {
  const { resource, user, date, startTime, endTime, purpose } = bookingData;
  
  // Verify resource exists and is available
  const resourceDoc = await Resource.findById(resource);
  if (!resourceDoc) {
    const error = new Error('Resource not found');
    error.status = 404;
    throw error;
  }
  
  if (resourceDoc.status !== 'Available') {
    const error = new Error(`Resource is currently ${resourceDoc.status.toLowerCase()}`);
    error.status = 400;
    throw error;
  }
  
  if (startTime >= endTime) {
    const error = new Error('End time must be after start time');
    error.status = 400;
    throw error;
  }
  
  const isOverlapping = await hasOverlap(resource, date, startTime, endTime);
  if (isOverlapping) {
    const error = new Error('The resource is already booked for this time slot');
    error.status = 409;
    throw error;
  }
  
  const booking = new Booking({
    resource,
    user,
    date,
    startTime,
    endTime,
    purpose,
    status: 'Pending'
  });
  
  await booking.save();
  return booking.populate('resource', 'name location');
};

/**
 * Get bookings for a specific user
 */
const getMyBookings = async (userId) => {
  const bookings = await Booking.find({ user: userId })
    .populate('resource', 'name location category')
    .sort({ date: -1, startTime: -1 });
    
  return bookings;
};

/**
 * Get all bookings (for admins/organizers)
 */
const getAllBookings = async (query = {}) => {
  const filter = {};
  
  if (query.resource) filter.resource = query.resource;
  if (query.status) filter.status = query.status;
  
  const bookings = await Booking.find(filter)
    .populate('resource', 'name location')
    .populate('user', 'name email')
    .sort({ date: -1, startTime: -1 });
    
  return bookings;
};

/**
 * Cancel a booking
 */
const cancelBooking = async (id, userId) => {
  const booking = await Booking.findById(id);
  
  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }
  
  if (booking.user.toString() !== userId.toString()) {
    const error = new Error('Not authorized to cancel this booking');
    error.status = 403;
    throw error;
  }
  
  if (booking.status === 'Cancelled' || booking.status === 'Rejected') {
    const error = new Error('Booking is already cancelled or rejected');
    error.status = 400;
    throw error;
  }
  
  booking.status = 'Cancelled';
  await booking.save();
  
  return booking;
};

/**
 * Approve or Reject a booking (Admin/Organizer)
 */
const updateBookingStatus = async (id, status, userId, userRole) => {
  // In a real app we might check if user is admin or the organizer who created the resource.
  // For now we allow 'admin' or 'organizer' based on role.
  if (userRole !== 'admin' && userRole !== 'organizer') {
    const error = new Error('Not authorized to manage bookings');
    error.status = 403;
    throw error;
  }
  
  const booking = await Booking.findById(id);
  if (!booking) {
    const error = new Error('Booking not found');
    error.status = 404;
    throw error;
  }
  
  if (!['Approved', 'Rejected'].includes(status)) {
    const error = new Error('Invalid status');
    error.status = 400;
    throw error;
  }
  
  // If approving, we must double check overlap again just in case another booking was approved in the meantime
  if (status === 'Approved') {
    // Only check against other approved/pending if this one wasn't already approved
    if (booking.status !== 'Approved') {
       // Find other approved bookings that overlap
       const overlappingBookings = await Booking.find({
          _id: { $ne: booking._id },
          resource: booking.resource,
          date: booking.date,
          status: 'Approved',
          startTime: { $lt: booking.endTime },
          endTime: { $gt: booking.startTime }
        });
        
        if (overlappingBookings.length > 0) {
          const error = new Error('Cannot approve: another approved booking overlaps with this time slot');
          error.status = 409;
          throw error;
        }
    }
  }
  
  booking.status = status;
  await booking.save();
  
  return booking;
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
  updateBookingStatus,
};
