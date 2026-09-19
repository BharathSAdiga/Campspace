const { User, USER_ROLES } = require('./User');
const {
  Product,
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  PRODUCT_STATUS,
} = require('./Product');
const { Wishlist } = require('./Wishlist');
const { Event, EVENT_CATEGORIES, EVENT_STATUS } = require('./Event');
const { EventRegistration, REGISTRATION_STATUS } = require('./EventRegistration');
const { Resource, RESOURCE_CATEGORIES, RESOURCE_STATUS } = require('./Resource');
const { Booking, BOOKING_STATUS } = require('./Booking');
const { Club, CLUB_CATEGORIES } = require('./Club');

module.exports = {
  User,
  USER_ROLES,
  Product,
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  PRODUCT_STATUS,
  Wishlist,
  Event,
  EVENT_CATEGORIES,
  EVENT_STATUS,
  EventRegistration,
  REGISTRATION_STATUS,
  Resource,
  RESOURCE_CATEGORIES,
  RESOURCE_STATUS,
  Booking,
  BOOKING_STATUS,
  Club,
  CLUB_CATEGORIES,
};
