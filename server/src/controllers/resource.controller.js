const { resourceService } = require('../services');

const createResource = async (req, res, next) => {
  try {
    const resourceData = {
      ...req.body,
      createdBy: req.user.id,
    };
    
    const resource = await resourceService.createResource(resourceData);
    
    res.status(201).json({
      success: true,
      message: 'Resource created successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

const getResources = async (req, res, next) => {
  try {
    const resources = await resourceService.getResources(req.query);
    
    res.status(200).json({
      success: true,
      count: resources.length,
      data: resources,
    });
  } catch (error) {
    next(error);
  }
};

const getResourceById = async (req, res, next) => {
  try {
    const resource = await resourceService.getResourceById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

const updateResource = async (req, res, next) => {
  try {
    const resource = await resourceService.updateResource(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body
    );
    
    res.status(200).json({
      success: true,
      message: 'Resource updated successfully',
      data: resource,
    });
  } catch (error) {
    next(error);
  }
};

const deleteResource = async (req, res, next) => {
  try {
    const result = await resourceService.deleteResource(
      req.params.id,
      req.user.id,
      req.user.role
    );
    
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
};
