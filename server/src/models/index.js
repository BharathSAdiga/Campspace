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
};
