const { validateRegisterInput, validateLoginInput } = require('./auth.validator');
const {
  isValidObjectId,
  validateCreateProductInput,
  validateUpdateProductInput,
  validateStatusInput,
} = require('./product.validator');

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  isValidObjectId,
  validateCreateProductInput,
  validateUpdateProductInput,
  validateStatusInput,
};
