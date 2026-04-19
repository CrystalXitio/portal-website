const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.signup = async (req, res) => {
  try {
    const { username, password, email, role, dob, sap_id, roll_no, faculty_id, admin_id, blood_group, contact_number, address, course_id, class_id, taught_subjects } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or Email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      dob,
      sap_id,
      roll_no,
      faculty_id,
      admin_id,
      blood_group,
      contact_number,
      address,
      course_id: course_id || undefined,
      class_id: class_id || undefined,
      taught_subjects: (taught_subjects && Array.isArray(taught_subjects)) 
        ? taught_subjects.filter(st => st !== '') 
        : undefined
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during signup' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
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
        address: user.address
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error during login' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists, just return success
      return res.json({ message: 'If email exists, an OTP will be sent.' });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    const html = `<h2>Password Reset</h2>
    <p>Your OTP is: <strong>${otp}</strong></p>
    <p>This OTP is valid for 10 minutes.</p>`;

    await sendEmail({ to: email, subject: 'Password Reset OTP', html });
    res.json({ message: 'OTP sent to email' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error asking for OTP' });
  }
};

exports.verifyOtpAndResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.resetOtp !== otp || user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error resetting password' });
  }
};
