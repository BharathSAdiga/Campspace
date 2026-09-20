const { clubService } = require('../services');

const createClub = async (req, res, next) => {
  try {
    const clubData = {
      coordinator: req.user.id,
      ...req.body,
      createdBy: req.user.id,
    };
    
    // Automatically add the coordinator to members
    if (clubData.coordinator && !clubData.members?.includes(clubData.coordinator)) {
      clubData.members = [...(clubData.members || []), clubData.coordinator];
    }
    
    const club = await clubService.createClub(clubData);
    
    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: club,
    });
  } catch (error) {
    next(error);
  }
};

const getClubs = async (req, res, next) => {
  try {
    const clubs = await clubService.getClubs(req.query);
    
    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
    });
  } catch (error) {
    next(error);
  }
};

const getClubById = async (req, res, next) => {
  try {
    const club = await clubService.getClubById(req.params.id);
    
    res.status(200).json({
      success: true,
      data: club,
    });
  } catch (error) {
    next(error);
  }
};

const updateClub = async (req, res, next) => {
  try {
    const club = await clubService.updateClub(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body
    );
    
    res.status(200).json({
      success: true,
      message: 'Club updated successfully',
      data: club,
    });
  } catch (error) {
    next(error);
  }
};

const deleteClub = async (req, res, next) => {
  try {
    const result = await clubService.deleteClub(
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

const joinClub = async (req, res, next) => {
  try {
    const club = await clubService.joinClub(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Successfully joined the club',
      data: club,
    });
  } catch (error) {
    next(error);
  }
};

const leaveClub = async (req, res, next) => {
  try {
    const club = await clubService.leaveClub(req.params.id, req.user.id);
    
    res.status(200).json({
      success: true,
      message: 'Successfully left the club',
      data: club,
    });
  } catch (error) {
    next(error);
  }
};

const getMyClubs = async (req, res, next) => {
  try {
    const clubs = await clubService.getMyClubs(req.user.id);
    
    res.status(200).json({
      success: true,
      count: clubs.length,
      data: clubs,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
  joinClub,
  leaveClub,
  getMyClubs,
};
