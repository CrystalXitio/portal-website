const User = require('../models/User');
const Course = require('../models/Course');
const Ticket = require('../models/Ticket');
const Subject = require('../models/Subject');
const ClassSchema = require('../models/Class');
const Announcement = require('../models/Announcement');
const Fee = require('../models/Fee');

const models = {
  course: Course,
  subject: Subject,
  class: ClassSchema,
  announcement: Announcement,
  ticket: Ticket,
  user: User,
  fee: Fee,
};
exports.getStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const activeCourses = await Course.countDocuments();
    const openTickets = await Ticket.countDocuments({ status: { $regex: /^open$/i } });

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalTeachers,
        activeCourses,
        openTickets,
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const role = req.query.role || { $in: ['student', 'teacher', 'admin'] };
    // fetch users mapping role
    let query = {};
    if (req.query.role) query.role = req.query.role;

    const users = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own admin account.' });
    }

    const unlinkedUser = await User.findByIdAndDelete(id);
    if (!unlinkedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

exports.getResource = async (req, res) => {
  try {
    const modelParam = req.params.model.toLowerCase();
    let Model = models[modelParam];
    
    if (modelParam === 'fees') Model = models['fee']; // plural fallback alias just in case
    
    if (!Model) return res.status(400).json({ error: 'Invalid resource type' });
    
    let data = await Model.find().sort({ createdAt: -1 });

    // Seeding logic for Fees specifically as requested
    if ((modelParam === 'fee' || modelParam === 'fees') && data.length === 0) {
      const students = await User.find({ role: 'student' }).limit(5);
      if (students.length > 0) {
        const dummyFees = students.map(s => ({
          student_id: s._id,
          amount: Math.floor(Math.random() * 50000 + 10000),
          description: 'Semester Tuition Fee',
          status: Math.random() > 0.5 ? 'Paid' : 'Pending',
          due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }));
        await Model.insertMany(dummyFees);
        data = await Model.find().sort({ createdAt: -1 }); // refetch
      }
    }
    
    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
};

exports.createResource = async (req, res) => {
  try {
    const Model = models[req.params.model.toLowerCase()];
    if (!Model) return res.status(400).json({ error: 'Invalid resource type' });
    const newRecord = new Model(req.body);
    await newRecord.save();
    res.json({ success: true, data: newRecord });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create resource' });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const Model = models[req.params.model.toLowerCase()];
    if (!Model) return res.status(400).json({ error: 'Invalid resource type' });
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update resource' });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const Model = models[req.params.model.toLowerCase()];
    if (!Model) return res.status(400).json({ error: 'Invalid resource type' });
    await Model.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resource' });
  }
};
