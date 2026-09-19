const mongoose = require('mongoose');

const BOOKING_STATUS = ['Pending', 'Approved', 'Rejected', 'Cancelled'];

const bookingSchema = new mongoose.Schema(
  {
    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resource',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: [true, 'Please provide a booking date'],
    },
    startTime: {
      type: String,
      required: [true, 'Please provide a start time (e.g., 10:00)'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide a valid time format (HH:MM)'],
    },
    endTime: {
      type: String,
      required: [true, 'Please provide an end time (e.g., 12:00)'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Please provide a valid time format (HH:MM)'],
    },
    purpose: {
      type: String,
      required: [true, 'Please provide a purpose for the booking'],
      maxlength: [500, 'Purpose cannot exceed 500 characters'],
    },
    status: {
      type: String,
      enum: {
        values: BOOKING_STATUS,
        message: '{VALUE} is not a valid status',
      },
      default: 'Pending',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = {
  Booking,
  BOOKING_STATUS,
};
