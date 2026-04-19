const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Standard Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('course_id', 'name')
      .populate('class_id', 'name')
      .populate('taught_subjects', 'name');
      
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile_photo: user.profile_photo,
        dob: user.dob,
        sap_id: user.sap_id,
        roll_no: user.roll_no,
        faculty_id: user.faculty_id,
        admin_id: user.admin_id,
        blood_group: user.blood_group,
        contact_number: user.contact_number,
        address: user.address,
        course: user.course_id ? user.course_id.name : null,
        class: user.class_id ? user.class_id.name : null,
        taught_subjects: user.taught_subjects ? user.taught_subjects.map(s => s.name) : []
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Server error fetching user' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { email, dob, blood_group, address, contact_number } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email, dob, blood_group, address, contact_number },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        profile_photo: updatedUser.profile_photo,
        dob: updatedUser.dob,
        sap_id: updatedUser.sap_id,
        roll_no: updatedUser.roll_no,
        faculty_id: updatedUser.faculty_id,
        admin_id: updatedUser.admin_id,
        blood_group: updatedUser.blood_group,
        contact_number: updatedUser.contact_number,
        address: updatedUser.address
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Server error updating profile' });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const { base64Image } = req.body;

    if (!base64Image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Upload to Cloudinary using signed authentication 
    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: 'academic_portal/profiles',
      transformation: [
        { width: 400, height: 400, gravity: "face", crop: "thumb" } // Request Cloudinary to smart crop
      ]
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profile_photo: uploadResponse.secure_url },
      { new: true }
    );

    res.json({
      message: 'Photo updated successfully',
      profile_photo: updatedUser.profile_photo
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Server error uploading photo' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Please provide both old and new passwords' });
    }

    const bcrypt = require('bcryptjs');

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Server error changing password' });
  }
};
