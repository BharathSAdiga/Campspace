const mongoose = require('mongoose');

const RESOURCE_CATEGORIES = [
  'Room',
  'Equipment',
  'Laboratory',
  'Sports',
  'Other',
];

const RESOURCE_STATUS = ['Available', 'Maintenance', 'Unavailable'];

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a resource name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      enum: {
        values: RESOURCE_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
      required: [true, 'Please provide a category'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
      trim: true,
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity must be at least 1'],
    },
    facilities: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: {
        values: RESOURCE_STATUS,
        message: '{VALUE} is not a valid status',
      },
      default: 'Available',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = {
  Resource,
  RESOURCE_CATEGORIES,
  RESOURCE_STATUS,
};
