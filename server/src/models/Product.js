const mongoose = require('mongoose');

const PRODUCT_CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Stationery',
  'Sports & Fitness',
  'Dorm & Housing',
  'Other',
];

const PRODUCT_CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const PRODUCT_STATUS = ['ACTIVE', 'SOLD', 'ARCHIVED'];

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: {
        values: PRODUCT_CATEGORIES,
        message: '{VALUE} is not a valid category. Allowed: ' + PRODUCT_CATEGORIES.join(', '),
      },
      index: true,
    },
    condition: {
      type: String,
      required: [true, 'Product condition is required'],
      enum: {
        values: PRODUCT_CONDITIONS,
        message: '{VALUE} is not a valid condition. Allowed: ' + PRODUCT_CONDITIONS.join(', '),
      },
    },
    images: {
      type: [String],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Product seller is required'],
      index: true,
    },
    location: {
      type: String,
      trim: true,
      default: 'Campus Pickup',
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: {
        values: PRODUCT_STATUS,
        message: '{VALUE} is not a valid status. Allowed: ACTIVE, SOLD, ARCHIVED',
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
        return ret;
      },
    },
  }
);

// Compound text index for title & description full-text search
productSchema.index({ title: 'text', description: 'text' });

// Compound indexes for optimal query filtering
productSchema.index({ status: 1, category: 1, price: 1 });
productSchema.index({ status: 1, createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = {
  Product,
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  PRODUCT_STATUS,
};
