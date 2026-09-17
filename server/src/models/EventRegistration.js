const mongoose = require('mongoose');

const REGISTRATION_STATUS = ['REGISTERED', 'CANCELLED'];

const eventRegistrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: REGISTRATION_STATUS,
        message: '{VALUE} is not a valid registration status. Allowed: REGISTERED, CANCELLED',
      },
      default: 'REGISTERED',
      index: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Compound unique index ensuring a user can register for an event only once
eventRegistrationSchema.index({ event: 1, user: 1 }, { unique: true });

// Compound index for counting active participants and fetching event rosters efficiently
eventRegistrationSchema.index({ event: 1, status: 1 });

const EventRegistration = mongoose.model('EventRegistration', eventRegistrationSchema);

module.exports = {
  EventRegistration,
  REGISTRATION_STATUS,
};
