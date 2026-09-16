const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: [
          'Textbooks',
          'Electronics',
          'Furniture',
          'Clothing',
          'Stationery',
          'Housing / Sublet',
          'Other',
        ],
        message: '{VALUE} is not a supported category',
      },
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: ['Brand New', 'Like New', 'Good', 'Fair', 'Poor'],
        message: '{VALUE} is not a valid condition',
      },
    },
    images: {
      type: [String],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller reference is required'],
    },
    status: {
      type: String,
      enum: ['available', 'reserved', 'sold'],
      default: 'available',
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location description cannot exceed 100 characters'],
      default: 'Campus Area',
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high-performance filtering & search
listingSchema.index({ category: 1, status: 1, createdAt: -1 });
listingSchema.index({ price: 1 });
listingSchema.index({ seller: 1, status: 1 });
listingSchema.index({ title: 'text', description: 'text' });

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
