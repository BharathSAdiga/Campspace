const { Resource } = require('../models');

/**
 * Create a new resource
 */
const createResource = async (resourceData) => {
  const resource = new Resource(resourceData);
  await resource.save();
  return resource;
};

/**
 * Get all resources with optional filtering
 */
const getResources = async (query = {}) => {
  const filter = {};
  
  if (query.category) {
    filter.category = query.category;
  }
  
  if (query.status) {
    filter.status = query.status;
  }
  
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
      { location: { $regex: query.search, $options: 'i' } },
    ];
  }

  const resources = await Resource.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
    
  return resources;
};

/**
 * Get resource by ID
 */
const getResourceById = async (id) => {
  const resource = await Resource.findById(id).populate('createdBy', 'name email');
  if (!resource) {
    const error = new Error('Resource not found');
    error.status = 404;
    throw error;
  }
  return resource;
};

/**
 * Update resource
 */
const updateResource = async (id, userId, userRole, updateData) => {
  const resource = await Resource.findById(id);
  
  if (!resource) {
    const error = new Error('Resource not found');
    error.status = 404;
    throw error;
  }
  
  // Only admin or the creator can update
  if (userRole !== 'admin' && resource.createdBy.toString() !== userId.toString()) {
    const error = new Error('Not authorized to update this resource');
    error.status = 403;
    throw error;
  }
  
  Object.assign(resource, updateData);
  await resource.save();
  
  return resource;
};

/**
 * Delete resource
 */
const deleteResource = async (id, userId, userRole) => {
  const resource = await Resource.findById(id);
  
  if (!resource) {
    const error = new Error('Resource not found');
    error.status = 404;
    throw error;
  }
  
  if (userRole !== 'admin' && resource.createdBy.toString() !== userId.toString()) {
    const error = new Error('Not authorized to delete this resource');
    error.status = 403;
    throw error;
  }
  
  await Resource.deleteOne({ _id: id });
  return { message: 'Resource deleted successfully' };
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
};
