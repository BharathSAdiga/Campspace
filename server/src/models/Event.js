const mongoose = require('mongoose');

const EVENT_CATEGORIES = [
  'Academic',
  'Career & Professional',
  'Social & Mixer',
  'Sports & Recreation',
  'Workshop & Seminar',
  'Cultural',
  'Tech & Hackathons',
  'Arts & Performance',
  'Other',
];

const EVENT_STATUS = ['ACTIVE', 'CANCELLED', 'CLOSED'];

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Event title must be at least 3 characters'],
      maxlength: [120, 'Event title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      minlength: [10, 'Event description must be at least 10 characters'],
      maxlength: [5000, 'Event description cannot exceed 5000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Event category is required'],
      enum: {
        values: EVENT_CATEGORIES,
        message: '{VALUE} is not a valid category. Allowed: ' + EVENT_CATEGORIES.join(', '),
      },
      index: true,
    },
    banner: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Event organizer is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      index: true,
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      trim: true,
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Event location is required'],
      trim: true,
      maxlength: [150, 'Location cannot exceed 150 characters'],
    },
    maximumParticipants: {
      type: Number,
      required: [true, 'Maximum participants limit is required'],
      min: [1, 'Maximum participants must be at least 1'],
    },
    currentParticipants: {
      type: Number,
      default: 0,
      min: [0, 'Current participants cannot be negative'],
    },
    status: {
      type: String,
      enum: {
        values: EVENT_STATUS,
        message: '{VALUE} is not a valid status. Allowed: ACTIVE, CANCELLED, CLOSED',
      },
      default: 'ACTIVE',
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        // Normalize banner/image
        if (!ret.banner && ret.image) ret.banner = ret.image;
        if (!ret.image && ret.banner) ret.image = ret.banner;
        return ret;
      },
    },
  }
);

// Full-text search index for searching events
eventSchema.index({ title: 'text', description: 'text', location: 'text' });

// Compound indexes for query filtering
eventSchema.index({ status: 1, date: 1 });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ organizer: 1, createdAt: -1 });

const Event = mongoose.model('Event', eventSchema);

module.exports = {
  Event,
  EVENT_CATEGORIES,
  EVENT_STATUS,
};
