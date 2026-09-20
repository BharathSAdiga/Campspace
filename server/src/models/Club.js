const mongoose = require('mongoose');

const CLUB_CATEGORIES = [
  'Academic',
  'Cultural',
  'Sports',
  'Technology',
  'Arts',
  'Social',
  'Other',
];

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a club name'],
      trim: true,
      unique: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: {
        values: CLUB_CATEGORIES,
        message: '{VALUE} is not a valid category',
      },
      required: [true, 'Please provide a category'],
    },
    coordinator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
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

const Club = mongoose.model('Club', clubSchema);

module.exports = {
  Club,
  CLUB_CATEGORIES,
};
