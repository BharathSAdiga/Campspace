const { Club } = require('../models');

/**
 * Create a new club
 */
const createClub = async (clubData) => {
  const club = new Club(clubData);
  await club.save();
  return club;
};

/**
 * Get all clubs with optional filtering
 */
const getClubs = async (query = {}) => {
  const filter = {};
  
  if (query.category) {
    filter.category = query.category;
  }
  
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } },
    ];
  }

  const clubs = await Club.find(filter)
    .populate('coordinator', 'name email')
    .sort({ createdAt: -1 });
    
  return clubs;
};

/**
 * Get club by ID
 */
const getClubById = async (id) => {
  const club = await Club.findById(id)
    .populate('coordinator', 'name email')
    .populate('members', 'name email');
    
  if (!club) {
    const error = new Error('Club not found');
    error.status = 404;
    throw error;
  }
  return club;
};

/**
 * Update club
 */
const updateClub = async (id, userId, userRole, updateData) => {
  const club = await Club.findById(id);
  
  if (!club) {
    const error = new Error('Club not found');
    error.status = 404;
    throw error;
  }
  
  if (userRole !== 'admin' && club.coordinator.toString() !== userId.toString()) {
    const error = new Error('Not authorized to update this club');
    error.status = 403;
    throw error;
  }
  
  Object.assign(club, updateData);
  await club.save();
  
  return club;
};

/**
 * Delete club
 */
const deleteClub = async (id, userId, userRole) => {
  const club = await Club.findById(id);
  
  if (!club) {
    const error = new Error('Club not found');
    error.status = 404;
    throw error;
  }
  
  if (userRole !== 'admin' && club.coordinator.toString() !== userId.toString()) {
    const error = new Error('Not authorized to delete this club');
    error.status = 403;
    throw error;
  }
  
  await Club.deleteOne({ _id: id });
  return { message: 'Club deleted successfully' };
};

/**
 * Join a club
 */
const joinClub = async (clubId, userId) => {
  const club = await Club.findById(clubId);
  
  if (!club) {
    const error = new Error('Club not found');
    error.status = 404;
    throw error;
  }
  
  // Check if already a member
  if (club.members.includes(userId)) {
    const error = new Error('You are already a member of this club');
    error.status = 400;
    throw error;
  }
  
  club.members.push(userId);
  await club.save();
  
  return club;
};

/**
 * Leave a club
 */
const leaveClub = async (clubId, userId) => {
  const club = await Club.findById(clubId);
  
  if (!club) {
    const error = new Error('Club not found');
    error.status = 404;
    throw error;
  }
  
  if (!club.members.includes(userId)) {
    const error = new Error('You are not a member of this club');
    error.status = 400;
    throw error;
  }
  
  // Cannot leave if coordinator
  if (club.coordinator.toString() === userId.toString()) {
    const error = new Error('Coordinator cannot leave the club');
    error.status = 400;
    throw error;
  }
  
  club.members = club.members.filter(memberId => memberId.toString() !== userId.toString());
  await club.save();
  
  return club;
};

/**
 * Get clubs the user has joined
 */
const getMyClubs = async (userId) => {
  const clubs = await Club.find({ members: userId })
    .populate('coordinator', 'name email');
    
  return clubs;
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
